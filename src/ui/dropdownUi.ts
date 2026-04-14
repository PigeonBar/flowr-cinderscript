import { DROPDOWN_UI_PADDING, TOOLTIP_ICON_SIZE } from "../constants/constants";
import { Tooltip, TooltipIcon } from "../settings/tooltips";
import { isNil } from "../utils";

type DropdownOption = { text: string, colour: string };

type DropdownListener = (option: string) => void;

/**
 * A full dropdown UI, including its label text and its tooltip.
 */
export class DropdownUI {
  /**
   * The x-coordinate of the centre of the whole dropdown UI.
   */
  x: number;

  /**
   * The y-coordinate of the centre of the whole dropdown UI.
   */
  y: number;

  /**
   * The dropdown menu's choice is stored in local storage at this storage key.
   */
  localStorageKey: string;

  /**
   * The label for the dropdown menu, displayed to the left of the menu.
   */
  labelText: string;

  /**
   * The width of the {@linkcode labelText}.
   */
  labelWidth: number;

  /**
   * A tooltip icon, displayed to the right of the dropdown menu.
   */
  tooltipIcon: TooltipIcon;

  /**
   * The coordinates for the tooltip icon.
   */
  tooltipPos: { x: number, y: number };

  /**
   * The options that the user can select in this dropdown menu.
   */
  options: DropdownOption[];

  /**
   * The width used to display the dropdown itself, based on the widths of its
   * contents.
   */
  optionsWidth: number;

  /**
   * The height that each dropdown option will take up.
   */
  heightPerOption: number = 30;

  /**
   * The choice that the user has currently selected.
   */
  currentChoice: DropdownOption;

  /**
   * Whether or not the user has expanded the dropdown menu to display its list
   * of options.
   */
  expanded: boolean;

  /**
   * The vertical translation of the list of options, relative to its fully
   * expanded position. (This number is negative when the list of options is
   * retracted.)
   */
  optionsTranslateY: number;

  /**
   * A list of listeners to listen to the user selecting options in this
   * dropdown menu.
   */
  listeners: DropdownListener[];

  /**
   * The timestamp of the most recent time that the user clicked on an option.
   */
  optionSelectedTime: number;

  constructor(
    labelText: string,
    localStorageKey: string,
    x: number,
    y: number,
    options: DropdownOption[],
    tooltip: Tooltip,
  ) {
    this.labelText = labelText;
    this.localStorageKey = localStorageKey;
    this.x = x;
    this.y = y;
    this.tooltipIcon = new TooltipIcon(tooltip);
    this.tooltipPos = { x: 0, y: 0 };
    this.options = options;
    this.expanded = false;
    this.optionsTranslateY = -this.totalOptionsHeight;
    this.listeners = [];
    this.optionSelectedTime = time - 10000;

    // Retrieve the saved choice from local storage
    const localStorageChoice = localStorage.getItem(localStorageKey);
    if (isNil(localStorageChoice)) {
      // Default choice is the first choice in the options
      this.currentChoice = this.options[0];
      localStorage.setItem(
        this.localStorageKey, JSON.stringify(this.currentChoice)
      );
    } else {
      this.currentChoice = JSON.parse(localStorageChoice);
    }

    // Measure the width of the given options
    this.optionsWidth = 60;
    ctx.font = "900 17px Ubuntu";
    for (let { text } of this.options) {
      this.optionsWidth =
        Math.max(this.optionsWidth, ctx.measureText(text).width + 60);
    }

    // Measure the width of the label text
    this.labelWidth = ctx.measureText(labelText).width;
  }

  /**
   * The total width of the whole dropdown UI.
   */
  get width(): number {
    const originalFont = ctx.font;
    ctx.font = "900 17px Ubuntu";
    const ret = this.labelWidth
      + DROPDOWN_UI_PADDING + this.optionsWidth
      + DROPDOWN_UI_PADDING + TOOLTIP_ICON_SIZE;
    ctx.font = originalFont;
    return ret;
  }

  /**
   * The x-coordinate of the left side of the dropdown options.
   */
  get optionsX(): number {
    return this.x - this.width / 2 + this.labelWidth + DROPDOWN_UI_PADDING;
  }

  /**
   * The total height taken up by this menu's list of options, equal to
   * {@linkcode options options.length} times {@linkcode heightPerOption}.
   */
  get totalOptionsHeight(): number {
    return this.options.length * this.heightPerOption;
  }

  /**
   * This function sets {@linkcode currentChoice} to the given option, saves it
   * in local storage, and triggers all of the {@linkcode listeners}.
   */
  setOption(option: DropdownOption): void {
    this.currentChoice = option;
    localStorage.setItem(this.localStorageKey, JSON.stringify(option));
    for (let fn of this.listeners) {
      fn(option.text);
    }
  }

  /**
   * Toggles whether or not the dropdown menu is opened or closed.
   */
  toggleExpansion(): void {
    this.expanded = !this.expanded;
  }

  draw(): void {
    let currentX = this.x - this.width / 2;

    // Draw the label text
    ctx.font = "900 17px Ubuntu";
    ctx.lineWidth = 2;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.strokeStyle = "black";
    ctx.fillStyle = "white";
    ctx.strokeText(this.labelText, currentX, this.y);
    ctx.fillText(this.labelText, currentX, this.y);

    // Move on to list of options
    currentX += this.labelWidth + DROPDOWN_UI_PADDING;

    // Update the options' vertical translation depending on whether they are
    // being opened or closed
    if (this.expanded) {
      this.optionsTranslateY = interpolate(this.optionsTranslateY, 0, 0.3);
    } else {
      this.optionsTranslateY = interpolate(
        this.optionsTranslateY, -this.totalOptionsHeight, 0.3
      );
    }

    // Clip before drawing list of options, so only expanded options get drawn
    ctx.save();
    ctx.beginPath();
    ctx.rect(
      currentX - 10, 
      this.y + this.heightPerOption / 2 - 10,
      this.optionsWidth + 20,
      (this.options.length + 1) * this.heightPerOption,
    )
    ctx.clip();
    ctx.closePath();

    // Draw the menu's list of options
    const hoveredOption = this.hoveredOptionIndex();
    ctx.translate(0, this.optionsTranslateY);
    let currentY = this.y + this.heightPerOption;
    for (let i = 0; i < this.options.length; i++) {
      const { text, colour } = this.options[i];
      // Draw a rectangle to contain the option's text, highlighting it in gray
      // if it is being hovered.
      ctx.fillStyle = (i === hoveredOption) ? "#bfbfbf" : "white";
      ctx.beginPath();
      ctx.rect(
        currentX,
        currentY - this.heightPerOption / 2,
        this.optionsWidth,
        this.heightPerOption,
      );
      ctx.stroke();
      ctx.fill();
      ctx.closePath();

      // Draw the option's text
      ctx.fillStyle = colour;
      ctx.strokeText(text, currentX + 5, currentY);
      ctx.fillText(text, currentX + 5, currentY);

      currentY += this.heightPerOption;
    }

    // Move on to currently selected option
    ctx.restore();

    // Draw the menu's currently selected option
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.rect(
      currentX,
      this.y - this.heightPerOption / 2,
      this.optionsWidth,
      this.heightPerOption,
    );
    ctx.stroke();
    ctx.fill();
    ctx.closePath();

    // Draw the option's text
    ctx.fillStyle = this.currentChoice.colour;
    ctx.strokeText(this.currentChoice.text, currentX + 5, this.y);
    ctx.fillText(this.currentChoice.text, currentX + 5, this.y);

    // Draw the downward arrow
    ctx.beginPath();
    ctx.moveTo(currentX + this.optionsWidth - 5, this.y - 5);
    ctx.lineTo(currentX + this.optionsWidth - 15, this.y + 5);
    ctx.lineTo(currentX + this.optionsWidth - 25, this.y - 5);
    ctx.stroke();
    ctx.closePath();

    // If user is hovering over this dropdown menu, change cursor to "pointer"
    if (this.hoveringOverOpener() || hoveredOption > -1) {
      setCursor("pointer");
    }

    // Move on to tooltip icon
    currentX += this.optionsWidth + DROPDOWN_UI_PADDING;

    // Draw the tooltip icon and its text box
    this.tooltipPos = { x: currentX + TOOLTIP_ICON_SIZE / 2, y: this.y };
    this.tooltipIcon.drawIcon(this.tooltipPos);
    this.tooltipIcon.drawText(
      this.tooltipPos, { x: mouse.canvasX, y: mouse.canvasY }
    );
  }

  /**
   * Determines whether or not the user is hovering over the dropdown menu to
   * open/close it.
   */
  hoveringOverOpener(): boolean {
    return mouseInBox(
      { x: mouse.canvasX, y: mouse.canvasY },
      {
        x: this.optionsX,
        y: this.y - this.heightPerOption / 2,
        w: this.optionsWidth,
        h: this.heightPerOption,
      }
    );
  }

  /**
   * Returns the index of the option that the user is currently hovering over,
   * or -1 if the user is currently not hovering over any option.
   */
  hoveredOptionIndex(): number {
    // If the cursor is not below the dropdown opener, return -1.
    if (mouse.canvasY <= this.y + this.heightPerOption / 2) {
      return -1;
    }

    // If the cursor is outside the rectangle containing the full list of
    // options, return -1.
    if (!mouseInBox(
      { x: mouse.canvasX, y: mouse.canvasY },
      {
        x: this.optionsX,
        y: this.y + this.heightPerOption / 2 + this.optionsTranslateY,
        w: this.optionsWidth,
        h: this.totalOptionsHeight,
      }
    )) {
      return -1;
    }
    
    // Compute the index that the user is hovering over
    const relativeY = mouse.canvasY
      - (this.y + this.heightPerOption / 2 + this.optionsTranslateY);
    const index = Math.floor(relativeY / this.heightPerOption);
    
    // Apply bounds just in case
    return Math.max(Math.min(index, this.options.length - 1), 0);
  }

  /**
   * Processes a mouse click input.
   */
  mouseDown() {
    const hoveredOption = this.hoveredOptionIndex();
    if (this.hoveringOverOpener()) {
      this.toggleExpansion();
    } else if (hoveredOption > -1) {
      // Set this menu's current choice to the user's selected option, then
      // fully retract the dropdown menu.
      this.setOption(this.options[hoveredOption]);
      this.optionSelectedTime = time;
      this.expanded = false;
      this.optionsTranslateY = -this.totalOptionsHeight;
    } else if (this.expanded) {
      // If the menu is expanded but the user clicked somewhere else, retract
      // the menu.
      this.toggleExpansion();
    }
  }

  /**
   * Adds a listener to {@linkcode listeners}, which will allow it to listen to
   * all *future* choices made by the user.
   * @param fn The listener to be added.
   * @param applyCurrent Whether or not to also apply `fn` to the
   * {@linkcode currentChoice currently selected option}. Default: `true`.
   */
  addListener(fn: DropdownListener, applyCurrent: boolean = true) {
    this.listeners.push(fn);
    if (applyCurrent) {
      fn(this.currentChoice.text);
    }
  }

  /**
   * Returns `true` if and only if the user clicked on an option within the
   * past 250ms.
   */
  recentlySelectedOption(): boolean {
    return time - this.optionSelectedTime < 250;
  }
}