import { unsafeWindow } from "$";
import { KEYBIND_DELETED } from "../constants/constants";
import { settings } from "../settings/settingsManager";
import { cinderSettingsMenu } from "../settings/settingsMenu";
import { isNil } from "../utils";

/**
 * This initializer modifies the game's input detector to allow keybinds in the
 * settings to be set to the next inputted key, when applicable.
 */
export function allowEditingKeybinds() {
  const originalHandleKey = inputHandler.handleKey;
  inputHandler.handleKey = function(e: KeyboardEvent) {
    // Set the desired keybind when the following conditions are met:
    // 1. We are in the main menu, or the settings menu is allowed to be active
    //    outside of the main menu.
    // 2. The key is being pressed down, not released.
    // 3. The keyboard input is not a repeat input.
    // 4. The user is currently editing a keybind option.
    if ((unsafeWindow.state === "menu"
        || !settings.get("hideSettingsDuringRuns"))
      && e.type === "keydown"
      && !e.repeat
      && !isNil(cinderSettingsMenu.currentKeybindOption))
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