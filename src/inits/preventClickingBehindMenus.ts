import { mouseOnMenu } from "../utils";

/**
 * This feature prevents loadout petals from being clicked on or hovered when
 * they are behind a menu, since the user is most likely trying to click on the
 * menu instead of the loadout petal.
 */
export function preventClickingBehindMenus() {
  // Prevent clicking on petals behind menus
  const originalMouseDown = menuInventory.mouseDown;
  menuInventory.mouseDown = function(
    { mouseX, mouseY }: CanvasMouseData2, inv: Inventory
  ) {
    if (!mouseOnMenu()) {
      originalMouseDown.apply(this, [{ mouseX, mouseY }, inv]);
    }
  }

  // Prevent placing petals into loadout slots behind menus
  const originalAddClosest = menuInventory.addClosest;
  menuInventory.addClosest = function(
    p: PetalContainer, globalInv: GlobalInventory
  ) {
    if (!mouseOnMenu()) {
      return originalAddClosest.apply(this, [p, globalInv]);
    } else {
      return false;
    }
  }
  
  // Prevent hovering over petals behind menus for stat boxes
  const originalDraw = Inventory.prototype.draw;
  Inventory.prototype.draw = function(alpha?: number) {
    // While drawing the loadout petals, treat all petals as not being hovered
    // if the user's mouse is hovering over a menu
    const originalDrawStatsBox = PetalContainer.prototype.drawStatsBox;
    if (mouseOnMenu()) {
      PetalContainer.prototype.drawStatsBox = function(
        drawBelow?: boolean, mob?: boolean, x?: number, y?: number,
      ) {
        this.isHovered = false;
        originalDrawStatsBox.apply(this, [drawBelow, mob, x, y]);
      }
    }

    originalDraw.apply(this, [alpha]);

    PetalContainer.prototype.drawStatsBox = originalDrawStatsBox;
  }

  // Prevent snapping a dragged petal to a loadout slot if hovering over a menu
  const originalGetClosest = menuInventory.getClosest;
  menuInventory.getClosest = function(p: PetalContainer) {
    if (!mouseOnMenu()) {
      return originalGetClosest.apply(menuInventory, [p]);
    } else {
      return false;
    }
  }

  // Prevent mouse interactions with squadding UI if hovering over a menu
  const originalRender = squadUI.render;
  squadUI.render = function(dt: number) {
    // If mouse is hovering over a different menu, temporarily move the cursor
    // to (-1e99, -1e99). Unfortunately, this is necessary because the UI
    // directly accesses `canvasX` and `canvasY` to check for mouse placement
    // while drawing the menu, then immediately applies a recoloring effect to
    // a button if it is being hovered.
    const originalX = mouse.canvasX;
    const originalY = mouse.canvasY;
    if (mouseOnMenu()) {
      mouse.canvasX = mouse.canvasY = -1e99;
    }

    originalRender.apply(this, [dt]);

    // Restore original mouse data
    mouse.canvasX = originalX;
    mouse.canvasY = originalY;
  }

  // Prevent clicking on the Starting Wave slider if hovering over a menu
  const originalStartSliderDrag = squadUI.startSliderDrag;
  squadUI.startSliderDrag = function(x: number) {
    if (!mouseOnMenu()) {
      originalStartSliderDrag.apply(this, [x]);
    }
  }

  // Prevent clicking on the "swap biome" arrows
  const originalBiomeMouseDown = biomeManager.mouseDown;
  biomeManager.mouseDown = function({ mouseX, mouseY }: CanvasMouseData2) {
    if (!mouseOnMenu()) {
      originalBiomeMouseDown.apply(this, [{ mouseX, mouseY }]);
    }
  }
}