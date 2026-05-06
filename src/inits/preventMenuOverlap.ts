import { unsafeWindow } from "$";
import { MENU_LIST } from "../constants/menuLists";
import { isNil, isShop, isTopMenu } from "../utils";
import { flowrMod } from "./initFlowrscriptPointer";

/**
 * This initializer makes sure that opening any menu closes all other menus so
 * that menus do not overlap each other. Flowr's base code already has some
 * code for this, but only for some of the menus.
 */
export function preventMenuOverlap() {
  for (let menu of MENU_LIST) {
    if (isShop(menu)) {
      const originalToggle = menu.toggle;

      menu.toggle = function() {
        // First, if this menu is currently closed, it means that we are opening
        // it, so we should close all other menus. This should not cause any
        // infinite recursion since we are not opening any other menus.
        if (!menu.menu.active) {
          closeAllMenus();
        }

        // Then, toggle this menu as usual.
        originalToggle.apply(menu);
      }
    }
    else if (isTopMenu(menu)) {
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

  // Also prevent Flowrscript's settings button from covering TopMenus
  if (!isNil(flowrMod)) {
    const originalDrawIcon = flowrMod.flowrSettingsMenu.drawIcon;
    flowrMod.flowrSettingsMenu.drawIcon = function(alpha?: number) {
      if (unsafeWindow.state === "menu") {
        for (let menu of MENU_LIST) {
          if (isTopMenu(menu)
            && menu !== flowrMod?.flowrSettingsMenu
            && menu.active
          ) {
            return;
          }
        }
      }
      originalDrawIcon.apply(this, [alpha]);
    }
  }
}

/**
 * A helper function that closes all menus.
 */
function closeAllMenus() {
  for (let menu of MENU_LIST) {
    if (isShop(menu)) {
      if (menu.menu.active) {
        menu.toggle();
      }
    } else if (isTopMenu(menu)) {
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