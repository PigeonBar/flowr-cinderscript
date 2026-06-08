import { unsafeWindow } from "$";
import { SETTINGS_GREEN, SETTINGS_OPTION_HEIGHT, SCROLLBAR_LENGTH, SETTINGS_SCROLLBAR_MIN_POS, CINDER_BORDER_COLOUR, CINDER_COLOUR, LIGHT_CINDER_COLOUR, SETTINGS_GRAY, SETTINGS_GRAY_BORDER } from "../constants/constants";
import { flowrMod } from "../inits/initFlowrscriptPointer";
import { ColourSelectorUi } from "../ui/colourSelectorUi";
import { isNil } from "../utils";
import { settings } from "./settingsManager";
import { initOptions, settingsMap } from "./settingsObjects";
import { BooleanOption, ColourOption, KeybindOption, NumberOption, RarityOption, SettingsOption, SettingsSectionHeading } from "./settingsOptions";

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

  /**
   * The {@linkcode ColourOption} currently being edited, if applicable.
   */
  currentColourOption?: ColourOption;

  /**
   * The {@linkcode ColourSelectorUi} that is used for editing this menu's
   * {@linkcode ColourOption ColourOptions}.
   */
  colourSelectorUi: ColourSelectorUi;

  /**
   * The timestamp for the most recent time that the player used a mouse wheel
   * input to scroll this menu.
   */
  lastMouseWheelTime: number;

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

  /**
   * The position of the in-game settings button outside the main menu.
   * 
   * Having one html + css settings button and another manually drawn settings
   * button is very spaghetti, but it is what it is.
   */
  inRunSettingsButton: { x: number, y: number, w: number, h: number };

  /**
   * The gear icon for the in-run settings menu button.
   */
  settingsImage: CanvasImageSource;

  constructor() {
    super();

    this.lastMouseWheelTime = time - 10000;
    this._scroll = 0;
    this.draggingScrollbarOffset = undefined;

    initOptions({
      invertAttack: new BooleanOption("Invert Attack", "invertAttack"),
      invertDefend: new BooleanOption("Invert Defend", "invertDefend"),
      hideSettingsDuringRuns: new BooleanOption(
        "Hide Settings Menu During Runs", "hideSettingsDuringRuns",
      ),
      craftingSearchBar: new BooleanOption(
        "Crafting Search Bar", "craftingSearchBar",
      ),
      craftAnimationLength: new NumberOption(
        "Crafting Animation Length (seconds)",
        "craftAnimationLength",
        0,
        5,
        2,
        `The base game's default is $c${SETTINGS_GREEN} 3 $cwhite seconds. ` +
        "The crafting animation may run on for longer while the server is " +
        "processing the craft request.",
      ),
      autoCopyCodes: new BooleanOption(
        "Auto Copy Squad Codes",
        "autoCopyCodes",
        "If this is turned on and you generate a random squad code, it " +
        "automatically copies the squad code to your clipboard.",
      ),
      allowLockSlotsOneToFive: new BooleanOption(
        "Allow Hard Locking Petal Slots 1 to 5",
        "allowLockSlotsOneToFive",
        "Tip: It is recommended not to $c#ff0000 hard lock $c#ffffff slots 1 " +
        "to 5, since the Plastic boss's Mania could force you to swap those " +
        "slots.",
      ),
      settingsTooltips: new BooleanOption(
        "Settings Tooltips", "settingsTooltips",
      ),
      petalCraftPreview: new BooleanOption(
        "Petal Craft Preview", "petalCraftPreview",
      ),
      inventoryExpandButton: new BooleanOption(
        "Inventory Expansion Button", "inventoryExpandButton",
      ),
      petalLockShakeIntensity: new NumberOption(
        "Petal Lock Shake Intensity",
        "petalLockShakeIntensity",
        0,
        3,
        2,
      ),
      missileDrawPriority: new BooleanOption(
        "Missile Rendering Priority",
        "missileDrawPriority",
        {
          fn: () => {
            if (isNil(flowrMod)) {
              return "If turned on, all enemy missiles will be rendered " +
                "above all actual enemies.";
            } else {
              return "Since you have installed some variant of Flowrscript " +
                "(which handles this feature automatically), this setting " +
                "does not affect anything.";
            }
          },
          dependentKeys: [],
        },
      ),
      minimapNumberOfMobs: new NumberOption(
        "Number of Mobs",
        "minimapNumberOfMobs",
        0,
        20,
        0,
        "The minimap will always try to show this many mobs. The settings " +
        "below may also show more mobs in addition to this mob count.",
      ),
      minimapAlwaysShowBosses: new BooleanOption(
        "Always Show Bosses",
        "minimapAlwaysShowBosses",
        "If this is turned on, the minimap will always show bosses, " +
        "regardless of the mob count selected above.",
      ),
      minimapAlwaysShowRareMobs: new BooleanOption(
        "Always Show Rare Mobs",
        "minimapAlwaysShowRareMobs",
        "If this is turned on, the minimap will always show rare/valuable " +
        "mobs, regardless of the mob count selected above.",
      ),
      minimapAlwaysShowRarity: new RarityOption(
        "Always Show Rarity",
        "minimapAlwaysShowRarity",
        "The minimap will show all mobs that are at least this rarity, " +
        "regardless of the mob cap selected above. $n $n " +
        "You can disable this by setting this to " +
        `$c${Colors.rarities[0].color} Common $c${SETTINGS_GREEN} (0).`,
      ),
      minimapRareMobAura: new BooleanOption(
        "Rare Mob Aura",
        "minimapRareMobAura",
        "If this is turned on, all rare/valuable mobs shown on the minimap " +
        "will have a glowing aura."
      ),
      gardenBackground: new ColourOption(
        "Garden Background Colour", "gardenBackground",
      ),
      desertBackground: new ColourOption(
        "Desert Background Colour", "desertBackground",
      ),
      oceanBackground: new ColourOption(
        "Ocean Background Colour", "oceanBackground",
      ),
      savannaBackground: new ColourOption(
        "Savanna Background Colour", "savannaBackground",
      ),
      swampBackground: new ColourOption(
        "Swamp Background Colour", "swampBackground",
      ),
      zooBackground: new ColourOption(
        "Zoo Background Colour", "zooBackground",
      ),
      deepZooBackground: new ColourOption(
        "Deep Zoo Background Colour", "deepZooBackground",
      ),
      baseReciprocalOfFOV: new NumberOption(
        "Base Zoom Out", "baseReciprocalOfFOV", 0.33, 5, 2,
      ),
      playerHpBarScale: new NumberOption(
        "Player HP Bar Scale", "playerHpBarScale", 0.5, 5, 2,
      ),
      specialDropsScale: new NumberOption(
        "Special Drops Scale",
        "specialDropsScale",
        1,
        5,
        2,
        {
          fn: () => `For this setting, a drop is considered 'Special' if it ` +
            `is worth at least ` +
            `$c${SETTINGS_GREEN} ${settings.get("specialDropsQuantity")} ` +
            `$c${Colors.rarities[settings.get("specialDropsRarity")].color} ` +
            `${Colors.rarities[settings.get("specialDropsRarity")].name} ` +
            `$cwhite ` +
            `${settings.get("specialDropsQuantity") === 1
              ? "petal" : "petals"
            }, ` +
            `as configured below.`,
          dependentKeys: ["specialDropsRarity", "specialDropsQuantity"],
        }
      ),
      specialDropsRarity: new RarityOption(
        "Special Drops Threshold", "specialDropsRarity",
      ),
      specialDropsQuantity: new NumberOption(
        "Special Drops Threshold Amount", "specialDropsQuantity", 0.1, 999, 1,
      ),
      disableAllOptimizations: new BooleanOption(
        "Disable All Optimizations",
        "disableAllOptimizations",
        "Turning this setting ON will disable ALL of this script's " +
        "optimizations, including the ones configured below. It is strongly " +
        "recommended to leave this setting OFF, unless it causes unexpected " +
        "rendering issues.",
      ),
      petalStarCaching: new BooleanOption(
        "Petal Star Caching",
        "petalStarCaching",
        "This setting affects the stars that travel across fancy petal " +
        "backgrounds. Turning this setting OFF will allow stars to twinkle " +
        "independently of each other, but at a performance cost. ",
      ),
      disablePetalStars: new BooleanOption(
        "Disable Petal Stars", "disablePetalStars",
      ),
      disablePetalAnimations: new BooleanOption(
        "Disable Petal Animations",
        "disablePetalAnimations",
        "This setting disables animations for all petals displayed inside " +
        "petal containers. All fancy petal backgrounds still remain enabled.",
      ),
      petalRenderQualityThreshold: new NumberOption(
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
      keybindInvertAttack: new KeybindOption(
        "Invert Attack", "keybindInvertAttack",
      ),
      keybindInvertDefend: new KeybindOption(
        "Invert Defend", "keybindInvertDefend",
      ),
      keybindMinimap: new KeybindOption(
        "Toggle Minimap", "keybindMinimap",
      ),
      keybindStatsBox: new KeybindOption(
        "Quick Stats Box",
        "keybindStatsBox",
        "This hotkey toggles the stats box of the highest-rarity mob " +
        "currently alive in your room.",
      ),
      keybindLockSlot: new KeybindOption(
        "Lock Petal Slot",
        "keybindLockSlot",
        "While holding down this key, you can press a petal slot's number " +
        "key to cycle its lock state in the following order: $n " +
        "Unlocked > Soft Lock > $c#ff0000 Hard Lock $c#ffffff > Unlocked. " +
        "$n $n " +
        "When a slot is soft locked, it does not get swapped by the [R] " +
        "hotkey, but you can still swap the petal using all other methods. " +
        "(i.e., Flowrscript's system) $n $n " +
        "When a slot is $c#ff0000 hard locked $c#ffffff , you cannot swap " +
        "it with its bottom petal at all. $n $n " +
        "By default, you cannot $c#ff0000 hard lock $c#ffffff slots 1 to 5. " +
        "You can change this behaviour at (Settings > General Gameplay > " +
        "Allow Hard Locking Petal Slots 1 to 5).",
      ),
      disableWelcomeMessage: new BooleanOption(
        "Disable Welcome Message", "disableWelcomeMessage",
      ),
    });

    // The height is intentionally not a multiple of SETTINGS_OPTION_HEIGHT, to
    // make it clearer to the user that the menu should be scrollable.
    this.h = 11.7 * SETTINGS_OPTION_HEIGHT;
    this.w = 480;

    // If Flowrscript is active, we move our own button further to the right to
    // accomodate for Flowrscript's settings button.
    this.inRunSettingsButton = {
      x: isNil(flowrMod) ? 75 : 140,
      y: 10,
      w: 45,
      h: 45,
    };

    this.options = Object.freeze([
      new SettingsSectionHeading("General Gameplay"),
      settingsMap.invertAttack,
      settingsMap.invertDefend,
      settingsMap.hideSettingsDuringRuns,
      settingsMap.craftingSearchBar,
      settingsMap.craftAnimationLength,
      settingsMap.autoCopyCodes,
      settingsMap.allowLockSlotsOneToFive,
      new SettingsSectionHeading("General Display"),
      settingsMap.settingsTooltips,
      settingsMap.petalCraftPreview,
      settingsMap.inventoryExpandButton,
      settingsMap.petalLockShakeIntensity,
      settingsMap.missileDrawPriority,
      new SettingsSectionHeading("Minimap Options"),
      settingsMap.minimapNumberOfMobs,
      settingsMap.minimapAlwaysShowBosses,
      settingsMap.minimapAlwaysShowRareMobs,
      settingsMap.minimapAlwaysShowRarity,
      settingsMap.minimapRareMobAura,
      new SettingsSectionHeading("Background Colours"),
      settingsMap.gardenBackground,
      settingsMap.desertBackground,
      settingsMap.oceanBackground,
      settingsMap.savannaBackground,
      settingsMap.swampBackground,
      settingsMap.zooBackground,
      settingsMap.deepZooBackground,
      new SettingsSectionHeading("Zoom Settings"),
      settingsMap.baseReciprocalOfFOV,
      settingsMap.playerHpBarScale,
      settingsMap.specialDropsScale,
      settingsMap.specialDropsRarity,
      settingsMap.specialDropsQuantity,
      new SettingsSectionHeading("Performance"),
      settingsMap.disableAllOptimizations,
      settingsMap.petalStarCaching,
      settingsMap.disablePetalAnimations,
      settingsMap.disablePetalStars,
      settingsMap.petalRenderQualityThreshold,
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
      settingsMap.keybindMinimap,
      settingsMap.keybindStatsBox,
      settingsMap.keybindLockSlot,
      new SettingsSectionHeading("Welcome"),
      settingsMap.disableWelcomeMessage,
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
    this.settingsImage = new Image(35, 35);
    this.settingsImage.src = `gfx/gear.png?v=${ver}`;
    this.settingsImage.draggable = false;

    const originalRenderMenu = renderMenu;
    renderMenu = (dt: number) => {
      originalRenderMenu(dt);
      this.x = 110;
      this.draw();
    }
    const originalRenderGame = renderGame;
    renderGame = (dt: number) => {
      originalRenderGame(dt);

      // Check that the game isn't in the "reconnecting" state
      if (unsafeWindow.state === "game"
        && !settings.get("hideSettingsDuringRuns")
      ) {
        this.drawInRunButton();
        this.draw();
      }
    }

    // Allow this menu to respond to scrolling inputs
    document.addEventListener("wheel", (e: WheelEvent) => {
      this.mouseScroll(e);
    });
    
    // Give this menu a colour selector ui
    this.colourSelectorUi = new ColourSelectorUi(this);
  }

  /**
   * The y-position at the midpoint of the option currently being rendered.
   */
  get midHeight(): number {
    return this.currentHeight + SETTINGS_OPTION_HEIGHT / 2;
  }

  /**
   * How much the menu's contents are currently shifted due to scrolling.
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
  /**
   * The main function to draw this menu.
   */
  draw(): void {
    this.offset = interpolate(this.offset, this.targetOffset, 0.3);

    if (!isNil(this.draggingScrollbarOffset)) {
      this.scrollbarPos = mouse.canvasY - this.draggingScrollbarOffset;
    }
    
    // Make sure that options do not get drawn outside the menu
    ctx.save();
    ctx.translate(this.x, this.renderY);
    ctx.beginPath();
    ctx.roundRect(0, 0, this.w, this.h, 3);
    ctx.clip();
    ctx.closePath();

    // Draw the menu's background before we apply scroll translation
    ctx.fillStyle = SETTINGS_GRAY;
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
    ctx.strokeStyle = SETTINGS_GRAY_BORDER;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.roundRect(this.x, this.renderY, this.w, this.h, 3);
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

    // Draw the colour selector UI after drawing this entire menu
    this.colourSelectorUi.draw();
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
   * Draws this menu's in-run settings menu button during runs.
   * 
   * This function also handles moving the settings menu to the right of the
   * in-run menu button.
   */
  drawInRunButton(): void {
    ctx.lineWidth = 5;
    ctx.strokeStyle = CINDER_BORDER_COLOUR;
    ctx.fillStyle = CINDER_COLOUR;
    if (this.mouseOnInRunButton()) {
      setCursor("pointer");
      ctx.fillStyle = LIGHT_CINDER_COLOUR;
    }

    // Draw the main button shape
    ctx.beginPath();
    ctx.roundRect(
      this.inRunSettingsButton.x,
      this.inRunSettingsButton.y,
      this.inRunSettingsButton.w,
      this.inRunSettingsButton.h,
      6,
    );
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    // Draw the gear inside the button
    ctx.drawImage(
      this.settingsImage,
      this.inRunSettingsButton.x,
      this.inRunSettingsButton.y,
      this.inRunSettingsButton.w,
      this.inRunSettingsButton.h,
    );

    // Move the settings menu to the right of this button
    this.x = this.inRunSettingsButton.x + 65;
  }

  /**
   * Processes the user clicking on the settings menu. Each type of option is
   * processed differently. This code is adapted from Flowr's client code.
   */
  mouseDown(e: CanvasMouseData): void {
    // Process clicking the in-run settings menu button
    if (this.mouseOnInRunButton()) {
      this.toggle();
    }

    // Prevent clicking on off-screen options
    if (!this.mouseInMenu()) {
      // Close this menu when clicking outside the menu during a run
      if (this.active
        && unsafeWindow.state !== "menu"
        && !this.mouseOnInRunButton()
      ) {
        this.toggle();
      }
      return;
    }

    // Stop processing clicks if this menu is inactive
    if (!this.active) {
      return;
    }
    if (unsafeWindow.state !== "menu"
      && settings.get("hideSettingsDuringRuns")
    ) {
      return;
    }

    // Process clicking the colour selector UI
    this.colourSelectorUi.mouseDown();

    // Process clicking the scrollbar
    if (this.mouseOnScrollbar()) {
      this.draggingScrollbarOffset =
        mouse.canvasY - (this.renderY + this.scrollbarPos);
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
    this.colourSelectorUi.mouseUp();
  }

  /**
   * Scrolls this menu up/down in response to a mouse wheel input.
   * 
   * This does not handle the player dragging the scrollbar.
   */
  mouseScroll(e: WheelEvent): void {
    if (this.active && this.mouseInPrimaryMenu()) {
      this.scroll += e.deltaY / 2;
      this.lastMouseWheelTime = time;
    }
  }

  /**
   * Returns `true` iff this menu received a mouse wheel scroll input within
   * the past 250ms.
   */
  hasRecentMouseScroll(): boolean {
    return performance.now() - this.lastMouseWheelTime < 250;
  }

  toggle(): void {
    super.toggle();

    // When toggling this menu off, also cancel editing current active options
    // and cancel dragging the scrollbar.
    if (!this.active) {
      this.cancelKeybind();
      this.cancelColourOption();
      this.mouseUp();
    }
  }

  /**
   * Sets a {@linkcode ColourOption} to be edited, and cancel the previous
   * colour option if applicable.
   * 
   * This function also handles setting {@linkcode colourSelectorUi} to be
   * editing the new colour option, if it exists.
   */
  setCurrentColourOption(option?: ColourOption): void {
    if (!isNil(this.currentColourOption)) {
      this.currentColourOption.finishEdit();
    }

    // If the colour selector has unsaved changes and we are in the main menu
    // (NOT during a run), prompt the user to save before closing the selector.
    if (this.colourSelectorUi.active && unsafeWindow.state === "menu") {
      this.colourSelectorUi.saveBeforeClosingPrompt();
    }

    this.currentColourOption = option;

    if (!isNil(this.currentColourOption)) {
      this.colourSelectorUi.active = true;
      this.colourSelectorUi.setColour(this.currentColourOption.state);
      this.colourSelectorUi.setDefaultColour(
        settings.getDefault(this.currentColourOption.settingsKey)
      );
    } else {
      this.colourSelectorUi.active = false;
    }
  }

  /**
   * Cancels editing the current colour option.
   */
  cancelColourOption(): void {
    this.setCurrentColourOption(undefined);
  }

  /**
   * Saves the given colour to the currently edited colour option.
   */
  saveColour(colour: string): void {
    this.currentColourOption?.saveColour(colour);
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
   * Checks whether the mouse is inside this menu, excluding its colour
   * selector UI.
   */
  mouseInPrimaryMenu(): boolean {
    return mouseInBox(
      {x: mouse.canvasX, y: mouse.canvasY},
      {x: this.x + 4, y: this.renderY + 4, w: this.w - 8, h: this.h - 8},
    );
  }

  /**
   * Checks whether the mouse is inside this menu (including its colour
   * selector UI), excluding its borders.
   */
  mouseInMenu(): boolean {
    return this.mouseInPrimaryMenu() || this.colourSelectorUi.mouseInMenu();
  }

  /**
   * Checks whether the mouse is hovering over this menu's scrollbar.
   */
  mouseOnScrollbar(): boolean {
    return mouseInBox(
      {x: mouse.canvasX, y: mouse.canvasY},
      {
        x: this.x + this.w - 24,
        y: this.renderY + this.scrollbarPos - SCROLLBAR_LENGTH / 2,
        w: 16,
        h: SCROLLBAR_LENGTH,
      },
    );
  }

  /**
   * Checks whether the mouse is on the in-run settings menu button.
   * 
   * Note: If we are currently in the main menu, then the in-run settings
   * button is disabled, so this function returns `false`.
   */
  mouseOnInRunButton(): boolean {
    return unsafeWindow.state === "game" && mouseInBox(
      {x: mouse.canvasX, y: mouse.canvasY}, this.inRunSettingsButton,
    );
  }
}

/**
 * A menu for displaying this script's settings.
 */
export let cinderSettingsMenu: CinderSettingsMenu;

/**
 * A helper function to initialize {@linkcode cinderSettingsMenu}, to prevent
 * certain side effects from its constructor running during importing.
 */
export function initSettingsMenu(): void {
  cinderSettingsMenu = new CinderSettingsMenu();
}