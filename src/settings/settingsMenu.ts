import { unsafeWindow } from "$";
import { SETTINGS_GREEN, SETTINGS_OPTION_HEIGHT, SCROLLBAR_LENGTH, SETTINGS_SCROLLBAR_MIN_POS } from "../constants/constants";
import { isNil } from "../utils";
import { settings } from "./settingsManager";
import { initOptions, settingsMap } from "./settingsObjects";
import { BooleanOption, KeybindOption, NumberOption, RarityOption, SettingsOption, SettingsSectionHeading } from "./settingsOptions";

/**
 * A menu for displaying this script's settings.
 * 
 * The scrollbar is somewhat adapted from Flowr's base code for its changelog.
 */
export class CinderSettingsMenu extends SettingsMenu {
  /**
   * The {@linkcode KeybindOption} currently being edited, if applicable.
   */
  currentKeybindOption?: KeybindOption;

  private _scroll: number;

  /**
   * The vertical offset of the mouse from the scrollbar's centre if the user
   * is currently dragging the scrollbar, or `undefined` if the user is not
   * dragging the scrollbar.
   */
  draggingScrollbarOffset?: number;

  /**
   * The total height of this menu's contents, equal to
   * {@linkcode SETTINGS_OPTION_HEIGHT} times `this.options.length`.
   */
  totalHeight: number;

  constructor() {
    super();

    this._scroll = 0;
    this.draggingScrollbarOffset = undefined;

    initOptions({
      "invertAttack": new BooleanOption("Invert Attack", "invertAttack"),
      "invertDefend": new BooleanOption("Invert Defend", "invertDefend"),
      "craftingSearchBar": new BooleanOption(
        "Crafting Search Bar", "craftingSearchBar",
      ),
      "autoCopyCodes": new BooleanOption(
        "Auto Copy Squad Codes",
        "autoCopyCodes",
        "If this is turned on and you generate a random squad code, it " +
        "automatically copies the squad code to your clipboard.",
      ),
      "settingsTooltips": new BooleanOption(
        "Settings Tooltips", "settingsTooltips",
      ),
      "petalCraftPreview": new BooleanOption(
        "Petal Craft Preview", "petalCraftPreview",
      ),
      "inventoryExpandButton": new BooleanOption(
        "Inventory Expansion Button", "inventoryExpandButton",
      ),
      "petalRenderQualityThreshold": new NumberOption(
        "Petal Rendering Quality Threshold",
        "petalRenderQualityThreshold",
        -1,
        1000,
        0,
        "This setting controls how many petals can be on-screen at the same " +
        "time before the base game's High Quality Renders get disabled to " +
        "reduce lag. $n $n Set to -1 to keep High Quality Renders enabled " +
        "at all times."
      ),
      "missileDrawPriority": new BooleanOption(
        "Missile Rendering Priority",
        "missileDrawPriority",
        "If turned on, all enemy missiles will be rendered above all actual " +
        "enemies.",
      ),
      "baseReciprocalOfFOV": new NumberOption(
        "Base Zoom Out", "baseReciprocalOfFOV", 0.33, 5, 2,
      ),
      "playerHpBarScale": new NumberOption(
        "Player HP Bar Scale", "playerHpBarScale", 0.5, 5, 2,
      ),
      "specialDropsScale": new NumberOption(
        "Special Drops Scale",
        "specialDropsScale",
        1,
        5,
        2,
        () => `For this setting, a drop is considered 'Special' if it is ` +
        `worth at least ` +
        `$c${SETTINGS_GREEN} ${settings.get("specialDropsQuantity")} ` +
        `$c${Colors.rarities[settings.get("specialDropsRarity")].color} ` +
        `${Colors.rarities[settings.get("specialDropsRarity")].name} ` +
        `$cwhite ` +
        `${settings.get("specialDropsQuantity") === 1 ? "petal" : "petals"}, ` +
        `as configured below.`,
      ),
      "specialDropsRarity": new RarityOption(
        "Special Drops Threshold Rarity", "specialDropsRarity",
      ),
      "specialDropsQuantity": new NumberOption(
        "Special Drops Threshold Amount", "specialDropsQuantity", 0.1, 999, 1,
      ),
      "keybindInvertAttack": new KeybindOption(
        "Invert Attack", "keybindInvertAttack",
      ),
      "keybindInvertDefend": new KeybindOption(
        "Invert Defend", "keybindInvertDefend",
      ),
      "keybindStatsBox": new KeybindOption(
        "Quick Stats Box",
        "keybindStatsBox",
        "This hotkey toggles the stats box of the highest-rarity mob " +
        "currently alive in your room.",
      ),
    });

    // The height is intentionally not a multiple of SETTINGS_OPTION_HEIGHT, to
    // make it clearer to the user that the menu should be scrollable.
    this.h = 11.7 * SETTINGS_OPTION_HEIGHT;
    this.w = 480;
    this.options = Object.freeze([
      new SettingsSectionHeading("General Gameplay"),
      settingsMap.invertAttack,
      settingsMap.invertDefend,
      settingsMap.craftingSearchBar,
      settingsMap.autoCopyCodes,
      new SettingsSectionHeading("General Display"),
      settingsMap.settingsTooltips,
      settingsMap.petalCraftPreview,
      settingsMap.inventoryExpandButton,
      settingsMap.petalRenderQualityThreshold,
      settingsMap.missileDrawPriority,
      new SettingsSectionHeading("Zoom Settings"),
      settingsMap.baseReciprocalOfFOV,
      settingsMap.playerHpBarScale,
      settingsMap.specialDropsScale,
      settingsMap.specialDropsRarity,
      settingsMap.specialDropsQuantity,
      new SettingsSectionHeading(
        "Keybinds",
        "To edit a keybind, click its 'Edit' button and then enter a new " +
        "key to bind it to. You can also delete a keybind by pressing the " +
        "'Delete' key on your keyboard. $n $n " +
        "Caution: If you set multiple keybinds to the same key, all of " +
        "your keybinds will still remain active!",
      ),
      settingsMap.keybindInvertAttack,
      settingsMap.keybindInvertDefend,
      settingsMap.keybindStatsBox,
    ]);
    this.totalHeight = SETTINGS_OPTION_HEIGHT * this.options.length;

    // Allow this menu to process mouse inputs
    const originalOnMouseDown = unsafeWindow.onmousedown;
    unsafeWindow.onmousedown = (e: MouseEvent) => {
      originalOnMouseDown?.apply(unsafeWindow, [e]);

      if (unsafeWindow.connected === true) {
        this.mouseDown({x: mouse.canvasX, y: mouse.canvasY});
      }
    }
    const originalOnMouseUp = unsafeWindow.onmouseup;
    unsafeWindow.onmouseup = (e: MouseEvent) => {
      originalOnMouseUp?.apply(unsafeWindow, [e]);

      if (unsafeWindow.connected === true) {
        this.mouseUp();
      }
    }
    
    // Allow this menu to be drawn
    const originalDraw = settingsMenu.draw;
    settingsMenu.draw = function() {
      originalDraw.apply(this);
      cinderSettingsMenu.draw();
    }

    // Allow this menu to respond to scrolling inputs
    document.addEventListener("wheel", (e: WheelEvent) => {
      this.updateScroll(e);
    });
  }

  /**
   * The y-position at the midpoint of the option currently being rendered.
   */
  get midHeight(): number {
    return this.currentHeight + SETTINGS_OPTION_HEIGHT / 2;
  }

  /**
   * How much the menu's contents are currently shifted due to scrolling. This
   * is directly controlled by user inputs.
   * 
   * I originally planned to have a separate "renderScroll" value that
   * interpolates towards this value, just like most other Flowr UI elements,
   * but I scrapped it because it was causing too much spaghetti code for
   * little benefit.
   */
  get scroll(): number {
    return this._scroll;
  }

  set scroll(val: number) {
    // Enforce bounds here
    this._scroll = Math.min(Math.max(val, 0), this.totalHeight + 10 - this.h);
  }

  /**
   * The ratio of scrollbar movement to actual content movement.
   */
  get scrollbarRatio(): number {
    return (this.h - 2 * SETTINGS_SCROLLBAR_MIN_POS)
      / (this.totalHeight + 10 - this.h);
  }
  
  /**
   * The vertical position of the centre of this menu's scrollbar.
   */
  get scrollbarPos(): number {
    return this.scroll * this.scrollbarRatio + SETTINGS_SCROLLBAR_MIN_POS;
  };

  set scrollbarPos(pos: number) {
    if (!isNil(this.draggingScrollbarOffset)) {
      this.scroll = (pos - SETTINGS_SCROLLBAR_MIN_POS - this.y - this.offset)
        / this.scrollbarRatio;
    }
  }

  // TODO: Make the scroll translation code less spaghetti
  draw() {
    this.offset = interpolate(this.offset, this.targetOffset, 0.3);

    if (!isNil(this.draggingScrollbarOffset)) {
      this.scrollbarPos = mouse.canvasY - this.draggingScrollbarOffset;
    }
    
    // Make sure that options do not get drawn outside the menu
    ctx.save();
    ctx.translate(this.x, this.y + this.offset);
    ctx.beginPath();
    ctx.roundRect(0, 0, this.w, this.h, 3);
    ctx.clip();
    ctx.closePath();

    // Draw the menu's background before we apply scroll translation
    ctx.fillStyle = "#aaaaaa";
    ctx.beginPath();
    ctx.roundRect(0, 0, this.w, this.h, 3);
    ctx.fill();
    ctx.closePath();

    // Draw the scrollbar
    ctx.strokeStyle = "#7f7f7f";
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(this.w - 16, this.scrollbarPos - SCROLLBAR_LENGTH / 2);
    ctx.lineTo(this.w - 16, this.scrollbarPos + SCROLLBAR_LENGTH / 2);
    ctx.stroke();
    ctx.closePath();
    // Set the cursor to "pointer" if it is hovering over the scrollbar
    if (this.active &&
        (this.mouseOnScrollbar() || !isNil(this.draggingScrollbarOffset))) {
      setCursor("pointer");
    }

    // Make sure that options do not get drawn outside the menu
    ctx.beginPath();
    ctx.roundRect(0, 0, this.w, this.h, 3);
    ctx.clip();
    ctx.closePath();

    // Simulate scrolling by translating the renderer and mouse data
    ctx.translate(0, -this.scroll);
    const e = {x: mouse.canvasX, y: mouse.canvasY + this.scroll};
    if (!this.active || !this.mouseInMenu()) {
      e.x = e.y = -Infinity; // Disable off-screen mouse interactions with the menu
    }

    // Render all options
    // TODO: Optimization - Do not render or process any off-screen options
    this.currentHeight = 5;
    for (let option of this.options) {
      this.renderOption(option);
    }
    
    // Draw the tooltip icons
    ctx.translate(-this.x, -this.y);
    for (let option of this.options) {
      option.drawTooltipIcon();
    }

    // Set the cursor to "pointer" if it is hovering over an option
    if (this.active && this.mouseInMenu()) {
      for (let option of this.options) {
        if (!option.isSectionHeading()) {
          if (option.mouseInButton(e)) {
            setCursor("pointer");
          }
        }
      }
    }

    // Draw the menu's border here so it does not get covered by the options
    ctx.restore(); // Reenable drawing outside the menu's border
    ctx.strokeStyle = "#8a8a8a";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.roundRect(
      this.x, this.y + this.offset, this.w, this.h, 3
    );
    ctx.stroke();
    ctx.closePath();

    // Finally, draw tooltip boxes, which can be drawn outside the menu.
    // Note that `drawTooltipBox` must still be called if the menu is inactive,
    // so that the tooltip's opacity gets updated to zero.
    ctx.translate(0, -this.scroll);
    for (let option of this.options) {
      option.drawTooltipBox(e);
    }
    ctx.translate(0, this.scroll);
  }

  /**
   * Renders the given {@linkcode SettingsOption}. Each type of option is
   * rendered differently.
   */
  renderOption(option: SettingsOption | SettingsSectionHeading) {
    if (option.isSectionHeading()) {
      option.draw(this);
    } else if (option.isBooleanOption()) {
      this.renderToggle(option);
    } else if (option.isDisplayValueOption()) {
      option.draw(this);
    }
  }

  /**
   * Processes the user clicking on the settings menu. Each type of option is
   * processed differently. This code is adapted from Flowr's client code.
   */
  mouseDown(e: CanvasMouseData): void {
    if (!this.active) {
      return;
    }
    if (!this.mouseInMenu()) {
      // Prevent clicking on off-screen options
      return;
    }

    // Process clicking the scrollbar
    if (this.mouseOnScrollbar()) {
      this.draggingScrollbarOffset =
        mouse.canvasY - (this.y + this.offset + this.scrollbarPos);
    }

    e.y += this.scroll; // Apply scroll translation
    for (let option of this.options) {
      if (!option.isSectionHeading()) {
        if (option.mouseInButton(e)) {
          if (option.isBooleanOption()) {
            this.processToggle(option, e);
          } else if (option.isDisplayValueOption()) {
            option.onClick(this);
          }
        }
      }
    }
  }

  /**
   * Precesses the user releasing a mouse click.
   */
  mouseUp(): void {
    this.draggingScrollbarOffset = undefined;
  }

  /**
   * Scrolls this menu up/down in response to a mouse wheel input.
   */
  updateScroll(e: WheelEvent) {
    if (this.active && this.mouseInMenu()) {
      // Right now the menu doesn't have many items, so the scrolling speed can
      // be slower for now
      this.scroll += e.deltaY / 2;
    }
  }

  toggle(): void {
    super.toggle();

    // When toggling this menu off, also cancel editing current keybind option
    // and cancel dragging the scrollbar.
    if (!this.active) {
      this.cancelKeybind();
      this.mouseUp();
    }
  }

  /**
   * Sets a {@linkcode KeybindOption} to be edited, and cancel the previous
   * keybind option if applicable.
   */
  setCurrentKeybindOption(option?: KeybindOption): void {
    if (!isNil(this.currentKeybindOption)) {
      this.currentKeybindOption.finishEdit();
    }

    this.currentKeybindOption = option;
  }

  /**
   * Cancels editing the current keybind option.
   */
  cancelKeybind(): void {
    this.setCurrentKeybindOption(undefined);
  }

  /**
   * Checks whether the mouse is inside this menu, excluding its borders.
   */
  mouseInMenu(): boolean {
    return mouseInBox(
      {x: mouse.canvasX, y: mouse.canvasY},
      {x: this.x + 4, y: this.y + 4, w: this.w - 8, h: this.h - 8},
    );
  }

  /**
   * Checks whether the mouse is hovering over this menu's scrollbar.
   */
  mouseOnScrollbar(): boolean {
    return mouseInBox(
      {x: mouse.canvasX, y: mouse.canvasY},
      {
        x: this.x + this.w - 24,
        y: this.y + this.offset + this.scrollbarPos - SCROLLBAR_LENGTH / 2,
        w: 16,
        h: SCROLLBAR_LENGTH,
      },
    );
  }
}

export const cinderSettingsMenu = new CinderSettingsMenu();