import { unsafeWindow } from "$";
import { isNil } from "../utils";
import { initInvertToggles, invertAttackToggle, invertDefendToggle } from "./settingsObjects";
import { BooleanOption, KeybindOption, NumberOption, RarityOption, SettingsSectionHeading, type SettingsOption } from "./settingsOptions";

export class CinderSettingsMenu extends SettingsMenu {
  /**
   * The {@linkcode KeybindOption} currently being edited, if applicable.
   */
  currentKeybindOption?: KeybindOption;

  constructor() {
    super();

    initInvertToggles(
      new BooleanOption("Invert Attack", "invertAttack"),
      new BooleanOption("Invert Defend", "invertDefend"),
    );

    this.w = 480;
    this.options = Object.freeze([
      invertAttackToggle,
      invertDefendToggle,
      new BooleanOption("Petal Craft Preview", "petalCraftPreview"),
      new BooleanOption("Auto Copy Squad Codes", "autoCopyCodes"),
      new NumberOption("Base FOV", "baseReciprocalOfFOV", 0.33, 5, 2),
      new NumberOption("Player HP Bar Scale", "playerHpBarScale", 0.5, 5, 2),
      new NumberOption("Special Drops Scale", "specialDropsScale", 1, 5, 2),
      new RarityOption("Special Drops Threshold Rarity", "specialDropsRarity"),
      new NumberOption(
        "Special Drops Threshold Amount", "specialDropsQuantity", 0.1, 999, 1
      ),
      new BooleanOption("Missile Rendering Priority", "missileDrawPriority"),
      new SettingsSectionHeading("Keybinds"),
      new KeybindOption("Quick Stats Box", "keybindStatsBox"),
      new KeybindOption("Invert Attack", "keybindInvertAttack"),
      new KeybindOption("Invert Defend", "keybindInvertDefend"),
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
            option.onClick();
          }
        }
      }
    }
  }

  toggle() {
    super.toggle();

    // When toggling this menu off, also cancel editing current keybind option.
    if (!this.active) {
      this.setCurrentKeybindOption(undefined);
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
}

export const cinderSettingsMenu = new CinderSettingsMenu();

// TODO before release: Mouseover edit button, delete keybinds, scrolling