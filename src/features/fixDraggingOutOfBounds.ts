/**
 * This feature fixes a bug where dragging a petal can cause it to get sent to
 * the shadow realm (specifically, coords (-1e99, -1e99)) whenever it is
 * dragged somewhere that triggers {@linkcode window.onmouseout}. It also
 * fixes general issues with dragging petals outside the window.
 * 
 * TODO: Is it necessary for `window.onmouseout` to simulate a mouse movement
 * to (-1e99, -1e99) in Flowr's base code? These mouse coords seems to get
 * overwritten by `window.onmousemove` anyways.
 */
export function fixDraggingPetalsOutOfBounds() {
  const originalSimulateDragging = simulatedraggingPetalContainer;
  simulatedraggingPetalContainer = (x: number, y: number) => {
    // Prevent snapping to unreasonably low coordinates
    if (x < -1e10 && y < -1e10) {
      return;
    }

    // Enforce bounds on coordinates
    x = Math.max(0, Math.min(canvas.width, x));
    y = Math.max(0, Math.min(canvas.height, y));
    originalSimulateDragging(x, y);
  }
}