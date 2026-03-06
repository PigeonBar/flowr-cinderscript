import { settings } from "../settings";
import { isInGameInput } from "../utils";

/**
 * This feature modifies the base FOV scale, which is used when the player
 * enters a game or presses "[" to reset the FOV.
 */
export function modifyBaseFOV(): void {
  // Overwrite the fov reset when handling "[" inputs
  const originalHandleKey = inputHandler.handleKey;
  inputHandler.handleKey = function(e) {
    // First, run all the usual code for handling inputs
    originalHandleKey.apply(inputHandler, [e]);
    if (!isInGameInput(e)) {
      return;
    }

    if (e.code === "BracketLeft" && e.type === "keydown") {
      // Note that other scaling settings give more visibility when the setting
      // is *larger*, so we need to do reciprocal of FOV for consistency.
      fov = 1 / settings.get("baseReciprocalOfFOV");
    }
  }

  // Also set the FOV to the base FOV when entering a game
  const originalEnterGame = enterGame;
  enterGame = function() {
    originalEnterGame();
    fov = 1 / settings.get("baseReciprocalOfFOV");
  }
}