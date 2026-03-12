import { unsafeWindow } from "$";
import { SETTINGS_GREEN, SETTINGS_OPTION_HEIGHT } from "../constants";
import { isNil } from "../utils";
import { settings } from "./settingsManager";
import { initOptions, settingsMap } from "./settingsObjects";
import { BooleanOption, KeybindOption, NumberOption, RarityOption, SettingsOption, SettingsSectionHeading } from "./settingsOptions";

export class CinderSettingsMenu extends SettingsMenu {
  /**
   * The {@linkcode KeybindOption} currently being edited, if applicable.
   */
  currentKeybindOption?: KeybindOption;

  constructor() {
    super();

    initOptions({
      "invertAttack": new BooleanOption("Invert Attack", "invertAttack"),
      "invertDefend": new BooleanOption("Invert Defend", "invertDefend"),
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
        "This keybind toggles the stats box of the highest-rarity mob " +
        "currently alive in your room.",
      ),
    });

    this.w = 480;
    this.options = Object.freeze([
      new SettingsSectionHeading("General Gameplay"),
      settingsMap.invertAttack,
      settingsMap.invertDefend,
      settingsMap.autoCopyCodes,
      new SettingsSectionHeading("General Display"),
      settingsMap.settingsTooltips,
      settingsMap.petalCraftPreview,
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

    // Allow this menu to process mouse inputs
    const originalOnMouseDown = unsafeWindow.onmousedown;
    unsafeWindow.onmousedown = (e: MouseEvent) => {
      originalOnMouseDown?.apply(unsafeWindow, [e]);

      if (unsafeWindow.connected === true) {
        this.mouseDown({x: mouse.canvasX, y: mouse.canvasY});
      }
    }
    
    // Allow this menu to be drawn
    const originalDraw = settingsMenu.draw;
    settingsMenu.draw = function() {
      originalDraw.apply(this);
      cinderSettingsMenu.draw();
    }
  }

  /**
   * The y-position at the midpoint of the option currently being rendered.
   */
  get midHeight(): number {
    return this.currentHeight + SETTINGS_OPTION_HEIGHT / 2;
  }

  draw() {
    super.draw();
    
    // Draw the tooltips and tooltip icons afterward, in reverse order so that
    // tooltips do not get covered up by the proceeding tooltip icons.
    ctx.translate(0, this.offset);
    for (let i = this.options.length - 1; i >= 0; i--) {
      this.options[i].drawTooltip();
    }
    ctx.translate(0, -this.offset);
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
  mouseDown(e: CanvasMouseData) {
    if (!this.active) {
      return;
    }

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

  toggle() {
    super.toggle();

    // When toggling this menu off, also cancel editing current keybind option.
    if (!this.active) {
      this.cancelKeybind();
    }
  }

  /**
   * Sets a {@linkcode KeybindOption} to be edited, and cancel the previous
   * keybind option if applicable.
   */
  setCurrentKeybindOption(option?: KeybindOption) {
    if (!isNil(this.currentKeybindOption)) {
      this.currentKeybindOption.finishEdit();
    }

    this.currentKeybindOption = option;
  }

  /**
   * Cancels editing the current keybind option.
   */
  cancelKeybind() {
    this.setCurrentKeybindOption(undefined);
  }
}

export const cinderSettingsMenu = new CinderSettingsMenu();

// TODO before release: Scrollbar