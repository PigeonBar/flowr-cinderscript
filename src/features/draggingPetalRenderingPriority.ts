import { isNil } from "../utils";

/**
 * This feature fixes an issue where many UI elements (especially the inventory
 * menu) would cover up the petal that the user is dragging.
 * 
 * This feature works by drawing the dragged petal on a new canvas with a
 * higher z-index.
 */
export function prioritizeRenderingDragPetal() {
  const dragPetalCanvas = document.createElement("canvas");
  // Also set `pointer-events: none` so that the player can click on UI
  // elements that are behind this canvas
  dragPetalCanvas.style = "z-index: 1; pointer-events: none";
  document.body.appendChild(dragPetalCanvas);
  const dragPetalCtx = dragPetalCanvas.getContext("2d");

  const originalPetalDraw = PetalContainer.prototype.draw;
  PetalContainer.prototype.draw = function(inGame?: boolean, number?: number) {
    if (this.isDraggingPetalContainer) {
      dragPetalCanvas.width = canvas.width;
      dragPetalCanvas.height = canvas.height;
      const originalCtx = ctx;
      if (!isNil(dragPetalCtx)) {
        // Draw the dragged petal container using the new canvas
        ctx = dragPetalCtx;
        ctx.setTransform(originalCtx.getTransform());
      }
      originalPetalDraw.apply(this, [inGame, number]);
      ctx = originalCtx;
    } else {
      originalPetalDraw.apply(this, [inGame, number]);
    }
  }

  const originalDraw = draw;
  draw = function() {
    // Clear the dragging petal canvas before drawing the next frame
    dragPetalCtx?.reset();
    dragPetalCtx?.clearRect(0, 0, dragPetalCanvas.width, dragPetalCanvas.height);

    originalDraw();
  }
}