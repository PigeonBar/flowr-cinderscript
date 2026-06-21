import { unsafeWindow } from "$";
import { SETTINGS_GREEN, CINDER_BORDER_COLOUR, CINDER_COLOUR, LIGHT_CINDER_COLOUR, SETTINGS_OPTION_HEIGHT, SETTINGS_RED, BASE_GAME_HOTKEYS } from "../constants/constants";
import { HotkeysEditor } from "./chatHotkeysEditor";
import { flowrMod } from "../inits/initFlowrscriptPointer";
import { ColourSelectorUi } from "../ui/colourSelectorUi";
import { isNil } from "../utils";
import { AbstractSettingsMenu } from "./abstractSettingsMenu";
import { settings } from "./settingsManager";
import { initOptions, settingsMap } from "./settingsObjects";
import { BooleanOption, ColourOption, CustomOption, editIcon, KeybindOption, NumberOption, RarityOption, SettingsSectionHeading, type AbstractKeybindOption } from "./settingsOptions";

/**
 * The main menu for displaying this script's settings.
 */
export class CinderSettingsMenu extends AbstractSettingsMenu {
  /**
   * The {@linkcode AbstractKeybindOption} currently being edited, if
   * applicable.
   */
  currentKeybindOption?: AbstractKeybindOption;

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
   * The {@linkcode HotkeysEditor} that can be accessed via this settings menu.
   */
  hotkeysEditor: HotkeysEditor;

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

  /**
   * A record that tracks how many times each key is being used as a keybind.
   * This is mainly used for detecting any keybind conflicts.
   */
  keybindsCounter: Partial<Record<string, number>>;

  constructor() {
    super();

    // The height is intentionally not a multiple of SETTINGS_OPTION_HEIGHT, to
    // make it clearer to the user that the menu should be scrollable.
    this.h = 11.7 * SETTINGS_OPTION_HEIGHT;
    this.w = 480;

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
      flowrscriptLoadWaitTime: new NumberOption(
        "Flowrscript Load Wait Time (seconds)",
        "flowrscriptLoadWaitTime",
        0,
        10,
        2,
        "At the beginning of each page reload, this script will wait until " +
        "either Flowrscript (or related scripts) has finished loading, or " +
        "this time has elapsed. $n $n " +
        "This setting exists because this script breaks if it does not " +
        "properly wait for Flowrscript to finish loading. $n $n " +
        "If you are using some variant of Flowrscript, it is recommended " +
        "to set this setting to a large number. Otherwise, it is " +
        "recommended to set this setting to 0.",
      ),
      disableAllOptimizations: new BooleanOption(
        "Disable All Optimizations",
        "disableAllOptimizations",
        "Turning this setting ON will disable ALL of this script's " +
        "optimizations, including the ones configured below. It is strongly " +
        "recommended to leave this setting OFF, unless it causes unexpected " +
        "rendering issues.",
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
        "Invert Attack", "keybindInvertAttack", this,
      ),
      keybindInvertDefend: new KeybindOption(
        "Invert Defend", "keybindInvertDefend", this,
      ),
      keybindMinimap: new KeybindOption(
        "Toggle Minimap", "keybindMinimap", this,
      ),
      keybindStatsBox: new KeybindOption(
        "Quick Stats Box",
        "keybindStatsBox",
        this,
        "This hotkey toggles the stats box of the highest-rarity mob " +
        "currently alive in your room.",
      ),
      keybindLockSlot: new KeybindOption(
        "Lock Petal Slot",
        "keybindLockSlot",
        this,
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
      useChatHotkeys: new BooleanOption(
        "Use Chat Hotkeys",
        "useChatHotkeys",
        "This setting enables the chat hotkeys configured using the menu " +
        "opened by the next setting. These hotkeys let you configure " +
        "certain keys on your keyboard to instantly send certain chat " +
        "messages. $n $n " +
        "To get you started, the chat hotkeys editing menu will let you " +
        "import Flowrscript's default set of hotkeys. $n $n " +
        "CAUTION: If this is turned on, it will override ALL chat hotkeys " +
        "used by other scripts! Due to technical limitations, it may also " +
        "disable sending chat messages for the first few seconds of each run.",
      ),
      chatHotkeys: new CustomOption(
        "Chat Hotkeys Editor: ",
        editIcon,
        () => this.hotkeysEditor.toggle(),
        () => [SETTINGS_GREEN],
        () => [this.hotkeysEditor.active ? "Open" : "Closed"],
      ),
      disableWelcomeMessage: new BooleanOption(
        "Disable Welcome Message", "disableWelcomeMessage",
      ),
    });

    // If Flowrscript is active, we move our own button further to the right to
    // accomodate for Flowrscript's settings button.
    this.inRunSettingsButton = {
      x: isNil(flowrMod) ? 75 : 140,
      y: 10,
      w: 45,
      h: 45,
    };

    this.options = [
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
      settingsMap.flowrscriptLoadWaitTime,
      settingsMap.disableAllOptimizations,
      settingsMap.disablePetalAnimations,
      settingsMap.disablePetalStars,
      settingsMap.petalRenderQualityThreshold,
      new SettingsSectionHeading(
        "Keybinds",
        "To edit a keybind, click its 'Edit' button and then press the new " +
        "key you wish to use. You can also delete a keybind by pressing the " +
        "'Delete' key on your keyboard. $n $n " +
        `A displayed keybind will turn $c${SETTINGS_RED} RED $cwhite if it ` +
        "conflicts with another keybind, or if you set it to one of the " +
        "following keys: W, A, S, D, Q, E, R, 0-9, '-', '=', '[', or ';'.",
      ),
      settingsMap.keybindInvertAttack,
      settingsMap.keybindInvertDefend,
      settingsMap.keybindMinimap,
      settingsMap.keybindStatsBox,
      settingsMap.keybindLockSlot,
      settingsMap.useChatHotkeys,
      settingsMap.chatHotkeys,
      new SettingsSectionHeading("Welcome"),
      settingsMap.disableWelcomeMessage,
    ];
    Object.freeze(this.options);

    this.settingsImage = new Image(35, 35);
    this.settingsImage.src = `gfx/gear.png?v=${ver}`;
    this.settingsImage.draggable = false;
    
    // Give this menu a colour selector ui and hotkeys editor
    this.colourSelectorUi = new ColourSelectorUi(this);
    this.hotkeysEditor = new HotkeysEditor(this);

    // Initialize the keybinds counter
    this.keybindsCounter = {};
    this.recountKeybinds();
  }

  /**
   * The main function to draw this menu.
   */
  draw(): void {
    // Move this menu to its default position at 110 units, in case it was
    // previously moved to the right of the in-run settings button.
    if (unsafeWindow.state === "menu") {
      this.x = 110;
    }

    if (unsafeWindow.state === "game"
      && !settings.get("hideSettingsDuringRuns")
    ) {
      this.drawInRunButton();
    }

    super.draw();

    // Draw the colour selector UI after drawing this entire menu
    this.colourSelectorUi.draw();
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

  mouseDown(e: CanvasMouseData): void {
    // Process clicking the in-run settings menu button
    if (this.mouseOnInRunButton()) {
      this.toggle();
    }

    // Close this menu when clicking outside the menu during a run
    if (!this.mouseInMenu()
      && this.active
      && unsafeWindow.state !== "menu"
      && !this.mouseOnInRunButton()
    ) {
      this.toggle();
    }

    // We must redo these checks before processing the colour selector UI
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

    super.mouseDown(e);
  }

  mouseUp(): void {
    super.mouseUp();
    this.colourSelectorUi.mouseUp();
  }

  toggle(): void {
    super.toggle();

    // When toggling this menu off, also cancel editing current active options.
    if (!this.active) {
      this.cancelKeybind();
      this.cancelColourOption();
      if (this.hotkeysEditor.active) {
        this.hotkeysEditor.toggle();
      }
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

      // Also close the hotkeys editor when opening the colour selector
      if (this.hotkeysEditor.active) {
        this.hotkeysEditor.toggle();
      }
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
   * Sets a {@linkcode AbstractKeybindOption} to be edited, and cancel the
   * previous keybind option if applicable.
   */
  setCurrentKeybindOption(option?: AbstractKeybindOption): void {
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
   * Performs a full recount to update {@linkcode keybindsCounter}.
   */
  recountKeybinds(): void {
    // Reset the counter
    this.keybindsCounter = {};

    // Count keybinds already reserved by the base game
    for (let keybind of BASE_GAME_HOTKEYS) {
      this.keybindsCounter[keybind] = 1;
    }

    // Count this menu's keybinds
    for (let option of this.options) {
      if (!option.isSectionHeading() && option.isKeybindOption()) {
        const key = option.state;
        this.keybindsCounter[key] = (this.keybindsCounter[key] ?? 0) + 1;
      }
    }

    // Count the hotkey editor's keybinds
    for (let option of this.hotkeysEditor.options) {
      if (!option.isSectionHeading() && option.isHotkeysOption()) {
        const key = option.state.keybind;
        this.keybindsCounter[key] = (this.keybindsCounter[key] ?? 0) + 1;
      }
    }
  }

  /**
   * Checks whether the mouse is inside this menu (including its colour
   * selector UI or its hotkeys editor), excluding its borders.
   */
  mouseInMenu(): boolean {
    return super.mouseInMenu()
      || this.colourSelectorUi.mouseInMenu()
      || this.hotkeysEditor.mouseInMenu();
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

  hasRecentMouseScroll(): boolean {
    return super.hasRecentMouseScroll()
      || this.hotkeysEditor.hasRecentMouseScroll();
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