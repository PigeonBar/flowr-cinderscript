import { cinderChangelog } from "../changelog";
import { cinderSettingsMenu } from "../settings/settingsMenu";

const menuList: readonly Menu[] = Object.freeze([
  settingsMenu,
  changelog,
  cinderSettingsMenu,
  cinderChangelog,
  globalInventory,
  craftingMenu,
  mobGallery,
]);

/**
 * This initializer makes sure that opening any menu closes all other menus so
 * that menus do not overlap each other. Flowr's base code already has some
 * code for this, but only for some of the menus.
 * 
 * TODO: Include the shop menu in this code once I unlock it and can test it
 * properly.
 */
export function preventMenuOverlap() {
  for (let menu of menuList) {
    if (isTopMenu(menu)) {
      const originalToggle = menu.toggle;

      menu.toggle = function() {
        // First, if this menu is currently closed, it means that we are opening
        // it, so we should close all other menus. This should not cause any
        // infinite recursion since we are not opening any other menus.
        if (!menu.active) {
          closeAllMenus();
        }

        // Then, toggle this menu as usual.
        originalToggle.apply(menu);
      }
    } else {
      const originalToggle = menu.toggleMenu;

      menu.toggleMenu = function() {
        // First, if this menu is currently closed, it means that we are opening
        // it, so we should close all other menus. This should not cause any
        // infinite recursion since we are not opening any other menus.
        if (!menu.menuActive) {
          closeAllMenus();
        }

        // Then, toggle this menu as usual.
        originalToggle.apply(menu);
      }
    }
  }
}

/**
 * A helper function that closes all menus.
 */
function closeAllMenus() {
  for (let menu of menuList) {
    if (isTopMenu(menu)) {
      if (menu.active) {
        menu.toggle();
      }
    } else {
      if (menu.menuActive) {
        menu.toggleMenu();
      }
    }
  }
}

/**
 * A helper function that determines whether a menu is a {@linkcode TopMenu}
 * (which uses the field `active`) or a {@linkcode BottomMenu} (which uses the
 * field `menuActive`).
 */
function isTopMenu(menu: Menu): menu is TopMenu {
  return Object.hasOwn(menu, "active");
}