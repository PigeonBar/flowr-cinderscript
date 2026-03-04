/**
 * A quick fix for hitboxes with negative radius causing rendering to freeze.
 */
export function fixNegativeRadiusFreeze() {
  const originalArc = ctx.arc;

  ctx.arc = function(...args) {
    if (args[2] > 0) { // Radius
      originalArc.apply(this, args);
    }
  }
}