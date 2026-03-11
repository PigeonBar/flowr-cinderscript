import { CINDER_COLOUR, EDIT_ICON_SIZE, SETTINGS_BUTTON_SIZE, SETTINGS_OPTION_HEIGHT } from "../constants";
import type { Rarity } from "../enums";
import { isNil, rarityToIndex } from "../utils";
import { settings, type BooleanSettingsKey, type KeybindSettingsKey, type NumberSettingsKey, type RaritySettingsKey } from "./settingsManager";
import { cinderSettingsMenu, type CinderSettingsMenu } from "./settingsMenu";

// icons/settings-edit.svg
const editIcon = new Image();
editIcon.src = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB3aWR0aD0iMTAwLjAwMDA1bW0iCiAgIGhlaWdodD0iMTAwLjAwMDA2bW0iCiAgIHZpZXdCb3g9IjAgMCAxMDAuMDAwMDUgMTAwLjAwMDA2IgogICB2ZXJzaW9uPSIxLjEiCiAgIGlkPSJzdmcxIgogICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxkZWZzCiAgICAgaWQ9ImRlZnMxIiAvPgogIDxnCiAgICAgaWQ9ImxheWVyMSIKICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtODkuNTI0OTc3LC0zNS42MzI2MDUpIj4KICAgIDxyZWN0CiAgICAgICBzdHlsZT0iZmlsbDojZmZmZmZmO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTojZmZmZmZmO3N0cm9rZS13aWR0aDowLjI4MjEzNztzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSIKICAgICAgIGlkPSJyZWN0MS04IgogICAgICAgd2lkdGg9IjMxLjEyMTQyOSIKICAgICAgIGhlaWdodD0iMTguNTYwMDA3IgogICAgICAgeD0iLTE3NC43NzIyMyIKICAgICAgIHk9Ijc0LjQxNzAyMyIKICAgICAgIHRyYW5zZm9ybT0ibWF0cml4KC0wLjcwNzEwMDA4LC0wLjcwNzExMzQ5LDAuNzA3MTAwMDgsLTAuNzA3MTEzNDksMCwwKSIgLz4KICAgIDxyZWN0CiAgICAgICBzdHlsZT0iZmlsbDojZmZmZmZmO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTojZmZmZmZmO3N0cm9rZS13aWR0aDowLjUxNDk0NTtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSIKICAgICAgIGlkPSJyZWN0MS04LTEiCiAgICAgICB3aWR0aD0iMzAuODg4NjI4IgogICAgICAgaGVpZ2h0PSI2Mi4yOTIxOTQiCiAgICAgICB4PSItMTc0LjY1NTg3IgogICAgICAgeT0iNS40NDUxNTA0IgogICAgICAgdHJhbnNmb3JtPSJtYXRyaXgoLTAuNzA3MTAwMDgsLTAuNzA3MTEzNDksMC43MDcxMDAwOCwtMC43MDcxMTM0OSwwLDApIiAvPgogICAgPHBhdGgKICAgICAgIHN0eWxlPSJmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOiNmZmZmZmY7c3Ryb2tlLXdpZHRoOjAuMDE7c3Ryb2tlLWxpbmVjYXA6c3F1YXJlO3N0cm9rZS1taXRlcmxpbWl0OjA7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjE7cGFpbnQtb3JkZXI6bWFya2VycyBzdHJva2UgZmlsbCIKICAgICAgIGlkPSJwYXRoNCIKICAgICAgIGQ9Im0gNzQuMzU4OTk5LDEzMy44ODE1OSAtMS4yNzY3NzUsMCAwLjYzODM4OCwtMS4xMDU3MiB6IgogICAgICAgdHJhbnNmb3JtPSJtYXRyaXgoLTE3LjI0NDI0MiwtMTcuMjQ0NTcsMTkuODY3Mjg2LC0xOS44Njc2NjMsLTEyNzYuOTkwOCw0MDQ0LjczNDgpIiAvPgogIDwvZz4KPC9zdmc+Cg==";

/**
 * A class for all options in the settings menu.
 * 
 * TODO: Tooltips describing what each setting does.
 */
export abstract class SettingsOption {
  name: string;
  state: any;
  changeTime: number;
  screenPosition: {x: number, y: number, w: number, h: number};

  /**
   * A legacy field that is used for the settings menu to handle
   * {@linkcode BooleanOption BooleanOptions}.
   */
  toggleFn: (state?: any) => void;

  constructor(name: string) {
    this.name = name;
    this.changeTime = 0;
    this.screenPosition = {x: 0, y: 0, w: 0, h: 0};

    // Note: Each subclass will be responsible for taking care of these
    // settings states with proper typings.
    this.state = undefined;
    this.toggleFn = () => {};
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
   * @returns `true` iff this is a {@linkcode RarityOption}.
   */
  isRarityOption(): this is RarityOption {
    return false;
  }

  /**
   * Determines whether or not the given mouse coordinates are inside this
   * option's button.
   */
  mouseInButton(e: CanvasMouseData): boolean {
    return mouseInBox(e, this.screenPosition);
  }
};

/**
 * A class for options that use a button to toggle something on/off.
 */
export class BooleanOption extends SettingsOption {
  state: boolean;

  constructor(name: string, settingsKey: BooleanSettingsKey) {
    super(name);

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
  isDisplayValueOption(): this is this {
    return true;
  }

  /**
   * Determines the colour that the value should be displayed in.
   */
  getValueFillStyle(): string {
    // By default, the value is displayed as green, and it flashes white over
    // 1.5s when the player edits it.
    if (this.changeTime > 0 && time - this.changeTime < 1500) {
      const ratio = (time - this.changeTime) / 1500;
      return blendColor("#ffffff", "#3fff3f", ratio);
    } else {
      return "#3fff3f";
    }
  }

  /**
   * Determines the displayed value, with formatting if necessary.
   */
  getDisplayedValue(): string {
    // By default, just display the option's raw value.
    return "" + this.state;
  }

  /**
   * Draws this option inside the given settings menu.
   * 
   * Large amounts of this code is adapted from Flowr's base code.
   */
  draw(menu: CinderSettingsMenu) {
    // Display the edit button
    this.screenPosition = {
      x: 15 + menu.x,
      y: menu.currentHeight + SETTINGS_OPTION_HEIGHT / 2 - SETTINGS_BUTTON_SIZE / 2 + menu.y,
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
      menu.currentHeight + SETTINGS_OPTION_HEIGHT / 2 - EDIT_ICON_SIZE / 2,
      EDIT_ICON_SIZE,
      EDIT_ICON_SIZE,
    );

    // Display the option's name
    ctx.font = "900 17px Ubuntu";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    // If this is a Rarity option, we display the name as light-gray to
    // visually distinguish it from the Transcendent rarity.
    ctx.fillStyle = this.isRarityOption() ? "#cfcfcf" : "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.strokeText(
      this.name + ": ",
      15 + SETTINGS_BUTTON_SIZE + 13,
      menu.currentHeight + SETTINGS_OPTION_HEIGHT / 2,
    );
    ctx.fillText(
      this.name + ": ",
      15 + SETTINGS_BUTTON_SIZE + 13,
      menu.currentHeight + SETTINGS_OPTION_HEIGHT / 2,
    );
    
    // Display the option's current value
    ctx.fillStyle = this.getValueFillStyle();
    const prevTextWidth = ctx.measureText(this.name + ": ").width;
    ctx.strokeText(
      this.getDisplayedValue(),
      15 + SETTINGS_BUTTON_SIZE + 13 + prevTextWidth,
      menu.currentHeight + SETTINGS_OPTION_HEIGHT / 2,
    );
    ctx.fillText(
      this.getDisplayedValue(),
      15 + SETTINGS_BUTTON_SIZE + 13 + prevTextWidth,
      menu.currentHeight + SETTINGS_OPTION_HEIGHT / 2,
    );

    menu.currentHeight += SETTINGS_OPTION_HEIGHT;
  }

  /**
   * Handles letting the player edit this setting when the player clicks the
   * edit button.
   */
  abstract onClick(): void;
}

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
  ) {
    super(name);

    this.minValue = minValue;
    this.maxValue = maxValue;
    this.decimalDigits = decimalDigits;

    this.state = settings.get(settingsKey);
    this.settingsKey = settingsKey;
  }

  onClick(): void {
    // Prompt the user for a new value, then check its validity
    const rawValue = parseFloat(prompt(
      `You are editing the setting "${this.name}".\n\n` +
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

export class RarityOption extends DisplayValueOption {
  state: Rarity;
  settingsKey: RaritySettingsKey;

  constructor(
    name: string,
    settingsKey: RaritySettingsKey,
  ) {
    super(name);

    this.state = settings.get(settingsKey);
    this.settingsKey = settingsKey;
  }

  isRarityOption(): this is this {
    return true;
  }

  getValueFillStyle(): string {
    // The value is now displayed using the rarity's colour, and it still
    // flashes white over 1.5s when the player edits it.
    if (this.changeTime > 0 && time - this.changeTime < 1500) {
      const ratio = (time - this.changeTime) / 1500;
      return blendColor("#ffffff", Colors.rarities[this.state].color, ratio);
    } else {
      return Colors.rarities[this.state].color;
    }
  }

  getDisplayedValue(): string {
    // Display the name of the rarity
    return Colors.rarities[this.state].name;
  }

  onClick(): void {
    // Prompt the user for a new value, then check its validity
    const response = prompt(
      `You are editing the setting "${this.name}".\n\n` +
      `Please enter a Rarity.`
    ) ?? "";
    const rarity = rarityToIndex(response);
    if (!isNil(rarity)) {
      this.changeTime = performance.now();
      this.state = rarity;
      settings.set(this.settingsKey, rarity);
    } else {
      alert(
        `Error: "${response}" is not a valid rarity!`
      );
    }
  }
}

export class KeybindOption extends DisplayValueOption {
  state: string;
  settingsKey: KeybindSettingsKey;
  
  /**
   * Whether or not the player is currently editing this setting.
   */
  editingState: boolean;

  /**
   * A timeout for cancelling an edit for this setting.
   */
  editingStateTimeout?: number;

  constructor(
    name: string,
    settingsKey: KeybindSettingsKey,
  ) {
    super(name);

    this.state = settings.get(settingsKey);
    this.settingsKey = settingsKey;
    this.editingState = false;
  }

  getValueFillStyle(): string {
    // Display it as orange if it is currently being edited
    return this.editingState ? CINDER_COLOUR : super.getValueFillStyle();
  }

  getDisplayedValue(): string {
    return this.editingState ? "Editing..." : this.state;
  }

  onClick(): void {
    cinderSettingsMenu.setCurrentKeybindOption(this);
    this.editingState = true;
    // Automatically cancel the edit after 3 seconds
    this.editingStateTimeout = setTimeout(() => {
      cinderSettingsMenu.setCurrentKeybindOption(undefined);
    }, 3000);
  }

  /**
   * Ends this option's editing state, and sets the setting to the new keybind
   * if given.
   */
  finishEdit(newKeybind?: string): void {
    clearTimeout(this.editingStateTimeout);
    this.editingState = false;
    this.editingStateTimeout = undefined;

    if (!isNil(newKeybind)) {
      this.changeTime = performance.now();
      this.state = newKeybind;
      settings.set(this.settingsKey, newKeybind);
    }
  }
}

/**
 * A heading to label the next section in the settings menu.
 */
export class SettingsSectionHeading {
  text: string;

  constructor(text: string) {
    this.text = text;
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
  draw(menu: CinderSettingsMenu) {
    // Display the header text
    ctx.font = "900 17px Ubuntu";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.strokeText(
      this.text, menu.w / 2, menu.currentHeight + SETTINGS_OPTION_HEIGHT / 2,
    );
    ctx.fillText(
      this.text, menu.w / 2, menu.currentHeight + SETTINGS_OPTION_HEIGHT / 2,
    );
    
    // Display the separator line (with a space in between for the header text)
    const halfTextWidth = ctx.measureText(this.text).width / 2;
    ctx.strokeStyle = "#7f7f7f";
    ctx.lineWidth = 8;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(
      20,
      menu.currentHeight + SETTINGS_OPTION_HEIGHT / 2,
    );
    ctx.lineTo(
      menu.w / 2 - halfTextWidth - 20,
      menu.currentHeight + SETTINGS_OPTION_HEIGHT / 2,
    );
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(
      menu.w / 2 + halfTextWidth + 20,
      menu.currentHeight + SETTINGS_OPTION_HEIGHT / 2,
    );
    ctx.lineTo(
      menu.w - 20 - 16,
      menu.currentHeight + SETTINGS_OPTION_HEIGHT / 2,
    );
    ctx.stroke();
    ctx.closePath();

    menu.currentHeight += SETTINGS_OPTION_HEIGHT;
  }
}