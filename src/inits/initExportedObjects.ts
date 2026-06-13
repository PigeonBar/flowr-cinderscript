import { initChangelog } from "../changelog";
import { initMenuList } from "../constants/menuLists";
import { initMobCounters } from "../features/mobGalleryKillCounter";
import { initSettingsMenu } from "../settings/settingsMenu";

/**
 * This function initializes certain exported objects during this script's
 * proper runtime, in order to prevent side effects from their constructors
 * running during importing.
 */
export function initExportedObjects(): void {
  initSettingsMenu();
  initChangelog();
  initMobCounters();
  initMenuList();
}