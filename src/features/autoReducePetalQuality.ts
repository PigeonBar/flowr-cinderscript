import { unsafeWindow } from "$";
import { settings } from "../settings/settingsManager";

/**
 * Tracks the number of petals that have been drawn during the current frame.
 */
let petalCounter = 0;

/**
 * Whether or not high quality should be disabled because of the threshold.
 */
let disableHqp = false;

/**
 * This feature reduces lag by automatically disabling the base game's High
 * Quality Renders if there are too many petals on-screen at the same time.
 * 
 * Note: We only count petals, since it seems to be far easier for the game to
 * handle rendering PetalContainers that hold mobs instead of petals.
 */
export function autoReducePetalQuality() {
  // Enforce disabling high quality renders by using a getter function
  unsafeWindow._hqp = unsafeWindow.hqp;
  Object.defineProperty(unsafeWindow, "hqp", {
    get: function() {
      return this._hqp && !disableHqp;
    },
    set: function(value: boolean) {
      this._hqp = value;
    }
  });

  // Count number of petals being drawn
  const originalDrawPetal = PetalContainer.prototype.draw;
  PetalContainer.prototype.draw = function(inGame?: boolean, number?: number) {
    if (this.petals[0].constructor === Petal) {
      petalCounter++;
    }
    originalDrawPetal.apply(this, [inGame, number]);

    if (exceededThreshold()) {
      disableHqp = true;
    }
  }

  const originalDraw = draw;
  draw = function() {
    // Reset the counter for the next frame that will be drawn
    petalCounter = 0;

    originalDraw();

    // Check the final petal count
    disableHqp = exceededThreshold();
  }
}

/**
 * A helper function to check if {@linkcode petalCounter} is above the chosen
 * threshold.
 * 
 * Note that a threshold of -1 means disabling the threshold.
 * 
 * @return `true` iff the counter is above the threshold.
 */
function exceededThreshold() {
  const threshold = settings.get("petalRenderQualityThreshold");
  return threshold >= 0 && petalCounter > threshold;
}