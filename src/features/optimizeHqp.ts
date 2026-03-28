import { unsafeWindow } from "$";
import { MAX_RARITY, NON_ANIM_PETALS } from "../constants/constants";
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
 * - The stars in the petal backgrounds are now also cached every frame
 *   (configurable in the settings).
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

  // Initialize the canvas for caching the background stars
  const starCanvas = new OffscreenCanvas(30, 30);
  const starCtx = starCanvas.getContext("2d");
  let simStarX = 0;
  let simStarY = 0;

  const originalDraw = draw;
  draw = function() {
    // If optimizations are disabled, just render the game as usual
    if (settings.get("disableAllOptimizations")) {
      originalDraw();
      return;
    }

    // Draw and cache the star image so it can be drawn on petal backgrounds
    starCtx?.reset();
    if (settings.get("petalStarCaching") && !isNil(starCtx)) {
      const originalCtx = ctx;
      ctx = starCtx;
      simStarX += 0.1;
      simStarY += 0.1;
      ctx.translate(15, 15);
      drawStar(0, 0);
      ctx.translate(-15, -15);
      ctx = originalCtx;
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
    // Hide stars if the "Delete Stars" setting is turned ON. The code will
    // automatically teleport the stars towards the petal when the setting gets
    // turned OFF.
    if (settings.get("disablePetalStars") 
      && !settings.get("disableAllOptimizations")
      && !isNil(this.stars)
    ) {
      for (let star of this.stars) {
        star.x = Infinity;
        star.y = Infinity;
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
      || !unsafeWindow.hqp 
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

      originalDrawPetal.apply(this, [inGame, number]);

      // Restore stuff
      this.shouldDrawCachedAir = false;
      staticGradients[this.rarity] = originalGradient;
      Colors.rarities[this.rarity].border = originalBorder;
      unsafeWindow.hqp = true;
      ctx.fill = originalFill;
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
      unsafeWindow.hqp = false;

      ctx.restore();
    }
  }

  /**
   * A helper function to draw one shiny star.
   * 
   * This code is copied from Flowr's base code.
   */
  function drawStar(x: number, y: number) {
    ctx.beginPath();

    // Create gradient of twinkling light around the star
    let twinkleTime = Date.now() / 600;
    if (ctx === starCtx) {
      twinkleTime += simStarX / 30 + simStarY / 30;
    } else {
      twinkleTime += x / 30 + y / 30;
    }
    const grad = ctx.createRadialGradient(x, y, 15, x, y, 0);
    grad.addColorStop(0, "transparent");
    grad.addColorStop(0.8, `rgba(255,255,255,${
      (Math.cos(twinkleTime) + 1) * 0.8
    })`);
    grad.addColorStop(1, "white");

    ctx.fillStyle = grad;
    ctx.globalAlpha = 0.3;

    ctx.fillRect(-25, -25, 50, 50);
    ctx.globalAlpha = 1;

    ctx.fillStyle = "#fff";

    // Draw the star itself as a single point
    ctx.arc(x, y, 1, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  }

  PetalContainer.prototype.drawStars = function() {
    const totalStars = Colors.rarities[this.rarity].fancy?.stars;
    if (!isNil(totalStars) && unsafeWindow.hqp) {
      if (isNil(this.stars)) {
        // Initialize shiny stars
        this.stars = [];
        for (let starnum = 0; starnum < totalStars; starnum++) {
          this.stars.push(
            { x: Math.random() * 50 - 25, y: Math.random() * 50 - 25 }
          );
        }
      }
      
      // Make sure stars do not get drawn over the petal's border
      ctx.beginPath();
      ctx.roundRect(-22.75, -22.75, 45.5, 45.5, 0.25);
      ctx.clip();
      ctx.closePath();

      for (let star of this.stars) {
        // Stars move down and right, and they wrap around to a random point at
        // the top edge of the petal upon reaching the bottom or right edge.
        star.x += 0.1;
        star.y += 0.1;
        if (star.x > 25 || star.y > 25) {
          star.x = Math.random() * 800 - 20 - 30;
          star.y = -30;
        }

        if (star.x < 25 && star.x > -25 && star.y < 25 && star.y > -25) {
          if (settings.get("petalStarCaching")) {
            ctx.drawImage(starCanvas, star.x - 15, star.y - 15, 30, 30);
          } else {
            drawStar(star.x, star.y);
          }
        }
      }
    }
  }

  PetalContainer.prototype.getScale = function() {
    // Default: 1x scale = 50 units
    let scale = this.render.w / 50;

    // When a petal is spawning in, it should quickly grow in size
    const renderAnimationTimer = smoothstep(this.spawnAnimation);
    scale *= renderAnimationTimer;

    // If this petal is set to oscillate, the scale should oscillate with time
    if (this.toOscillate) {
      scale *= 1 + Math.sin(performance.now() / 1000 / .076) / 52;
    }

    return scale;
  }

  PetalContainer.prototype.getRotation = function() {
    let rotation = 0;

    // When a petal is spawning in, it should spiral outwards while growing
    const renderAnimationTimer = smoothstep(this.spawnAnimation);
    rotation -= (1 - renderAnimationTimer) * Math.PI * 3;

    // If the petal is being dragged, it should rotate back and forth
    if (this.isDraggingPetalContainer) {
      this.draggingTimer ??= 0;
      const nextFrameTimer = this.draggingTimer + 1000 / 30 * dt / 16.66;
      rotation += Math.sin(nextFrameTimer / 280) * 0.28;
    } else if (!isNil(this.undraggingPetalContainerTimer)) {
      if (isNil(this.interval)) {
        this.lastDraggingAngle ??= 0;
        rotation += interpolate(this.lastDraggingAngle, 0, 0.15);
      }
    }

    // Also apply angle offset, if applicable
    if (this.toOscillate === true) {
      this.angleOffset ??= 0;
      rotation += this.angleOffset;
    }

    return rotation;
  }

  PetalContainer.prototype.shouldAnimate = function() {
    return !NON_ANIM_PETALS.includes(this.type)
      && !settings.get("disablePetalAnimations");
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