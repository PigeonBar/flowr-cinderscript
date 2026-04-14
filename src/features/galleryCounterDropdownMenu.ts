import { GALLERY_EXTRA_HEIGHT, GALLERY_EXTRA_HOR_SPACE, GALLERY_TOP_PADDING, TEXT_LIGHT_BLUE, TEXT_LIGHT_RED } from "../constants/constants";
import { DropdownUI } from "../ui/dropdownUi";

/**
 * This feature adds a dropdown menu to choose which stat the mob gallery's
 * counter is currently displaying.
 */
export function addGalleryCounterDropdownMenu(): void {
  const originalResize = mobGallery.resize;
  mobGallery.resize = function(h?: number) {
    originalResize.apply(this, [h]);

    // Make extra room for the dropdown menu
    this.h += GALLERY_EXTRA_HEIGHT;
    this.dimensions.h += GALLERY_EXTRA_HEIGHT;
    this.inventorySpace.y += GALLERY_EXTRA_HEIGHT;
    this.scrollBounds.y.end += GALLERY_EXTRA_HEIGHT;

    // Some of the gallery's UI is no longer constrained by the X button, so
    // update their dimensions accordingly.
    // Unfortunately, this causes `inventorySpace.w` to no longer be a neat
    // multiple of the gallery entries' width, but it is what it is.
    this.inventorySpace.w += GALLERY_EXTRA_HOR_SPACE;
    this.scrollBounds.y.start = this.inventorySpace.y + this.scrollBarSize / 2
      + 14 + GALLERY_TOP_PADDING;
  }

  const originalDrawRows = mobGallery.drawRows;
  mobGallery.drawRows = function() {
    originalDrawRows.apply(this);

    // `scrollExcess` needs to be updated here because here is where it gets
    // updated in Flowr's base code.
    this.scrollExcess.x -= GALLERY_EXTRA_HOR_SPACE;
  }

  // Make sure that the mob entries' y-positions start at the designated
  // viewing area, with some padding to fit their amount counters.
  mobGallery._currentY = mobGallery.currentY;
  Object.defineProperty(mobGallery, "currentY", {
    get: function(this: MobGallery) {
      return this._currentY;
    },
    set: function(this: MobGallery, v: number) {
      this._currentY =
        Math.max(v, this.inventorySpace.y + GALLERY_TOP_PADDING);
    },
  });

  const originalUpdateScroll = mobGallery.updateScroll;
  mobGallery.updateScroll = function(
    scroll: {x: number, y: number}, { mouseX, mouseY }: CanvasMouseData2,
  ) {
    // Only accept scroll inputs if the mouse is within the viewing area's
    // vertical range.
    if (mouseInBox({ x: mouseX, y: mouseY },
      {
        x: this.x,
        y: this.inventorySpace.y,
        w: this.w,
        h: this.inventorySpace.h,
      },
    )) {
      originalUpdateScroll.apply(this, [scroll, { mouseX, mouseY }]);
    }
  }

  // Set up the dropdown UI
  const dropdownUI = new DropdownUI(
    "Display count:",
    "cinderMobStatDisplay",
    mobGallery.x + mobGallery.w / 2,
    mobGallery.renderY + 80,
    [
      { text: "None", colour: "white", },
      { text: "Kills", colour: TEXT_LIGHT_RED, },
      { text: "Spawns", colour: TEXT_LIGHT_BLUE, },
      { text: "Kills +", colour: TEXT_LIGHT_RED, },
      { text: "Spawns +", colour: TEXT_LIGHT_BLUE, },
    ],
    `The "Kills +" and "Spawns +" options count Lucky mobs multiple times ` +
    `based on their loot multipliers.`,
  );

  dropdownUI.addListener((option: string) => {
    mobGallery.setCountMode(option);
  });

  const originalDrawInventory = mobGallery.drawInventory;
  mobGallery.drawInventory = function(alpha?: number) {
    // Draw the usual mob gallery stuff
    originalDrawInventory.apply(this, [alpha]);

    // Draw the mob gallery's title
    ctx.font = "900 32px Ubuntu";
    ctx.lineWidth = 3.75;
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    ctx.strokeText("Mob Gallery", this.x + this.w / 2, this.renderY + 15);
    ctx.fillText("Mob Gallery", this.x + this.w / 2, this.renderY + 15);

    // Draw the dropdown UI
    dropdownUI.y = this.renderY + 75;
    dropdownUI.draw();
  }

  const originalMouseDown = mobGallery.mouseDown;
  mobGallery.mouseDown = function({ x, y }: CanvasMouseData) {
    // Let the gallery process the click input as usual
    originalMouseDown.apply(this, [{ x, y }]);

    // Also let the dropdown menu process the click input
    dropdownUI.mouseDown();
  }

  // Always treat gallery entries behind the dropdown menu as not being
  // hovered. Also, do not allow gallery entries to be hovered immediately
  // after selecting an option in the dropdown.
  const originalDrawStatsBox = Enemy.prototype.drawStatsBox;
  Enemy.prototype.drawStatsBox = function(
    drawBelow?: boolean, rarityOverride?: boolean,
  ) {
    if (dropdownUI.hoveredOptionIndex() > -1
        || dropdownUI.recentlySelectedOption()
    ) {
      this.isHovered = false;
    }
    originalDrawStatsBox.apply(this, [drawBelow, rarityOverride]);
  }
}