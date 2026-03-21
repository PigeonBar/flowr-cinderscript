import { settings } from "../settings/settingsManager";

/**
 * This feature adds a search bar to the crafting menu that allows searching by
 * petal type.
 * 
 * This code is somewhat adapted from Flowr's base code for the inventory
 * menu's search bar.
 * 
 * Thanks to ykitsnathan for suggesting this idea!
 */
export function addCraftingSearchBar() {
  craftingMenu.rawPetalContainers = {...craftingMenu.petalContainers};
  craftingMenu.searchBarDimensions = {
    x: craftingMenu.inventorySpace.x + 4,
    // `inventorySpace` has not been translated yet
    y: craftingMenu.inventorySpace.y - 45 + 50,
    w: craftingMenu.inventorySpace.w - 8,
    h: 35,
  };

  // The HTML input element for the search bar
  const craftSearch = document.createElement("input");
  craftSearch.className = petalsearch.className;
  craftSearch.type = "text";
  craftSearch.tabIndex = -2;
  craftSearch.maxLength = 20;
  craftSearch.autocomplete = "off";
  craftSearch.spellcheck = false;
  craftSearch.addEventListener("input", () => {
    craftingMenu.recalculateFilteredPetals();
  });
  document.body.appendChild(craftSearch);
  craftingMenu.craftSearch = craftSearch;

  craftingMenu.mouseInSearchBar = function(): boolean {
    return this.searchBarActive && mouseInBox(
      {x: mouse.canvasX, y: mouse.canvasY},
      {
        x: this.searchBarDimensions.x + 130,
        y: this.searchBarDimensions.y + this.renderY,
        w: this.searchBarDimensions.w,
        h: this.searchBarDimensions.h,
      }
    );
  }

  craftingMenu.searchBarFocused = function(): boolean {
    return document.activeElement === this.craftSearch;
  }

  const originalDraw = craftingMenu.drawInventory;
  craftingMenu.drawInventory = function(alpha: number = 1) {
    // Fix a bug where the inventory space's height becomes too large since it
    // scales with the crafting menu's height
    this.inventorySpace.h = this.h - this.inventorySpace.y - 4;
    if (this.maxRarity > 5) {
      this.inventorySpace.h -= 24; // Make space for horizontal search bar
    }

    // If feature is turned off in settings, just draw crafting menu as usual
    if (!settings.get("craftingSearchBar")) {
      originalDraw.apply(this, [alpha]);
      return;
    }

    originalDraw.apply(this, [alpha]);

    // Draw the search bar
    ctx.translate(130, this.renderY);
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(
      this.searchBarDimensions.x,
      this.searchBarDimensions.y,
      this.searchBarDimensions.w,
      this.searchBarDimensions.h,
    )
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
    
    if (this.mouseInSearchBar()) {
      setCursor("text");
    }

    const hasText = (this.craftSearch.value !== "");
    ctx.fillStyle = hasText ? "#000000" : "#cccccc";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.font = "600 22px Ubuntu";
    ctx.letterSpacing = "0px";

    ctx.fillText(
      hasText ? this.craftSearch.value : "Search...",
      this.searchBarDimensions.x + 8,
      this.searchBarDimensions.y + this.searchBarDimensions.h / 2,
    );

    // Draw the flashing caret
    if (this.searchBarFocused() && Math.floor(time / 500) % 2 === 0) {
      const text = this.craftSearch.value;
      const caretIndex = this.craftSearch.selectionStart ?? text.length;
      const textWidth = ctx.measureText(text.slice(0, caretIndex)).width;
      const caretX = this.searchBarDimensions.x + 8 + textWidth;

      ctx.lineWidth = 2;
      ctx.strokeStyle = "black";
      ctx.beginPath();
      ctx.moveTo(caretX, this.searchBarDimensions.y + 5);
      ctx.lineTo(
        caretX, this.searchBarDimensions.y + this.searchBarDimensions.h - 5
      );
      ctx.stroke();
      ctx.closePath();
    }

    ctx.translate(-130, -this.renderY);
  }

  const originalMouseDown = craftingMenu.mouseDown;
  craftingMenu.mouseDown = function(
    {mouseX, mouseY}: CanvasMouseData2, evt: MouseEvent
  ) {
    originalMouseDown.apply(this, [{mouseX, mouseY}, evt]);

    // Let user type in the search bar if they click on it
    if (this.mouseInSearchBar()) {
      setTimeout(() => craftSearch.focus(), 0);
    }
  }

  const originalToggle = craftingMenu.toggleMenu;
  craftingMenu.toggleMenu = function() {
    originalToggle.apply(this, []);

    // Clear the search field when the menu is toggled
    this.craftSearch.value = "";
    this.recalculateFilteredPetals();
  }

  craftingMenu.recalculateFilteredPetals = function() {
    let filterCount = 0;
    this.petalContainers = {};
    for (let type in this.rawPetalContainers) {
      if (type.toLowerCase().includes(this.craftSearch.value.toLowerCase())) {
        filterCount++;
        this.petalContainers[type] = this.rawPetalContainers[type];
      }
    }

    // Also recalculate indexes for the filtered list of petals
    this.recalculateTypeIndexes();

    // If there are too few rows remaining, disable the scrollbar
    if (filterCount < 5) {
      this.scrollbar.top = 0;
      this.scrollbar.bottom = 0;
      this.scrollbar.renderTop = 0;
      this.scrollbar.renderBottom = 0;
      this.scroll = 0;
    }
  }

  type FnKey =
    "addPetalContainer" |
    "removePetalContainer" |
    "removePetalContainerAmount" |
    "runCraftingAnimation";

  /**
   * Makes one of {@linkcode craftingMenu}'s functions apply to the raw total
   * list of the player's owned petals, instead of the filtered list.
   */
  function rawPetalModifier<K extends FnKey>(key: K) {
    const originalFn = craftingMenu[key] as (...args: any[]) => void;
    craftingMenu[key] = function(...args: any) {
      // Make sure that these changes affect the raw petal list
      this.petalContainers = this.rawPetalContainers;

      originalFn.apply(craftingMenu, args);

      // Recalculate list of filtered petals
      this.recalculateFilteredPetals();
    }
  }

  rawPetalModifier("addPetalContainer");
  rawPetalModifier("removePetalContainer");
  rawPetalModifier("removePetalContainerAmount");
  rawPetalModifier("runCraftingAnimation");

  const originalInitInventory = globalInventory.initInventory;
  globalInventory.initInventory = function(data: any) {
    // When re-initializing the inventory, also clear `rawPetalContainers`
    craftingMenu.rawPetalContainers = {};

    originalInitInventory.apply(this, [data]);
  }

  craftingMenu.updateSearchBarActive = function() {
    const oldTranslate = this.searchBarActive ? 50 : 0;
    this.searchBarActive = settings.get("craftingSearchBar");
    const newTranslate = (this.searchBarActive ? 50 : 0) - oldTranslate;
    
    // Make room (50 units) for the search bar if needed
    this.h += newTranslate;
    this.inventorySpace.y += newTranslate;
    this.scrollbar.start += newTranslate;
    this.scrollbar.end += newTranslate;
  }

  // Apply the current settings right now
  craftingMenu.searchBarActive = false;
  craftingMenu.updateSearchBarActive();
}