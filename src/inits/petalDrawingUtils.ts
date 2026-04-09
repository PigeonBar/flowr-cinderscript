import { NON_ANIM_PETALS } from "../constants/constants";
import { settings } from "../settings/settingsManager";
import { isNil } from "../utils";

/**
 * This initializer gives {@linkcode PetalContainer} a few helper functions
 * related to drawing petals.
 */
export function initPetalDrawingUtils(): void {
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

  PetalContainer.prototype.drawAmount = function(
    textColour: string = "white"
  ) {
    ctx.save();

    const scale = this.getScale();
    ctx.translate(this.render.x, this.render.y);

    // Let the displayed amount fade in if it recently changed
    if (performance.now() - this.lastAmountChangedTime < 240) {
      ctx.globalAlpha = smoothstep(
        (performance.now() - this.lastAmountChangedTime) / 240
      );
    }

    ctx.font = `600 ${13 * scale}px Ubuntu`;
    ctx.letterSpacing = "1px";
    ctx.textBaseline = "middle";
    ctx.textAlign = "right";
    ctx.fillStyle = textColour;
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.translate((70 / 2.5 + 0.5) * scale, (-42 / 2.5 + 0.5) * scale);
    ctx.rotate(Math.PI / 9.1);

    if (this.greyed) {
      ctx.globalAlpha *= 0.3;
    }

    ctx.strokeText('x' + formatAmount(this.amount), 0, 0);
    ctx.fillText('x' + formatAmount(this.amount), 0, 0);
    
    ctx.restore();
  }
}