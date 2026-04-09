import { unsafeWindow } from "$";
import { settings } from "../settings/settingsManager";

/**
 * Tracks the number of petals that have been drawn during the current frame.
 */
let renderCounter = 0;

/**
 * Whether or not high quality should be disabled because of the threshold.
 */
let disableHqp = false;

/**
 * This feature reduces lag by automatically disabling the base game's High
 * Quality Renders if there are too many petals on-screen at the same time.
 * 
 * This now also counts mob entries, since the mob gallery no longer attempts
 * to render off-screen gallery entries.
 */
export function autoReducePetalQuality() {
  // Enforce disabling high quality renders by using a getter function
  unsafeWindow._hqp = unsafeWindow.hqp;
  Object.defineProperty(unsafeWindow, "hqp", {
    get: function(this: Window) {
      return this._hqp
        && (!disableHqp || settings.get("disableAllOptimizations"));
    },
    set: function(this: Window, value: boolean) {
      this._hqp = value;
    }
  });

  // Count number of petals being drawn
  const originalDrawPetal = PetalContainer.prototype.draw;
  PetalContainer.prototype.draw = function(inGame?: boolean, number?: number) {
    // If optimizations are disabled, just draw the petal as usual
    if (settings.get("disableAllOptimizations")) {
      originalDrawPetal.apply(this, [inGame, number]);
      return;
    }

    renderCounter++;

    originalDrawPetal.apply(this, [inGame, number]);

    if (exceededThreshold()) {
      disableHqp = true;
    }
  }

  const originalDraw = draw;
  draw = function() {
    // If optimizations are disabled, just render the game as usual
    if (settings.get("disableAllOptimizations")) {
      originalDraw();
      return;
    }

    // Reset the counter for the next frame that will be drawn
    renderCounter = 0;

    originalDraw();

    // Check the final petal count
    disableHqp = exceededThreshold();
  }
}

/**
 * A helper function to check if {@linkcode renderCounter} is above the chosenc
 * threshold.
 * 
 * Note that a threshold of -1 means disabling the threshold.
 * 
 * @return `true` iff the counter is above the threshold.
 */
function exceededThreshold() {
  const threshold = settings.get("petalRenderQualityThreshold");
  return threshold >= 0 && renderCounter > threshold;
}