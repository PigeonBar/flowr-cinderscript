import { cinderChangelog } from "../changelog";
import { cinderSettingsMenu } from "../settings/settingsMenu";

/**
 * A list of all menus accessible via the main lobby.
 */
export let MENU_LIST: readonly Menu[];

/**
 * A helper function to initialize {@linkcode MENU_LIST}, to prevent certain
 * side effects from constructors running during importing.
 */
export function initMenuList(): void {
  MENU_LIST = Object.freeze([
    settingsMenu,
    changelog,
    cinderSettingsMenu,
    cinderChangelog,
    globalInventory,
    craftingMenu,
    mobGallery,
  ]);
}