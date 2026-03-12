import { unsafeWindow } from "$";
import { KEYBIND_DELETED } from "../constants";
import { cinderSettingsMenu } from "../settings/settingsMenu";
import { isNil } from "../utils";

/**
 * This initializer modifies the game's input detector to allow keybinds in the
 * settings to be set to the next inputted key, when applicable.
 */
export function allowEditingKeybinds() {
  const originalHandleKey = inputHandler.handleKey;
  inputHandler.handleKey = function(e: KeyboardEvent) {
    // Set the desired keybind if applicable
    if (unsafeWindow.state === "menu" &&
        e.type === "keydown" &&
        !e.repeat &&
        !isNil(cinderSettingsMenu.currentKeybindOption))
    {
      if (e.code === "Delete") {
        cinderSettingsMenu.currentKeybindOption.finishEdit(KEYBIND_DELETED);
      } else {
        cinderSettingsMenu.currentKeybindOption.finishEdit(e.code);
      }
      cinderSettingsMenu.cancelKeybind();
      return;
    }

    originalHandleKey.apply(inputHandler, [e]);
  }
}