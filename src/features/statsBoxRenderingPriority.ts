import { isNil } from "../utils";

/**
 * This feature fixes a bug with Cinderscript where certain UI elements
 * (especially the new orange menu buttons) would cover up stats boxes.
 * 
 * This feature works by drawing all stats boxes on a new canvas with a higher
 * z-index.
 */
export function prioritizeRenderingStatsBoxes() {
  const statsBoxCanvas = document.createElement("canvas");
  // Also set `pointer-events: none` so that the player can click on UI
  // elements that are behind this canvas
  statsBoxCanvas.style = "z-index: 1; pointer-events: none";
  document.body.appendChild(statsBoxCanvas);
  const statsBoxCtx = statsBoxCanvas.getContext("2d");

  const originalStatsBoxDraw = StatsBox.prototype.draw;
  StatsBox.prototype.draw = function() {
    statsBoxCanvas.width = canvas.width;
    statsBoxCanvas.height = canvas.height;
    const originalCtx = ctx;
    if (!isNil(statsBoxCtx)) {
      // Draw all stats boxes using the new canvas
      ctx = statsBoxCtx;
      ctx.globalAlpha = originalCtx.globalAlpha;
      ctx.setTransform(savedRenderTransform);
    }
    originalStatsBoxDraw.apply(this);
    ctx = originalCtx;
  }

  const originalDraw = draw;
  draw = function() {
    // Clear the stats box canvas before drawing the next frame
    statsBoxCtx?.clearRect(0, 0, statsBoxCanvas.width, statsBoxCanvas.height);

    originalDraw();
  }
}