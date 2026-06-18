import { unsafeWindow } from "$";
import { MAX_RARITY } from "../constants/constants";
import { flowrMod } from "../inits/initFlowrscriptPointer";
import { settings } from "../settings/settingsManager";
import { isNil } from "../utils";

/**
 * This feature contains some optimizations for High Quality Renders:
 * - Non-animated petals now use the game's built-in cache system instead of
 *   regenerating their own images every frame.
 * - There is also a setting to disable animations for all petals.
 * - Since the petals' fancy backgrounds move in unison, they are now simply
 *   generated once every frame and then applied to every petal for that frame.
 *   This is implemented by caching one nameless Air petal for every required
 *   rarity on every frame, then using them as backgrounds for all actual
 *   petals.
 * - There is also a setting to disable the petal background stars entirely.
 * 
 * The code for caching the Air petals is adapted from Flowr's caching code.
 */
export function optimizeHighQualityRenders() {
  // Initialize the air petals that will be drawn and cached once every frame
  const airCachedThisFrame: boolean[] = [];
  const airCanvases: OffscreenCanvas[] = [];
  const airCtx: (OffscreenCanvasRenderingContext2D | null)[] = [];
  const airPetals: PetalContainer[] = [];
  initializeCachedAir();

  const originalDraw = draw;
  draw = function() {
    // If optimizations are disabled, just render the game as usual
    if (settings.get("disableAllOptimizations")) {
      originalDraw();
      return;
    }

    // Reset the cached air images from the previous frame
    for (let rarity = 0; rarity <= MAX_RARITY; rarity++) {
      airCachedThisFrame[rarity] = false;
      airCtx[rarity]?.reset();
    }

    originalDraw();
  }

  const originalDrawPetal = PetalContainer.prototype.draw;
  PetalContainer.prototype.draw = function(inGame?: boolean, number?: number) {
    // Hide stars if the "Disable Stars" setting is turned ON
    if (settings.get("disablePetalStars") 
      && !settings.get("disableAllOptimizations")
      && !isNil(this.stars)
    ) {
      for (let star of this.stars) {
        star.x = Infinity;
        star.y = Infinity;
      }
    } else if (!isNil(this.stars)) {
      // Unhide stars by setting their coordinates to finite numbers. Then,
      // Flowr's base code will handle teleporting all stars back in bounds.
      for (let star of this.stars) {
        if (!Number.isFinite(star.x)) {
          star.x = 1e99;
        }
        if (!Number.isFinite(star.y)) {
          star.y = 1e99;
        }
      }
    }

    // Draw the petal as normal if:
    // 1. Optimizations are disabled,
    // 2. This petal is an Air petal to be cached,
    // 3. The "High Quality Renders" setting is turned off,
    // 4. This petal needs to be animated, or
    // 5. This petal has an active reload timer (which would cover up the
    //    petal's border if we were to use the cached background + border).
    if (settings.get("disableAllOptimizations")
      || this === airPetals[this.rarity]
      || (!unsafeWindow.hqp || flowrMod?.noFancy)
      || this.shouldAnimate() 
      || (inGame && !isNil(number) && !isNil(petalReloadData[number]))
    ) {
      originalDrawPetal.apply(this, [inGame, number]);
      return;
    } else {
      this.shouldDrawCachedAir = true;
      const originalGradient = staticGradients[this.rarity];
      const originalBorder = Colors.rarities[this.rarity].border;
      const originalFill = ctx.fill;
      const originalRoundRect = ctx.roundRect;

      originalDrawPetal.apply(this, [inGame, number]);

      // Restore stuff
      this.shouldDrawCachedAir = false;
      staticGradients[this.rarity] = originalGradient;
      Colors.rarities[this.rarity].border = originalBorder;
      ctx.fill = originalFill;
      ctx.roundRect = originalRoundRect;
      
      if (!isNil(flowrMod)) {
        flowrMod.noFancy = false;
      } else {
        unsafeWindow.hqp = true;
      }
    }
  }

  // Draw the cached Air background after the petal's render location has been
  // updated via `updateInterpolate`.
  const originalInterpolate = PetalContainer.prototype.updateInterpolate;
  PetalContainer.prototype.updateInterpolate = function() {
    originalInterpolate.apply(this);

    // If optimizations are disabled, do not draw any cached Air petal.
    if (settings.get("disableAllOptimizations")) {
      return;
    }

    if (this.shouldDrawCachedAir) {
      // If this is an off-screen petal drop, do not render it
      if (this.toOscillate
        && !toRender(
          { x: this.render.x, y: this.render.y, radius: this.radius },
          window.camera,
        )
        && !this.toSkipCulling
      ) {
        return;
      }

      ctx.save();
      ctx.translate(this.render.x, this.render.y);

      // The code for determining the petal's scale and rotation is copied from
      // Flowr's base code and split into two helper functions.
      let scale = this.getScale();
      let rotation = this.getRotation();

      if (rotation !== 0) {
        ctx.rotate(rotation);
      }
      if (scale !== 1) {
        ctx.scale(scale, scale);
      }

      // If this petal is dropped from a mob, display a bigger grey border
      // around it. This code is copied from Flowr's base code.
      if (this.toOscillate && !this.isDisplayPetalContainer) {
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.roundRect(-30, -30, 60, 60, 5);
        ctx.fill();
        ctx.closePath();
        ctx.globalAlpha = 1;

        // Cancel one instance of displaying the same border later on, so it
        // does not overwrite the cached Air drawing.
        const originalFill = ctx.fill;
        ctx.fill = function() {
          if (ctx.globalAlpha < 0.5
            && (ctx.fillStyle === "black" || ctx.fillStyle === "#000000")
          ) {
            ctx.fill = originalFill;
            return;
          }

          originalFill.apply(this);
        }
      }

      // If Flowrscript is active, also cancel it drawing a gray border around
      // every non-hqp petal.
      if (!isNil(flowrMod)) {
        const originalRoundRect = ctx.roundRect;
        ctx.roundRect = function(x, y, w, h, radii) {
          if (ctx.globalAlpha === 0.5
            && (ctx.fillStyle === "white" || ctx.fillStyle === "#ffffff")
          ) {
            return;
          }
          originalRoundRect.apply(this, [x, y, w, h, radii])
        }
      }

      // Draw the Air petal (without any stars) if it has not been drawn yet
      const newCtx = airCtx[this.rarity];
      if (!airCachedThisFrame[this.rarity] && !isNil(newCtx)) {
        const oldCtx = ctx;
        ctx = newCtx;
        airPetals[this.rarity].stars = [];
        airPetals[this.rarity].draw();
        ctx = oldCtx;
        airCachedThisFrame[this.rarity] = true;
      }

      // Draw the Air petal as a background
      ctx.drawImage(airCanvases[this.rarity], -50, -50, 100, 100);

      // Draw shiny stars on top of the background
      this.drawStars();

      // Make this petal's default background transparent so that it does not
      // overwrite the cached Air drawing
      staticGradients[this.rarity] = "transparent";
      Colors.rarities[this.rarity].border = "transparent";

      // Draw the rest of the petal with High Quality Renders turned off
      if (!isNil(flowrMod)) {
        flowrMod.noFancy = true;
      } else {
        unsafeWindow.hqp = false;
      }

      ctx.restore();
    }
  }

  PetalContainer.prototype.drawStars = function() {
    const totalStars = Colors.rarities[this.rarity].fancy?.stars;
    if (!isNil(totalStars) && (unsafeWindow.hqp && !flowrMod?.noFancy)) {
      let sdesigns = hellaCoolStars(this.rarity);

      if (isNil(sdesigns) || sdesigns.length < 11) {
        return;
      }

      const colors = sdesigns.slice(0, 4);
      const rgbs = colors.map(c => hexToRGBA(c));

      const sradiusArr = sdesigns[4];     // outer radius per type
      const sinnerradArr = sdesigns[5];   // inner radius per type

      let sspeed = sdesigns[6];
      let schaos = sdesigns[7];
      let schaosf = sdesigns[8];
      let ssizec = sdesigns[9];
      let ssizecs = sdesigns[10];

      if (isNil(this.stars)) {
        // Initialize shiny stars
        this.stars = [];
        for (let i = 0; i < totalStars; i++) {
          const star = {
            type: Math.floor(Math.random() * 4),
            x: 0,
            y: 0,
          };
          star.x = Math.random() * 50 - 25 - sinnerradArr[0];
          star.y = Math.random() * 50 - 25 - sinnerradArr[0];
          this.stars.push(star);
        }
      }

      // Make sure stars do not get drawn over the petal's border
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(-22.75, -22.75, 45.5, 45.5, 0.25);
      ctx.clip();
      ctx.closePath();

      for (let star of this.stars) {
        star.x += sspeed + Math.sin(time / 1000 * schaos + star.y / schaosf) * Math.sign(schaos);
        star.y += sspeed + Math.sin(time / 1000 * schaos + star.x / schaosf) * Math.sign(schaos);

        // When stars move out of bounds, teleport them back in bounds
        if (star.x > 25 - sinnerradArr[star.type] || star.x < -25 + sinnerradArr[star.type] || star.y > 25 - sinnerradArr[star.type] || star.y < -25 + sinnerradArr[star.type]) {
          star.type = Math.floor(Math.random() * 4);
          star.x = Math.random() * 50 - 25 - sinnerradArr[star.type];
          star.y = Math.random() * 50 - 25 - sinnerradArr[star.type];
        }

        if (star.x < 25 - sinnerradArr[star.type] && star.x > -25 + sinnerradArr[star.type] && star.y < 25 - sinnerradArr[star.type] && star.y > -25 + sinnerradArr[star.type]) {
          const outerRadius = sradiusArr[star.type];
          const innerRadius = sinnerradArr[star.type] + ssizec * Math.abs(Math.sin(time / (1000 * ssizecs)));
          const rgb = rgbs[star.type];
          const color = colors[star.type];
          const alpha = (Math.cos(Date.now() / 600 + star.x / 30 + star.y / 30) + 1) * 0.8;

          // Draw a glow around the star up to outerRadius
          const grad = ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, outerRadius,
          );
          grad.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`);
          grad.addColorStop(1, "transparent");
          ctx.fillStyle = grad;
          ctx.globalAlpha = 0.3;

          ctx.fillRect(
            star.x - outerRadius,
            star.y - outerRadius,
            outerRadius * 2,
            outerRadius * 2,
          );

          // Draw a solid circle for the star itself up to innerRadius
          ctx.globalAlpha = 1;
          ctx.beginPath();
          ctx.fillStyle = color;
          ctx.arc(star.x, star.y, innerRadius, 0, Math.PI * 2);
          ctx.fill();
          ctx.closePath();
        }
      }

      ctx.restore();
    }
  }

  /**
   * A helper function to initialize the Air petals that will be cached once
   * every frame.
   */
  function initializeCachedAir() {
    for (let rarity = 0; rarity <= MAX_RARITY; rarity++) {
      const newCanvas = new OffscreenCanvas(120, 120);
      airCanvases.push(newCanvas);
      airCtx.push(newCanvas.getContext("2d"));
      const airPetal = new PetalContainer(
        [new Petal({type: "Air", rarity})],
        {
          x: 60,
          y: 60,
          w: 60,
          h: 60,
          toOscillate: false,
        },
        Math.random(),
        1,
      );
      airPetal.nameless = true;
      airPetal.spawnAnimation = 1;
      airPetals.push(airPetal);
      airCachedThisFrame.push(false);
    }
  }
}