import { MENU_LIST } from "../constants/menuLists";
import { isTopMenu } from "../utils";

/**
 * This initializer sets the {@linkcode CraftingMenu.renderY renderY} value of
 * the inventory menu, crafting menu, and mob gallery to be the vertical
 * position of the base crafting menu on the canvas, updating dynamically when
 * the crafting menu is opened or closed.
 */
export function handleMenuTranslations() {
  for (let menu of MENU_LIST) {
    if (isTopMenu(menu)) {
      Object.defineProperty(menu, "renderY", {
        get: function(this: TopMenu): number {
          return this.y + this.offset;
        }
      });
    } else {
      Object.defineProperty(menu, "renderY", {
        get: function(this: BottomMenu): number {
          // If menu hasn't been opened yet, initialize last open/close times
          this.lastOpenTime ??= time - 160;
          this.lastCloseTime ??= time - 160;

          if (!this.menuActive && time - this.lastCloseTime >= 160) {
            // Hide menu completely if it is finished closing
            return canvas.h;
          }

          // Copied from Flowr's client code
          let translate = 0;
          if (time - this.lastCloseTime < 160) {
            translate += this.h * easeOutCubic((time - this.lastCloseTime) / 160);
          }
          if (time - this.lastOpenTime < 160) {
            translate += (this.h + 40) *
              (1 - easeOutCubic((time - this.lastOpenTime) / 160));
          }
          return canvas.h - this.h - 20 + translate;
        }
      });
    }
  }
}