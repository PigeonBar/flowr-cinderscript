/**
 * This initializer sets the crafting menu's
 * {@linkcode CraftingMenu.renderY renderY} value to be the vertical position
 * of the base crafting menu on the canvas, updating dynamically when the
 * crafting menu is opened or closed.
 */
export function handleCraftMenuTranslation() {
  Object.defineProperty(craftingMenu, "renderY", {
    get: function(this: CraftingMenu): number {
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