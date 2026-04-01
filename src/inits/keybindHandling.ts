import { unsafeWindow } from "$";
import { KEYBIND_DELETED } from "../constants/constants";
import { settings, type KeybindSettingsKey } from "../settings/settingsManager";

type KeybindInstruction = 
  (
    {type: "settings", settingsKey: KeybindSettingsKey} |
    {type: "rawValue", value: string} |
    {type: "localStorage", storageKey: string} |
    {type: "digit"} // Currently unused
  ) &
  {
    fn: (e: KeyboardEvent) => boolean | void,
    keyType?: "keydown" | "keyup",
    inGame?: boolean,
    inMenu?: boolean,
    beforeOriginal?: boolean,
  };

type FullKeybindInstruction = Required<KeybindInstruction>;

const keybinds: FullKeybindInstruction[] = [];

/**
 * This initializer injects some code into {@linkcode inputHandler.handleKey}
 * to handle keybinds, including keybinds chosen in the settings.
 */
export function initKeybindHandling(): void {
  const originalHandleKey = inputHandler.handleKey;
  inputHandler.handleKey = function(e: KeyboardEvent) {
    // First, handle all `beforeOriginal` keybind instructions
    for (let keybind of keybinds) {
      if (checkInstruction(keybind, e, true)) {
        if (keybind.fn(e)) {
          // Stop applying keybinds if the fn said so
          return;
        }
      }
    }

    // Next, run all the usual code for handling inputs
    originalHandleKey.apply(inputHandler, [e]);

    // Then, process all non-`beforeOriginal` keybind instructions
    for (let keybind of keybinds) {
      if (checkInstruction(keybind, e, false)) {
        if (keybind.fn(e)) {
          // Stop applying keybinds if the fn said so
          return;
        }
      }
    }
  }
}

/**
 * Adds a new keybind to automatically be handled by {@linkcode inputHandler}.
 * 
 * @param fn The function to run whenever the keybind is triggered. Should
 * return `true` if it deactivates all later keybinds, including those from
 * Flowr's base code.
 * @param keyType The targeted `KeyboardEvent` type ("keydown" or "keyup").
 * Default: "keydown".
 * @param inGame Whether or not the keybind can activate during a run.
 * Default: `true`.
 * @param inMenu Whether or not the keybind can activate on the menu screen.
 * Default: `false`.
 * @param beforeOriginal Whether or not the keybind should activate before
 * Flowr's base code for handling inputs. Default: `false`.
 */
export function addKeybindInstruction(keybind: KeybindInstruction) {
  keybinds.push({
    ...keybind,
    keyType: keybind.keyType ?? "keydown",
    inGame: keybind.inGame ?? true,
    inMenu: keybind.inMenu ?? false,
    beforeOriginal: keybind.beforeOriginal ?? false,
  });
}

/**
 * A helper function to determine whether the user is making an in-game input
 * (i.e., the player is currently in-game and is not typing in the chat).
 */
export function isInGameInput(): boolean {
  return unsafeWindow.state === "game" && !inputHandler.chatOpen;
}

/**
 * A helper function to determine whether the user is making an input on the
 * menu screen (and is not typing in an input box).
 */
export function isInMenuInput(): boolean {
  return unsafeWindow.state === "menu"
    && document.activeElement?.tagName !== 'INPUT';
}

/**
 * A helper function to check whether or not the given input should trigger the
 * given keybind.
 * 
 * @return `true` iff the keybind should be triggered.
 */
export function checkInstruction(
  keybind: FullKeybindInstruction,
  e: KeyboardEvent,
  beforeOriginal: boolean,
): boolean {
  // Check that it is not a repeated input
  if (e.repeat) {
    return false;
  }

  // If the key's code somehow equals our special token that indicates a
  // deleted keybind, ignore it.
  if (e.code === KEYBIND_DELETED) {
    console.warn(`Keypress code somehow equal to ${KEYBIND_DELETED}!`);
    console.warn(e);
    return false;
  }

  // Check that the input's context matches the keybind
  if (
      !(keybind.inGame && isInGameInput()) &&
      !(keybind.inMenu && isInMenuInput())
  ) {
    return false;
  }
  if (keybind.beforeOriginal !== beforeOriginal) {
    return false;
  }
  if (keybind.keyType !== e.type) {
    return false;
  }
  
  // Check that the input's key matches the keybind
  if (keybind.type === "settings") {
    return e.code === settings.get(keybind.settingsKey);
  } else if (keybind.type === "rawValue") {
    return e.code === keybind.value;
  } else if (keybind.type === "localStorage") {
    return e.code === localStorage.getItem(keybind.storageKey)
      && e.code.length > 0;
  } else if (keybind.type === "digit") {
    return e.code.startsWith("Digit");
  } else {
    return false;
  }
}