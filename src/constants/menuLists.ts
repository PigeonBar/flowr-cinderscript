import { cinderChangelog } from "../changelog";
import { flowrMod } from "../inits/initFlowrscriptPointer";
import { cinderSettingsMenu } from "../settings/settingsMenu";
import { isNil } from "../utils";

/**
 * A list of all menus accessible via the main lobby.
 */
export let MENU_LIST: readonly Menu[];

/**
 * A helper function to initialize {@linkcode MENU_LIST}, to prevent certain
 * side effects from constructors running during importing.
 */
export function initMenuList(): void {
  const rawList: Menu[] = [
    settingsMenu,
    changelog,
    cinderSettingsMenu,
    cinderChangelog,
    globalInventory,
    craftingMenu,
    mobGallery,
  ];
  
  // If Flowrscript is also being used, add its settings menu and its petal
  // gallery to the menu list.
  if (!isNil(flowrMod)) {
    rawList.push(
      shop,
      flowrMod.flowrSettingsMenu,
      flowrMod.petalGallery,
    );
  }

  // Finally, freeze the object here
  MENU_LIST = Object.freeze(rawList);
}