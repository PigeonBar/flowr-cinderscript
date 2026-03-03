import { settings } from "../settings";

/**
 * This feature modifies the base FOV scale, which is used when the player
 * enters a game for the first time or presses "[" to reset the FOV.
 */
export function modifyBaseFOV(): void {
  // Initialize the FOV to desired starting value.
  // Note that the other scaling settings give more visibility when the setting
  // is *larger*, so we need to do reciprocal of FOV for consistency.
  fov = 1 / settings.get("baseReciprocalOfFOV");

  // Overwrite the fov reset when handling "[" inputs
  const originalHandleKey = inputHandler.handleKey;
  inputHandler.handleKey = function(e) {
    // First, run all the usual code for handling inputs
    originalHandleKey.apply(inputHandler, [e]);
    if (e.repeat && this.chatOpen === false) return e.preventDefault();
    if (this.chatOpen === true) return;

    if (e.code === "BracketLeft" && e.type === "keydown") {
      fov = 1 / settings.get("baseReciprocalOfFOV");
    }
  }
}