import { CINDER_COLOUR, EDIT_ICON_SIZE, KEYBIND_DELETED, SETTINGS_BUTTON_PADDING, SETTINGS_BUTTON_SIZE, SETTINGS_GREEN, SETTINGS_OPTION_HEIGHT, SETTINGS_RED, SETTINGS_VALUE_GRAY, TOOLTIP_ICON_SIZE } from "../constants/constants";
import type { Rarity } from "../enums";
import { ctxDrawText, isHexCode, isNil, rarityToIndex } from "../utils";
import type { AbstractSettingsMenu } from "./abstractSettingsMenu";
import type { HotkeysOption } from "./chatHotkeysEditor";
import { settings, type BooleanSettingsKey, type ColourSettingsKey, type KeybindSettingsKey, type NumberSettingsKey, type RaritySettingsKey } from "./settingsManager";
import { type CinderSettingsMenu } from "./settingsMenu";
import { TooltipIcon, type Tooltip } from "./tooltips";

// icons/settings-edit.svg
export const editIcon = new Image();
editIcon.src = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB3aWR0aD0iMTAwLjAwMDA1bW0iCiAgIGhlaWdodD0iMTAwLjAwMDA2bW0iCiAgIHZpZXdCb3g9IjAgMCAxMDAuMDAwMDUgMTAwLjAwMDA2IgogICB2ZXJzaW9uPSIxLjEiCiAgIGlkPSJzdmcxIgogICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxkZWZzCiAgICAgaWQ9ImRlZnMxIiAvPgogIDxnCiAgICAgaWQ9ImxheWVyMSIKICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtODkuNTI0OTc3LC0zNS42MzI2MDUpIj4KICAgIDxyZWN0CiAgICAgICBzdHlsZT0iZmlsbDojZmZmZmZmO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTojZmZmZmZmO3N0cm9rZS13aWR0aDowLjI4MjEzNztzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSIKICAgICAgIGlkPSJyZWN0MS04IgogICAgICAgd2lkdGg9IjMxLjEyMTQyOSIKICAgICAgIGhlaWdodD0iMTguNTYwMDA3IgogICAgICAgeD0iLTE3NC43NzIyMyIKICAgICAgIHk9Ijc0LjQxNzAyMyIKICAgICAgIHRyYW5zZm9ybT0ibWF0cml4KC0wLjcwNzEwMDA4LC0wLjcwNzExMzQ5LDAuNzA3MTAwMDgsLTAuNzA3MTEzNDksMCwwKSIgLz4KICAgIDxyZWN0CiAgICAgICBzdHlsZT0iZmlsbDojZmZmZmZmO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTojZmZmZmZmO3N0cm9rZS13aWR0aDowLjUxNDk0NTtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSIKICAgICAgIGlkPSJyZWN0MS04LTEiCiAgICAgICB3aWR0aD0iMzAuODg4NjI4IgogICAgICAgaGVpZ2h0PSI2Mi4yOTIxOTQiCiAgICAgICB4PSItMTc0LjY1NTg3IgogICAgICAgeT0iNS40NDUxNTA0IgogICAgICAgdHJhbnNmb3JtPSJtYXRyaXgoLTAuNzA3MTAwMDgsLTAuNzA3MTEzNDksMC43MDcxMDAwOCwtMC43MDcxMTM0OSwwLDApIiAvPgogICAgPHBhdGgKICAgICAgIHN0eWxlPSJmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOiNmZmZmZmY7c3Ryb2tlLXdpZHRoOjAuMDE7c3Ryb2tlLWxpbmVjYXA6c3F1YXJlO3N0cm9rZS1taXRlcmxpbWl0OjA7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjE7cGFpbnQtb3JkZXI6bWFya2VycyBzdHJva2UgZmlsbCIKICAgICAgIGlkPSJwYXRoNCIKICAgICAgIGQ9Im0gNzQuMzU4OTk5LDEzMy44ODE1OSAtMS4yNzY3NzUsMCAwLjYzODM4OCwtMS4xMDU3MiB6IgogICAgICAgdHJhbnNmb3JtPSJtYXRyaXgoLTE3LjI0NDI0MiwtMTcuMjQ0NTcsMTkuODY3Mjg2LC0xOS44Njc2NjMsLTEyNzYuOTkwOCw0MDQ0LjczNDgpIiAvPgogIDwvZz4KPC9zdmc+Cg==";

/**
 * A class for all options in the settings menu.
 */
export abstract class SettingsOption {
  name: string;
  state: any;
  changeTime: number;
  screenPosition: {x: number, y: number, w: number, h: number};
  _tooltipIcon?: TooltipIcon;

  /**
   * A legacy field that is used for the settings menu to handle
   * {@linkcode BooleanOption BooleanOptions}.
   */
  toggleFn: (state?: any) => void;

  constructor(name: string, tooltip?: Tooltip) {
    this.name = name;
    if (!isNil(tooltip)) {
      this._tooltipIcon = new TooltipIcon(tooltip);
    }
    this.changeTime = 0;
    this.screenPosition = {x: 0, y: 0, w: 0, h: 0};

    // Note: Each subclass will be responsible for taking care of these
    // settings states with proper typings.
    this.state = undefined;
    this.toggleFn = () => {};
  }

  get tooltipIcon(): TooltipIcon | undefined {
    // Tooltips only exist if the setting for displaying tooltips is turned on.
    return settings.get("settingsTooltips") ? this._tooltipIcon : undefined;
  }

  /**
   * The position of the centre of the ? tooltip icon for this option.
   */
  get tooltipPos(): {x: number, y: number} {
    ctx.font = "900 17px Ubuntu";
    return {
      x: this.screenPosition.x + SETTINGS_BUTTON_SIZE +
        SETTINGS_BUTTON_PADDING * 2 + ctx.measureText(this.name).width +
        TOOLTIP_ICON_SIZE / 2,
      y: this.screenPosition.y + SETTINGS_BUTTON_SIZE / 2,
    };
  }

  /**
   * @returns `true` iff this is a {@linkcode SettingsSectionHeading}.
   */
  isSectionHeading(): this is SettingsSectionHeading {
    return false;
  }

  /**
   * @returns `true` iff this is a {@linkcode BooleanOption}.
   */
  isBooleanOption(): this is BooleanOption {
    return false;
  }

  /**
   * @returns `true` iff this is a {@linkcode DisplayValueOption}.
   */
  isDisplayValueOption(): this is DisplayValueOption {
    return false;
  }

  /**
   * @returns `true` iff this is a {@linkcode KeybindOption}.
   * 
   * (Note that other {@linkcode AbstractKeybindOption} items do not count.)
   */
  isKeybindOption(): this is KeybindOption {
    return false;
  }

  /**
   * @returns `true` iff this is a {@linkcode HotkeysOption}.
   */
  isHotkeysOption(): this is HotkeysOption {
    return false;
  }

  /**
   * @returns `true` iff this is a {@linkcode CustomOption}.
   */
  isCustomOption(): this is CustomOption {
    return false;
  }

  /**
   * Determines whether or not the given mouse coordinates are inside this
   * option's button.
   */
  mouseInButton(e: CanvasMouseData): boolean {
    return mouseInBox(e, this.screenPosition);
  }

  /**
   * Draws this option's tooltip icon.
   */
  drawTooltipIcon(): void {
    this.tooltipIcon?.drawIcon(this.tooltipPos);
  }

  /**
   * Draws this option's tooltip box.
   */
  drawTooltipBox(e: CanvasMouseData): void {
    this.tooltipIcon?.drawText(this.tooltipPos, e);
  }

  /**
   * Updates the text for this setting's tooltip.
   */
  updateTooltip(): void {
    this._tooltipIcon?.tooltipBox?.generateDesc();
  }
};

/**
 * A class for options that use a button to toggle something on/off.
 */
export class BooleanOption extends SettingsOption {
  state: boolean;

  constructor(name: string, settingsKey: BooleanSettingsKey, tooltip?: Tooltip) {
    super(name, tooltip);

    this.state = settings.get(settingsKey);
    this.toggleFn = (state: boolean) => {
      settings.set(settingsKey, state);
    }
  }

  isBooleanOption(): this is this {
    return true;
  }
}

/**
 * A class for options that have an edit button and display their value in the
 * settings menu.
 * 
 * Currently, {@linkcode BooleanOption BooleanOptions} do not do this because
 * they already convey their current state via their toggle button colour.
 */
export abstract class DisplayValueOption extends SettingsOption {
  constructor(name: string, tooltip?: Tooltip) {
    super(name + ": ", tooltip);
  }

  get tooltipPos(): { x: number; y: number; } {
    let {x, y} = super.tooltipPos;
    for (let text of this.getDisplayedValues()) {
      x += ctx.measureText(text).width;
    }

    return {x, y};
  }

  /**
   * Returns this setting's name without any ": " formatting.
   */
  get simpleName(): string {
    return this.name.replaceAll(": ", "");
  }

  isDisplayValueOption(): this is this {
    return true;
  }

  /**
   * @returns `true` iff this is a {@linkcode ColourOption}.
   */
  isColourOption(): this is ColourOption {
    return false;
  }

  /**
   * Processes `originalColour` to make it flash white if the user has edited
   * this setting within the past 1.5s.
   */
  getFlashColour(originalColour: string): string {
    if (this.changeTime > 0 && time - this.changeTime < 1500) {
      const ratio = (time - this.changeTime) / 1500;
      return blendColor("#ffffff", originalColour, ratio);
    } else {
      return originalColour;
    }
  }

  /**
   * Determines the colours that the values should be displayed in.
   */
  getValueFillStyles(): string[] {
    // By default, the value is displayed as green, and it flashes white over
    // 1.5s when the player edits it.
    return [this.getFlashColour(SETTINGS_GREEN)];
  }

  /**
   * Determines the displayed values, with formatting if necessary.
   */
  getDisplayedValues(): string[] {
    // By default, just display the option's raw value.
    return ["" + this.state];
  }

  /**
   * Draws this option inside the given settings menu.
   * 
   * This code is largely adapted from Flowr's base code.
   */
  draw(menu: AbstractSettingsMenu) {
    // Display the edit button
    this.screenPosition = {
      x: 15 + menu.x,
      y: menu.midHeight - SETTINGS_BUTTON_SIZE / 2 + menu.y,
      w: SETTINGS_BUTTON_SIZE,
      h: SETTINGS_BUTTON_SIZE,
    }

    ctx.fillStyle = "#9f9f9f";
    ctx.strokeStyle = "#5f5f5f";
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.rect(
      this.screenPosition.x - menu.x,
      this.screenPosition.y - menu.y,
      this.screenPosition.w,
      this.screenPosition.h
    );
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    // Display the edit icon
    ctx.drawImage(
      editIcon,
      15 + SETTINGS_BUTTON_SIZE / 2 - EDIT_ICON_SIZE / 2,
      menu.midHeight - EDIT_ICON_SIZE / 2,
      EDIT_ICON_SIZE,
      EDIT_ICON_SIZE,
    );

    // Display the option's name
    ctx.font = "900 17px Ubuntu";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.strokeText(
      this.name,
      15 + SETTINGS_BUTTON_SIZE + SETTINGS_BUTTON_PADDING,
      menu.midHeight,
    );
    ctx.fillText(
      this.name,
      15 + SETTINGS_BUTTON_SIZE + SETTINGS_BUTTON_PADDING,
      menu.midHeight,
    );
    
    // Display the option's current value
    const prevTextWidth = ctx.measureText(this.name).width;
    let currentX = 15 + SETTINGS_BUTTON_SIZE + 
      SETTINGS_BUTTON_PADDING + prevTextWidth;
    for (let i = 0; i < this.getDisplayedValues().length; i++) {
      const text = this.getDisplayedValues()[i];
      ctx.fillStyle = this.getValueFillStyles()[i];
      ctx.strokeText(text, currentX, menu.midHeight);
      ctx.fillText(text, currentX, menu.midHeight);
      currentX += ctx.measureText(text).width;
    }

    if (this.isColourOption() && !this.editingState) {
      // Display the selected colour in a small square
      ctx.strokeStyle = "black";
      ctx.fillStyle = this.state;
      ctx.lineWidth = 2;
      currentX += 10;
      ctx.fillRect(currentX, menu.midHeight - 10, 20, 20);
      ctx.strokeRect(currentX, menu.midHeight - 10, 20, 20);
    }

    menu.currentHeight += SETTINGS_OPTION_HEIGHT;
  }

  /**
   * Handles letting the player edit this setting when the player clicks the
   * edit button.
   */
  abstract onClick(menu: AbstractSettingsMenu, e: CanvasMouseData): void;
}

/**
 * A setting that lets the user pick a colour using the colour selector UI.
 */
export class ColourOption extends DisplayValueOption {
  state: string;
  settingsKey: ColourSettingsKey;
  
  /**
   * Whether or not the player is currently editing this setting.
   */
  editingState: boolean;

  constructor(
    name: string,
    settingsKey: ColourSettingsKey,
    tooltip?: Tooltip,
  ) {
    super(name, tooltip);

    this.state = settings.get(settingsKey);
    this.settingsKey = settingsKey;
    this.editingState = false;
  }

  isColourOption(): this is this {
    return true;
  }

  getDisplayedValues(): string[] {
    // Also display an "Editing..." status if this is being edited
    if (this.editingState) {
      return [this.state, " (Editing...)"];
    } else {
      return [this.state];
    }
  }

  getValueFillStyles(): string[] {
    // Also display an "Editing..." status if this is being edited
    const colour1 = this.getFlashColour(SETTINGS_GREEN);
    if (this.editingState) {
      return [colour1, CINDER_COLOUR];
    } else {
      return [colour1];
    }
  }

  onClick(menu: CinderSettingsMenu): void {
    if (!this.editingState) {
      menu.setCurrentColourOption(this);
      this.editingState = true;
    } else {
      // Also let the user manually cancel editing
      menu.cancelColourOption();
    }
  }

  /**
   * Saves the given colour to the settings.
   */
  saveColour(newColour: string): void {
    if (!isHexCode(newColour)) {
      console.warn(newColour + " is not a valid hex code!");
      return;
    }
    this.changeTime = performance.now();
    this.state = newColour;
    settings.set(this.settingsKey, newColour);
  }

  /**
   * Ends this option's editing state.
   */
  finishEdit(): void {
    this.editingState = false;
  }
}

/**
 * A setting that lets the user pick a numerical option.
 */
export class NumberOption extends DisplayValueOption {
  state: number;
  settingsKey: NumberSettingsKey;
  minValue: number;
  maxValue: number;
  
  /**
   * The number of decimal digits that this setting's value is rounded to.
   */
  decimalDigits: number;

  constructor(
    name: string,
    settingsKey: NumberSettingsKey,
    minValue: number,
    maxValue: number,
    decimalDigits: number,
    tooltip?: Tooltip,
  ) {
    super(name, tooltip);

    this.minValue = minValue;
    this.maxValue = maxValue;
    this.decimalDigits = decimalDigits;

    this.state = settings.get(settingsKey);
    this.settingsKey = settingsKey;
  }

  onClick(): void {
    // Undo the player's click before opening the prompt
    send({attack: false});

    // Prompt the user for a new value, then check its validity
    const rawValue = parseFloat(prompt(
      `You are editing the setting "${this.simpleName}".\n\n` +
      `Please enter a number between ${this.minValue} and ${this.maxValue}.`
    ) ?? "");
    if (rawValue >= this.minValue && rawValue <= this.maxValue) {
      const value = parseFloat(rawValue.toFixed(this.decimalDigits));
      this.changeTime = performance.now();
      this.state = value;
      settings.set(this.settingsKey, value);
    } else {
      alert(
        `Error: ${rawValue} is not a number between ` +
        `${this.minValue} and ${this.maxValue}!`
      );
    }
  }
}

/**
 * A setting that lets the user pick a Rarity.
 */
export class RarityOption extends DisplayValueOption {
  state: Rarity;
  settingsKey: RaritySettingsKey;

  constructor(
    name: string,
    settingsKey: RaritySettingsKey,
    tooltip?: Tooltip,
  ) {
    super(name, tooltip);

    this.state = settings.get(settingsKey);
    this.settingsKey = settingsKey;
  }
  getValueFillStyles(): string[] {
    // The value is now displayed using the rarity's colour, and it still
    // flashes white over 1.5s when the player edits it.
    return [
      this.getFlashColour(Colors.rarities[this.state].color),
      this.getFlashColour(SETTINGS_GREEN),
    ];
  }

  getDisplayedValues(): string[] {
    // Display the name of the rarity
    return [Colors.rarities[this.state].name, ` (${this.state})`];
  }

  onClick(): void {
    // Undo the player's click before opening the prompt
    send({attack: false});

    // Prompt the user for a new value, then check its validity
    const response = prompt(
      `You are editing the setting "${this.simpleName}".\n\n` +
      `Please enter a Rarity.`
    ) ?? "";
    const rarity = rarityToIndex(response);
    if (!isNil(rarity)) {
      this.changeTime = performance.now();
      this.state = rarity;
      settings.set(this.settingsKey, rarity);
    } else {
      alert(
        `Error: "${response}" is not a valid Rarity!`
      );
    }
  }
}

/**
 * A class for settings that involve editing a keybind in some way.
 */
export abstract class AbstractKeybindOption extends DisplayValueOption {
  /**
   * Whether or not the player is currently editing this setting's keybind.
   */
  editingKeybind: boolean;

  /**
   * A timeout for cancelling an edit for this setting.
   */
  editingKeybindTimeout?: number;

  constructor(
    name: string,
    tooltip?: Tooltip,
  ) {
    super(name, tooltip);

    this.editingKeybind = false;
  }

  /**
   * A helper function to determine the right colour to draw the keybind's
   * text, according to the following rules:
   * 1. If the keybind is set to "<None>" (i.e., deleted by user), it is gray.
   * 2. If the keybind conflicts with another keybind, it is red.
   * 3. If none of the above apply, it is green.
   */
  getKeybindColour(keybind: string, parentMenu: CinderSettingsMenu): string {
    if (keybind === KEYBIND_DELETED) {
      return this.getFlashColour(SETTINGS_VALUE_GRAY);
    } else if ((parentMenu.keybindsCounter[keybind] ?? 0) >= 2) {
      return this.getFlashColour(SETTINGS_RED);
    } else {
      return this.getFlashColour(SETTINGS_GREEN);
    }
  }

  onClick(menu: CinderSettingsMenu, _e: CanvasMouseData): void {
    if (!this.editingKeybind) {
      menu.setCurrentKeybindOption(this);
      this.editingKeybind = true;
      // Automatically cancel the edit after 3 seconds
      this.editingKeybindTimeout = setTimeout(() => {
        menu.cancelKeybind();
      }, 3000);
    } else {
      // Also let the user manually cancel editing
      menu.cancelKeybind();
    }
  }

  /**
   * Ends this option's editing state, and sets the setting to the new keybind
   * if given.
   */
  finishEdit(_newKeybind?: string): void {
    clearTimeout(this.editingKeybindTimeout);
    this.editingKeybind = false;
    this.editingKeybindTimeout = undefined;
  }
}

/**
 * A setting that lets the user edit a keybind for a script feature.
 */
export class KeybindOption extends AbstractKeybindOption {
  state: string;
  settingsKey: KeybindSettingsKey;

  /**
   * The settings menu that this option belongs to.
   */
  parentMenu: CinderSettingsMenu;

  constructor(
    name: string,
    settingsKey: KeybindSettingsKey,
    parentMenu: CinderSettingsMenu,
    tooltip?: Tooltip,
  ) {
    super(name, tooltip);

    this.state = settings.get(settingsKey);
    this.settingsKey = settingsKey;
    this.parentMenu = parentMenu;
  }

  isKeybindOption(): this is this {
    return true;
  }

  getDisplayedValues(): string[] {
    // Also display an "Editing..." status if this is being edited
    if (this.editingKeybind) {
      return [this.state, " (Editing...)"];
    } else {
      return [this.state];
    }
  }

  getValueFillStyles(): string[] {
    const colour1 = this.getKeybindColour(this.state, this.parentMenu);

    // Also display an "Editing..." status if this is being edited
    if (this.editingKeybind) {
      return [colour1, CINDER_COLOUR];
    } else {
      return [colour1];
    }
  }

  finishEdit(newKeybind?: string): void {
    super.finishEdit(newKeybind);

    if (!isNil(newKeybind)) {
      this.changeTime = performance.now();
      this.state = newKeybind;
      settings.set(this.settingsKey, newKeybind);

      // Tell parent menu to recount keybinds whenever this setting gets edited
      this.parentMenu.recountKeybinds();
    }
  }
}

/**
 * A setting that has a custom icon and a custom action that it performs when
 * the user clicks its button.
 */
export class CustomOption extends DisplayValueOption {
  /**
   * This option's custom icon to be displayed on its button.
   */
  icon: CanvasImageSource;

  /**
   * This option's custom action that it performs when the user clicks its
   * button.
   */
  _onClick: (menu: AbstractSettingsMenu, e: CanvasMouseData) => void;

  /**
   * A function to determine the colours of this option's custom displyed
   * values, if applicable.
   */
  _getValueFillStyles?: () => string[];

  /**
   * A function to determine this option's custom displayed values, if
   * applicable.
   */
  _getDisplayedValues?: () => string[];

  constructor(
    text: string,
    icon: CanvasImageSource,
    onClick: (menu: AbstractSettingsMenu, e: CanvasMouseData) => void,
    getValueFillStyles?: () => string[],
    getDisplayedValues?: () => string[],
    tooltip?: Tooltip,
  ) {
    super(text, tooltip);

    this.icon = icon;
    this._onClick = onClick;
    this._getValueFillStyles = getValueFillStyles;
    this._getDisplayedValues = getDisplayedValues;
    
    // Re-initialize the name since the superclass adds a ": " to the name
    this.name = text;
  }

  isCustomOption(): this is this {
    return true;
  }

  getValueFillStyles(): string[] {
    if (isNil(this._getValueFillStyles)) {
      return [];
    } else {
      return this._getValueFillStyles();
    }
  }

  getDisplayedValues(): string[] {
    if (isNil(this._getDisplayedValues)) {
      return [];
    } else {
      return this._getDisplayedValues();
    }
  }

  onClick(menu: AbstractSettingsMenu, e: CanvasMouseData): void {
    this._onClick(menu, e);
  }

  // This code is largely copied from `DisplayValueOption.draw()`, but we have
  // to copy here in order to change the button's icon.
  draw(menu: AbstractSettingsMenu) {
    super.draw(menu);

    // Redraw the "Edit" button in order to draw its custom icon
    menu.currentHeight -= SETTINGS_OPTION_HEIGHT;
    ctx.fillStyle = "#9f9f9f";
    ctx.strokeStyle = "#5f5f5f";
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.rect(
      this.screenPosition.x - menu.x,
      this.screenPosition.y - menu.y,
      this.screenPosition.w,
      this.screenPosition.h
    );
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    // Display this option's custom icon
    ctx.drawImage(
      this.icon,
      15 + SETTINGS_BUTTON_SIZE / 2 - EDIT_ICON_SIZE / 2,
      menu.midHeight - EDIT_ICON_SIZE / 2,
      EDIT_ICON_SIZE,
      EDIT_ICON_SIZE,
    );

    menu.currentHeight += SETTINGS_OPTION_HEIGHT;
  }
}

/**
 * A heading to label the next section in the settings menu.
 */
export class SettingsSectionHeading {
  text: string;
  tooltipPos: {x: number, y: number};
  _tooltipIcon?: TooltipIcon;

  constructor(text: string, tooltip?: Tooltip) {
    this.text = text;
    if (!isNil(tooltip)) {
      this._tooltipIcon = new TooltipIcon(tooltip);
    }
    this.tooltipPos = {x: 0, y: 0};
  }

  get tooltipIcon(): TooltipIcon | undefined {
    // Tooltips only exist if the setting for displaying tooltips is turned on.
    return settings.get("settingsTooltips") ? this._tooltipIcon : undefined;
  }

  /**
   * @returns `true` iff this is a {@linkcode SettingsSectionHeading}.
   */
  isSectionHeading(): this is this {
    return true;
  }

  /**
   * Draws this header inside the given settings menu.
   * 
   * This code is adapted from the Flowr changelog's horizontal dividers.
   */
  draw(menu: AbstractSettingsMenu) {
    // Determine the locations to draw each item
    ctx.font = "900 17px Ubuntu";
    const textWidth = ctx.measureText(this.text).width;
    let textLeftPos = menu.w / 2 - textWidth / 2;
    let textRightPos = menu.w / 2 + textWidth / 2;
    if (!isNil(this.tooltipIcon)) {
      // Make space for the tooltip icon
      const extraSpace = TOOLTIP_ICON_SIZE + SETTINGS_BUTTON_PADDING;
      textLeftPos -= extraSpace / 2;
      textRightPos += extraSpace / 2;

      this.tooltipPos = {
        x: menu.x + textRightPos - TOOLTIP_ICON_SIZE / 2,
        y: menu.y + menu.midHeight,
      };
    }

    // Display the header text
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.strokeText(this.text, textLeftPos, menu.midHeight);
    ctx.fillText(this.text, textLeftPos, menu.midHeight);
    
    // Display the separator line (with a space in between for the header text)
    ctx.strokeStyle = "#7f7f7f";
    ctx.lineWidth = 8;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(SETTINGS_BUTTON_PADDING, menu.midHeight);
    ctx.lineTo(textLeftPos - SETTINGS_BUTTON_PADDING, menu.midHeight);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(textRightPos + SETTINGS_BUTTON_PADDING, menu.midHeight);
    // The extra -16 is to make room for the scrollbar
    ctx.lineTo(menu.w - SETTINGS_BUTTON_PADDING - 16, menu.midHeight);
    ctx.stroke();
    ctx.closePath();

    menu.currentHeight += SETTINGS_OPTION_HEIGHT;
  }

  /**
   * Draws this section's tooltip icon.
   */
  drawTooltipIcon(): void {
    this.tooltipIcon?.drawIcon(this.tooltipPos);
  }

  /**
   * Draws this section's tooltip box.
   */
  drawTooltipBox(e: CanvasMouseData): void {
    this.tooltipIcon?.drawText(this.tooltipPos, e);
  }
}

/**
 * The top row of a table, containing the labels for the table's columns.
 */
export class TableHeading extends SettingsSectionHeading {
  /**
   * The text labels for the table's columns.
   */
  labels: string[];
  
  /**
   * The x-coordinates of the table's vertical separators.
   */
  separators: number[];

  constructor(labels: string[], separators: number[]) {
    super("");

    this.labels = labels;
    this.separators = separators;
  }

  draw(menu: AbstractSettingsMenu): void {
    // Draw the labels in order
    const numLabels = Math.min(this.labels.length, this.separators.length + 1);
    const textBorders = [
      SETTINGS_BUTTON_PADDING,
      ...this.separators,
      menu.w - SETTINGS_BUTTON_PADDING,
    ];
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    for (let i = 0; i < numLabels; i++) {
      const midX = (textBorders[i] + textBorders[i + 1]) / 2;
      ctxDrawText(this.labels[i], midX, menu.midHeight);
    }

    // Draw the vertical separators in order
    ctx.strokeStyle = "#7f7f7f";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    for (let i = 0; i < numLabels - 1; i++) {
      ctx.beginPath();
      ctx.moveTo(
        this.separators[i], menu.currentHeight + SETTINGS_BUTTON_PADDING,
      );
      ctx.lineTo(
        this.separators[i], menu.currentHeight + SETTINGS_OPTION_HEIGHT,
      );
      ctx.stroke();
      ctx.closePath();
    }
    
    // Draw horizontal separator between this heading and the basic items below
    menu.currentHeight += SETTINGS_OPTION_HEIGHT;
    ctx.beginPath();
    ctx.moveTo(SETTINGS_BUTTON_PADDING, menu.currentHeight);
    // The extra -16 is to make room for the scrollbar
    ctx.lineTo(menu.w - SETTINGS_BUTTON_PADDING - 16, menu.currentHeight);
    ctx.stroke();
    ctx.closePath();
  }
}