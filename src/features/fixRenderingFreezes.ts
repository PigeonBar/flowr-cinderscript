/**
 * A quick fix for certain issues causing the rendering engine to freeze.
 */
export function fixSpecificRenderingFreezes() {
  // Fix ctx crashing from drawing a hitbox with a negative radius
  const originalArc = ctx.arc;
  ctx.arc = function(...args) {
    if (args[2] > 0) { // Radius
      originalArc.apply(this, args);
    }
  }

  // Fix ctx being scaled to a size of 0 due to enemyBoxes with a size of 0
  const originalUpdate = enemyBox.prototype.update;
  enemyBox.prototype.update = function() {
    originalUpdate.apply(this);
    this.w = Math.max(this.w, 0.01);
    this.h = Math.max(this.h, 0.01);
  }

  // Fix ctx being scaled to a size of 0 due to infoGui items with a size of 0
  const originalInfoGuiDraw = infoGui.draw;
  infoGui.draw = function() {
    ctx.save();

    originalInfoGuiDraw.apply(this);

    ctx.restore();
  }
}