import { settings } from "../settings";

/**
 * This feature modifies the base FOV scale, which is used when the player
 * enters a game for the first time or presses "[" to reset the FOV.
 */
export function modifyBaseFOV(): void {
  fov = settings.get("baseFOV"); // Initialize the FOV to desired starting value

  // Overwrite the fov reset when handling "[" inputs
  const originalHandleKey = inputHandler.handleKey;
  inputHandler.handleKey = function(e) {
    // First, run all the usual code for handling inputs
    originalHandleKey.apply(inputHandler, [e]);
    if (e.repeat && this.chatOpen === false) return e.preventDefault();
    if (this.chatOpen === true) return;

    if (e.code === "BracketLeft" && e.type === "keydown") {
      fov = settings.get("baseFOV");
    }
  }
}