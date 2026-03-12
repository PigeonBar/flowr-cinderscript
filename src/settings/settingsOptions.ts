import { CINDER_COLOUR, EDIT_ICON_SIZE, KEYBIND_DELETED, SETTINGS_BUTTON_PADDING, SETTINGS_BUTTON_SIZE, SETTINGS_GREEN, SETTINGS_OPTION_HEIGHT, TOOLTIP_BLUE, TOOLTIP_BORDER_BLUE, TOOLTIP_ICON_SIZE } from "../constants";
import type { Rarity } from "../enums";
import { isNil, rarityToIndex } from "../utils";
import { settings, type BooleanSettingsKey, type KeybindSettingsKey, type NumberSettingsKey, type RaritySettingsKey } from "./settingsManager";
import { type CinderSettingsMenu } from "./settingsMenu";
import { TooltipBox, type Tooltip } from "./tooltipBox";

// icons/settings-edit.svg
const editIcon = new Image();
editIcon.src = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB3aWR0aD0iMTAwLjAwMDA1bW0iCiAgIGhlaWdodD0iMTAwLjAwMDA2bW0iCiAgIHZpZXdCb3g9IjAgMCAxMDAuMDAwMDUgMTAwLjAwMDA2IgogICB2ZXJzaW9uPSIxLjEiCiAgIGlkPSJzdmcxIgogICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxkZWZzCiAgICAgaWQ9ImRlZnMxIiAvPgogIDxnCiAgICAgaWQ9ImxheWVyMSIKICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtODkuNTI0OTc3LC0zNS42MzI2MDUpIj4KICAgIDxyZWN0CiAgICAgICBzdHlsZT0iZmlsbDojZmZmZmZmO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTojZmZmZmZmO3N0cm9rZS13aWR0aDowLjI4MjEzNztzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSIKICAgICAgIGlkPSJyZWN0MS04IgogICAgICAgd2lkdGg9IjMxLjEyMTQyOSIKICAgICAgIGhlaWdodD0iMTguNTYwMDA3IgogICAgICAgeD0iLTE3NC43NzIyMyIKICAgICAgIHk9Ijc0LjQxNzAyMyIKICAgICAgIHRyYW5zZm9ybT0ibWF0cml4KC0wLjcwNzEwMDA4LC0wLjcwNzExMzQ5LDAuNzA3MTAwMDgsLTAuNzA3MTEzNDksMCwwKSIgLz4KICAgIDxyZWN0CiAgICAgICBzdHlsZT0iZmlsbDojZmZmZmZmO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTojZmZmZmZmO3N0cm9rZS13aWR0aDowLjUxNDk0NTtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSIKICAgICAgIGlkPSJyZWN0MS04LTEiCiAgICAgICB3aWR0aD0iMzAuODg4NjI4IgogICAgICAgaGVpZ2h0PSI2Mi4yOTIxOTQiCiAgICAgICB4PSItMTc0LjY1NTg3IgogICAgICAgeT0iNS40NDUxNTA0IgogICAgICAgdHJhbnNmb3JtPSJtYXRyaXgoLTAuNzA3MTAwMDgsLTAuNzA3MTEzNDksMC43MDcxMDAwOCwtMC43MDcxMTM0OSwwLDApIiAvPgogICAgPHBhdGgKICAgICAgIHN0eWxlPSJmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOiNmZmZmZmY7c3Ryb2tlLXdpZHRoOjAuMDE7c3Ryb2tlLWxpbmVjYXA6c3F1YXJlO3N0cm9rZS1taXRlcmxpbWl0OjA7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjE7cGFpbnQtb3JkZXI6bWFya2VycyBzdHJva2UgZmlsbCIKICAgICAgIGlkPSJwYXRoNCIKICAgICAgIGQ9Im0gNzQuMzU4OTk5LDEzMy44ODE1OSAtMS4yNzY3NzUsMCAwLjYzODM4OCwtMS4xMDU3MiB6IgogICAgICAgdHJhbnNmb3JtPSJtYXRyaXgoLTE3LjI0NDI0MiwtMTcuMjQ0NTcsMTkuODY3Mjg2LC0xOS44Njc2NjMsLTEyNzYuOTkwOCw0MDQ0LjczNDgpIiAvPgogIDwvZz4KPC9zdmc+Cg==";

/**
 * A class for all options in the settings menu.
 */
export abstract class SettingsOption {
  name: string;
  state: any;
  changeTime: number;
  screenPosition: {x: number, y: number, w: number, h: number};
  _tooltipBox?: TooltipBox;

  /**
   * A legacy field that is used for the settings menu to handle
   * {@linkcode BooleanOption BooleanOptions}.
   */
  toggleFn: (state?: any) => void;

  constructor(name: string, tooltip?: Tooltip) {
    this.name = name;
    if (!isNil(tooltip)) {
      this._tooltipBox = new TooltipBox(tooltip);
    }
    this.changeTime = 0;
    this.screenPosition = {x: 0, y: 0, w: 0, h: 0};

    // Note: Each subclass will be responsible for taking care of these
    // settings states with proper typings.
    this.state = undefined;
    this.toggleFn = () => {};
  }

  get tooltipBox(): TooltipBox | undefined {
    // Tooltips only exist if the setting for displaying tooltips is turned on.
    return settings.get("settingsTooltips") ? this._tooltipBox : undefined;
  }

  /**
   * The position of the centre of the ? tooltip icon for this option.
   */
  get tooltipPos(): {x: number, y: number} {
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

  /**
   * Draws this option's tooltip icon and tooltip.
   */
  drawTooltip(): void {
    if (!isNil(this.tooltipBox)) {
      drawTooltipIcon(this.tooltipPos, this.tooltipBox);
    }
  }

  /**
   * Updates the text for this setting's tooltip.
   */
  updateTooltip(): void {
    this._tooltipBox?.generateDesc();
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
  draw(menu: CinderSettingsMenu) {
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
    // If this is a Rarity option, we display the name as light-gray to
    // visually distinguish it from the Transcendent rarity.
    ctx.fillStyle = this.isRarityOption() ? "#cfcfcf" : "white";
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

    menu.currentHeight += SETTINGS_OPTION_HEIGHT;
  }

  /**
   * Handles letting the player edit this setting when the player clicks the
   * edit button.
   */
  abstract onClick(menu: CinderSettingsMenu): void;
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

  isRarityOption(): this is this {
    return true;
  }

  getValueFillStyles(): string[] {
    // The value is now displayed using the rarity's colour, and it still
    // flashes white over 1.5s when the player edits it.
    return [this.getFlashColour(Colors.rarities[this.state].color)];
  }

  getDisplayedValues(): string[] {
    // Display the name of the rarity
    return [Colors.rarities[this.state].name];
  }

  onClick(): void {
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
    tooltip?: Tooltip,
  ) {
    super(name, tooltip);

    this.state = settings.get(settingsKey);
    this.settingsKey = settingsKey;
    this.editingState = false;
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
    // Gray out this setting if it is set to "<None>" (i.e., deleted by user).
    // Also display an "Editing..." status if this is being edited.
    const colour1 = this.getFlashColour(
      this.state === KEYBIND_DELETED ? "#afafaf" : SETTINGS_GREEN
    );
    if (this.editingState) {
      return [colour1, CINDER_COLOUR];
    } else {
      return [colour1];
    }
  }

  onClick(menu: CinderSettingsMenu): void {
    if (!this.editingState) {
      menu.setCurrentKeybindOption(this);
      this.editingState = true;
      // Automatically cancel the edit after 3 seconds
      this.editingStateTimeout = setTimeout(() => {
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
  tooltipPos: {x: number, y: number};
  _tooltipBox?: TooltipBox;

  constructor(text: string, tooltip?: Tooltip) {
    this.text = text;
    if (!isNil(tooltip)) {
      this._tooltipBox = new TooltipBox(tooltip);
    }
    this.tooltipPos = {x: 0, y: 0};
  }

  get tooltipBox(): TooltipBox | undefined {
    // Tooltips only exist if the setting for displaying tooltips is turned on.
    return settings.get("settingsTooltips") ? this._tooltipBox : undefined;
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
    // Determine the locations to draw each item
    ctx.font = "900 17px Ubuntu";
    const textWidth = ctx.measureText(this.text).width;
    let textLeftPos = menu.w / 2 - textWidth / 2;
    let textRightPos = menu.w / 2 + textWidth / 2;
    if (!isNil(this.tooltipBox)) {
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
   * Draws this option's tooltip icon and tooltip.
   */
  drawTooltip(): void {
    if (!isNil(this.tooltipBox)) {
      drawTooltipIcon(this.tooltipPos, this.tooltipBox);
    }
  }
}

/**
 * A helper function to draw a ? tooltip icon centred at the given coordinates,
 * and also draw the tooltip box if the mouse is hovering over the icon.
 */
function drawTooltipIcon(
  pos: {x: number, y: number},
  tooltipBox: TooltipBox
): void {
  // Draw the blue circle containing the ? symbol
  const {x, y} = pos;
  ctx.strokeStyle = TOOLTIP_BORDER_BLUE;
  ctx.fillStyle = TOOLTIP_BLUE;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(x, y, TOOLTIP_ICON_SIZE / 2, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();
  ctx.closePath();

  // Draw the ? symbol
  ctx.font = "900 17px Ubuntu";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.strokeText("?", x, y + 1);
  ctx.fillText("?", x, y + 1);
  
  // Check whether the mouse is hovering over this icon
  const isHovered = mouseInBox(
    {x: mouse.canvasX, y: mouse.canvasY},
    // We intentionally make the tooltip icon's "hitbox" larger
    {
      x: x - SETTINGS_BUTTON_SIZE / 2,
      y: y - SETTINGS_BUTTON_SIZE / 2,
      w: SETTINGS_BUTTON_SIZE,
      h: SETTINGS_BUTTON_SIZE,
    }
  );
  
  // Draw the tooltip box
  tooltipBox.draw(x, y + TOOLTIP_ICON_SIZE / 2 + 10, isHovered);
}