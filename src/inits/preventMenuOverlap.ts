import { unsafeWindow } from "$";
import { MENU_LIST } from "../constants/menuLists";
import { cinderSettingsMenu } from "../settings/settingsMenu";
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
  
  // Move the ascend ui out of the way if the colour selector is open
  const ascendUI = unsafeWindow.ascendUI;
  if (!isNil(ascendUI)) {
    const originalDraw = ascendUI.draw;
    ascendUI.draw = function() {
      if (isNil(this.offset)) {
        this.offset = 0;
      }

      if (cinderSettingsMenu.colourSelectorUi.active) {
        this.offset = interpolate(this.offset, -200, 0.2);
      } else {
        this.offset = interpolate(this.offset, 0, 0.2);
      }

      ctx.translate(0, this.offset);

      originalDraw.apply(this);

      ctx.translate(0, -this.offset);
    }

    // Also make sure that the ascend prompt's button gets moved out of the way
    Object.defineProperty(ascendUI, "buttonDimensions", {
      get: function(this: AscendUI) {
        return {
          x: canvas.w / 2 - 34.2266 * 4 / 2,
          y: 18.5 * 2 + (this.offset ?? 0),
          w: 34.2266 * 4,
          h: 40,
        };
      },
      set: () => {},
    });
  }

  // Also move the ascended character selector out of the way if the colour
  // selector is open. Here we inject this code after `levelBar.init()`
  // because that function is responsible for initializing the char selector.
  const originalLevelInit = levelBar.init;
  levelBar.init = function(xp: number) {
    originalLevelInit.apply(this, [xp]);
    
    const charSelector = unsafeWindow.characterSelector;
    if (!isNil(charSelector)) {
      const originalDraw = charSelector.draw;
      charSelector.draw = function() {
        if (isNil(this.offset)) {
          this.offset = 0;
        }

        if (cinderSettingsMenu.colourSelectorUi.active) {
          this.offset = interpolate(this.offset, -200, 0.2);
        } else {
          this.offset = interpolate(this.offset, 0, 0.2);
        }

        ctx.translate(0, this.offset);

        originalDraw.apply(this);

        ctx.translate(0, -this.offset);

        // Also move the button hitboxes out of the way
        for (let char of this.characters) {
          char.y += this.offset;
        }
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