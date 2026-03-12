import { addKeybindInstruction } from "../inits/keybindHandling";
import { settings } from "../settings/settingsManager";

/**
 * This feature modifies the base FOV scale, which is used when the player
 * enters a game or presses "[" to reset the FOV.
 */
export function modifyBaseFOV(): void {
  // Override the fov reset when handling "[" inputs
  addKeybindInstruction({type: "rawValue", value: "BracketLeft", fn: () => {
    // Note that other scaling settings give more visibility when the setting
    // is *larger*, so we need to do reciprocal of FOV for consistency.
    fov = 1 / settings.get("baseReciprocalOfFOV");
  }});

  // Also set the FOV to the base FOV when entering a game
  const originalEnterGame = enterGame;
  enterGame = function() {
    originalEnterGame();
    fov = 1 / settings.get("baseReciprocalOfFOV");
  }
}