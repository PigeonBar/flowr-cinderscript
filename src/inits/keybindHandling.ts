import { settings, type KeybindSettingsKey } from "../settings/settingsManager";
import { isInGameInput } from "../utils";

type KeybindInstruction =
  {type: "settings", key: KeybindSettingsKey, fn: () => void} |
  {type: "rawValue", value: string, fn: () => void};

const keybinds: KeybindInstruction[] = [];

/**
 * This initializer injects some code into {@linkcode inputHandler.handleKey}
 * to handle keybinds for in-game inputs, including keybinds that the user
 * chose in the settings.
 */
export function initKeybindHandling() {
  const originalHandleKey = inputHandler.handleKey;
  inputHandler.handleKey = function(e) {
    // First, run all the usual code for handling inputs
    originalHandleKey.apply(inputHandler, [e]);
    if (!isInGameInput(e) || e.type !== "keydown") {
      return;
    }

    // Then, process all keybind instructions
    for (let keybind of keybinds) {
      if (keybind.type === "settings") {
        if (e.code === settings.get(keybind.key)) {
          keybind.fn();
        }
      } else if (keybind.type === "rawValue") {
        if (e.code === keybind.value) {
          keybind.fn();
        }
      }
    }
  }
}

/**
 * Adds a new keybind to automatically be handled by {@linkcode inputHandler}.
 */
export function addKeybindInstruction(keybind: KeybindInstruction) {
  keybinds.push(keybind);
}