import { cinderChangelog } from "../changelog";
import { cinderSettingsMenu } from "../settings/settingsMenu";

/**
 * A list of all menus accessible via the main lobby.
 */
export const MENU_LIST: readonly Menu[] = Object.freeze([
  settingsMenu,
  changelog,
  cinderSettingsMenu,
  cinderChangelog,
  globalInventory,
  craftingMenu,
  mobGallery,
]);