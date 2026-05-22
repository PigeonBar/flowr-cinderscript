import { LIGHT_SETTINGS_GRAY, SETTINGS_GRAY, SETTINGS_GRAY_BORDER, SETTINGS_GREEN } from "../constants/constants";
import type { CinderSettingsMenu } from "../settings/settingsMenu";
import { ctxDrawText, isHexCode, isNil } from "../utils";

/**
 * A readonly data structure for storing a single colour.
 */
class RGBColour {
  /**
   * A number from 0 to 255, representing the Red intensity of this colour.
   */
  readonly red: number;

  /**
   * A number from 0 to 255, representing the Green intensity of this colour.
   */
  readonly green: number;
  
  /**
   * A number from 0 to 255, representing the Blue intensity of this colour.
   */
  readonly blue: number;

  /**
   * A hex code representing this colour.
   * 
   * If this colour's intensities are decimal numbers, their rounded values are
   * used for computing this hex code.
   */
  readonly hexCode: string;

  constructor(hexCode: string);
  constructor(red: number, green: number, blue: number);
  constructor(arg1: number | string, arg2?: number, arg3?: number) {
    if (typeof arg1 === "number" && !isNil(arg2) && !isNil(arg3)) {
      this.red = arg1;
      this.green = arg2;
      this.blue = arg3;
    } else if (typeof arg1 === "string" && isHexCode(arg1)) {
      this.red = parseInt(arg1.slice(1, 3), 16);
      this.green = parseInt(arg1.slice(3, 5), 16);
      this.blue = parseInt(arg1.slice(5, 7), 16);
    } else {
      console.warn("Invalid colour constructor args!", arg1, arg2, arg3);
      this.red = this.green = this.blue = 0;
    }

    // Intensities also need to be clamped
    this.red = Math.max(Math.min(this.red, 255), 0);
    this.green = Math.max(Math.min(this.green, 255), 0);
    this.blue = Math.max(Math.min(this.blue, 255), 0);

    // Also compute the hex code here
    this.hexCode = "#" + this.componentToHex(this.red)
      + this.componentToHex(this.green)
      + this.componentToHex(this.blue);
  }

  /**
   * A helper function to convert an rgb intensity to a 2-character hex code.
   */
  componentToHex(intensity: number): string {
    const hex = Math.round(intensity).toString(16);
    return hex.length === 1 ? ("0" + hex) : hex;
  }

  /**
   * Computes the brightness of this colour, as a number between 0 and 1.
   */
  getBrightness(): number {
    return Math.max(this.red, this.green, this.blue) / 255;
  }

  /**
   * Computes the saturation of this colour, as a number between 0 and 1.
   */
  getSaturation(): number {
    const colour1 = this.fullBrightness();
    return 1 - Math.min(colour1.red, colour1.green, colour1.blue) / 255;
  }

  /**
   * Computes the hue of this colour on the colour wheel, as a number between
   * 0 and 360.
   */
  getHue(): number {
    const colour2 = this.fullBrightnessAndSaturation();

    // Max colour should be 255, and min colour should be 0, but we check the
    // actual min colour and max colour anyway just to be safe.
    const minColour = Math.min(colour2.red, colour2.green, colour2.blue);
    const maxColour = Math.max(colour2.red, colour2.green, colour2.blue);

    if (colour2.blue === minColour) {
      if (colour2.red === maxColour) {
        // Red transitioning to yellow
        return colour2.green * 60 / 255;
      } else {
        // Yellow transitioning to green
        return 120 - colour2.red * 60 / 255;
      }
    } else if (colour2.red === minColour) {
      if (colour2.green === maxColour) {
        // Green transitioning to cyan
        return 120 + colour2.blue * 60 / 255;
      } else {
        // Cyan transitioning to blue
        return 240 - colour2.green * 60 / 255;
      }
    } else {
      if (colour2.blue === maxColour) {
        // Blue transitioning to purple
        return 240 + colour2.red * 60 / 255;
      } else {
        // Purple transitioning to red
        return 360 - colour2.blue * 60 / 255;
      }
    }
  }

  /**
   * Returns a copy of this colour with brightness set to full.
   */
  fullBrightness(): RGBColour {
    const brightness = this.getBrightness();
    if (brightness <= 0) {
      return new RGBColour(255, 255, 255);
    } else {
      // Scale all three intensities to make the max intensity 255
      const ratio = 1 / brightness;
      return new RGBColour(
        this.red * ratio, this.green * ratio, this.blue * ratio,
      );
    }
  }

  /**
   * Returns a copy of this colour with brightness set to full, and then
   * saturation set to full.
   */
  fullBrightnessAndSaturation(): RGBColour {
    const colour1 = this.fullBrightness();
    const saturation = this.getSaturation();

    if (saturation <= 0) {
      return new RGBColour(255, 0, 0);
    } else {
      // Scale all three (255 - intensity) to make the min intensity 0
      const ratio = 1 / saturation;
      const fn = (intensity: number): number => {
        return 255 - ratio * (255 - intensity);
      }
      return new RGBColour(fn(colour1.red), fn(colour1.green), fn(colour1.blue));
    }
  }
}

/**
 * A UI for selecting colours. Currently, this only supports fully opaque
 * colours (alpha = 1).
 */
export class ColourSelectorUi {
  /**
   * The x-coordinate of this UI on the main canvas.
   */
  x: number;

  /**
   * The y-coordinate of this UI on the main canvas.
   */
  y: number;

  /**
   * The width of this UI on the main canvas.
   */
  w: number;

  /**
   * The height of this UI on the main canvas.
   */
  h: number;

  /**
   * Whether or not the user has opened this UI.
   */
  active: boolean;

  /**
   * The previous colour stored by this UI before the user started editing.
   */
  previousColour: RGBColour;

  /**
   * The base game's default colour for the setting that is being edited.
   */
  defaultColour: RGBColour;

  /**
   * The hue of the currently edited colour.
   */
  hue: number;

  /**
   * The saturation of the currently edited colour.
   */
  saturation: number;

  /**
   * The brightness of the currently edited colour.
   */
  brightness: number;

  /**
   * The position of the main gradient rectangle relative to this UI.
   */
  gradientRect: { x: number, y: number, w: number, h: number };

  /**
   * The position of the colour wheel picker relative to this UI.
   */
  colourWheel: { x: number, y: number, w: number, h: number };

  /**
   * The position of the "Save Selection" button relative to this UI.
   */
  saveButton: { x: number, y: number, w: number, h: number };

  /**
   * The position of the "Import Hex Code" button relative to this UI.
   */
  importButton: { x: number, y: number, w: number, h: number };

  /**
   * The position of the "Close" button relative to this UI.
   */
  closeButton: { x: number, y: number, w: number, h: number };

  /**
   * The parent {@linkcode CinderSettingsMenu} that this UI belongs to.
   */
  parentMenu: CinderSettingsMenu;

  /**
   * Whether or not the user is currently dragging the main gradient rectangle
   * picker (saturation + brightness).
   */
  draggingMainGradient: boolean;

  /**
   * Whether or not the user is currently dragging the colour wheel picker.
   */
  draggingColourWheel: boolean;

  constructor(parentMenu: CinderSettingsMenu) {
    this.active = false;
    this.previousColour = new RGBColour("#ffffff");
    this.defaultColour = new RGBColour("#ffffff");
    this.hue = this.previousColour.getHue();
    this.saturation = this.previousColour.getSaturation();
    this.brightness = this.previousColour.getBrightness();
    this.parentMenu = parentMenu;
    this.draggingColourWheel = false;
    this.draggingMainGradient = false;

    this.w = 770;
    this.h = 350;
    this.x = this.parentMenu.x + this.parentMenu.w + 20;
    this.y = -this.h - 20;

    this.gradientRect = { x: 20, y: 50, w: 400, h: 280 };

    this.colourWheel = {
      x: this.gradientRect.x + this.gradientRect.w + 40,
      y: this.gradientRect.y,
      w: 40,
      h: this.gradientRect.h,
    };

    this.saveButton = {
      x: this.colourWheel.x + this.colourWheel.w + 40,
      y: this.colourWheel.y,
      w: 160,
      h: 40,
    };

    this.importButton = {
      x: this.saveButton.x,
      y: this.saveButton.y + 50,
      w: 160,
      h: 40,
    };

    this.closeButton = {
      x: this.w - 7.5 - 30 - 3,
      y: 7.5 + 3,
      w: 30,
      h: 30, 
    };
  }

  /**
   * Sets this UI to be editing a new colour for a new item/setting (i.e., any
   * time that {@linkcode previousColour} should also be overwritten).
   */
  setColour(colour: string | RGBColour): void {
    if (typeof colour === "string") {
      this.previousColour = new RGBColour(colour);
    } else {
      this.previousColour = colour;
    }
    this.hue = this.previousColour.getHue();
    this.saturation = this.previousColour.getSaturation();
    this.brightness = this.previousColour.getBrightness();
  }

  /**
   * Sets this UI's {@linkcode defaultColour} for a new setting.
   */
  setDefaultColour(colour: string): void {
    this.defaultColour = new RGBColour(colour);
  }

  /**
   * Computes the colour corresponding to the currently selected hue (with full
   * saturation and brightness).
   */
  getColourForCurrentHue(): RGBColour {
    let red = 0;
    let green = 0;
    let blue = 0;

    // First, compute full colour based on hue
    if (this.hue < 60) {
      // Red transitioning to yellow
      red = 255;
      green = 255 * this.hue / 60;
    } else if (this.hue < 120) {
      // Yellow transitioning to green
      green = 255;
      red = 255 * (120 - this.hue) / 60;
    } else if (this.hue < 180) {
      // Green transitioning to cyan
      green = 255;
      blue = 255 * (this.hue - 120) / 60;
    } else if (this.hue < 240) {
      // Cyan transitioning to blue
      blue = 255;
      green = 255 * (240 - this.hue) / 60;
    } else if (this.hue < 300) {
      // Blue transitioning to purple
      blue = 255;
      red = 255 * (this.hue - 240) / 60;
    } else {
      // Purple transitioning to red
      red = 255;
      blue = 255 * (360 - this.hue) / 60;
    }

    return new RGBColour(red, green, blue);
  }

  /**
   * Computes the currently selected colour.
   */
  getCurrentColour(): RGBColour {
    // First, apply hue
    const colour1 = this.getColourForCurrentHue();
    let red = colour1.red;
    let green = colour1.green;
    let blue = colour1.blue;

    // Next, apply saturation
    red = 255 - this.saturation * (255 - red);
    green = 255 - this.saturation * (255 - green);
    blue = 255 - this.saturation * (255 - blue);

    // Finally, apply brightness
    red = this.brightness * red;
    green = this.brightness * green;
    blue = this.brightness * blue;

    return new RGBColour(red, green, blue);
  }

  /**
   * The main function to draw this UI.
   */
  draw(): void {
    // Recalculate x since the settings menu moves to the right during runs
    this.x = this.parentMenu.x + this.parentMenu.w + 20;

    // Set this menu to gradually become fully displayed / fully hidden based on
    // whether it is currently open/closed.
    const targetY = this.active ? 20 : (-this.h - 20);
    this.y = interpolate(this.y, targetY, 0.3);

    // Handle dragging before drawing anything
    this.handleDragging();

    ctx.save();
    ctx.translate(this.x, this.y);

    // Draw the menu
    ctx.strokeStyle = SETTINGS_GRAY_BORDER;
    ctx.fillStyle = SETTINGS_GRAY;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.roundRect(0, 0, this.w, this.h, 3);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    // Draw the title
    ctx.font = "900 32px Ubuntu";
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3.75;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctxDrawText("Colour Selector", this.w / 2, 10);

    // Draw the rectangular gradient by mixing the two gradients
    const grad1 = ctx.createLinearGradient(
      this.gradientRect.x, 0, this.gradientRect.x + this.gradientRect.w, 0,
    );
    grad1.addColorStop(0, "#ffffff");
    grad1.addColorStop(1, this.getColourForCurrentHue().hexCode);
    ctx.fillStyle = grad1;
    ctx.fillRect(
      this.gradientRect.x,
      this.gradientRect.y,
      this.gradientRect.w,
      this.gradientRect.h,
    );

    const grad2 = ctx.createLinearGradient(
      0, this.gradientRect.y, 0, this.gradientRect.y + this.gradientRect.h,
    );
    grad2.addColorStop(0, "#00000000");
    grad2.addColorStop(1, "#000000");
    ctx.fillStyle = grad2;
    ctx.fillRect(
      this.gradientRect.x,
      this.gradientRect.y,
      this.gradientRect.w,
      this.gradientRect.h,
    );

    // Draw the picked saturation + brightness location (a hollow ring with a
    // black outer border and a white inner border)
    const pickedX =
      this.gradientRect.x + this.saturation * this.gradientRect.w;
    const pickedY =
      this.gradientRect.y + (1 - this.brightness) * this.gradientRect.h;
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(pickedX, pickedY, 11, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(pickedX, pickedY, 9, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();

    // Draw the hue picker (colour wheel)
    const grad3 = ctx.createLinearGradient(
      0, this.colourWheel.y, 0, this.colourWheel.y + this.colourWheel.h,
    );
    grad3.addColorStop(0, "#ff0000");
    grad3.addColorStop(1 / 6, "#ffff00");
    grad3.addColorStop(1 / 3, "#00ff00");
    grad3.addColorStop(1 / 2, "#00ffff");
    grad3.addColorStop(2 / 3, "#0000ff");
    grad3.addColorStop(5 / 6, "#ff00ff");
    grad3.addColorStop(1, "#ff0000");
    ctx.fillStyle = grad3;
    ctx.fillRect(
      this.colourWheel.x,
      this.colourWheel.y,
      this.colourWheel.w,
      this.colourWheel.h,
    );

    // Draw the picked hue location
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.rect(
      this.colourWheel.x - 8,
      this.colourWheel.y + this.hue * this.colourWheel.h / 360 - 4,
      this.colourWheel.w + 16,
      8,
    );
    ctx.stroke();
    ctx.closePath();

    let currentX = this.saveButton.x;
    let currentY = this.colourWheel.y + this.colourWheel.h - 10;

    // Draw the label for the default colour
    ctx.font = "900 17px Ubuntu";
    ctx.lineWidth = 2;
    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctxDrawText("Default: ", currentX, currentY);

    currentX += ctx.measureText("Default: ").width;
    ctx.fillStyle = SETTINGS_GREEN;
    ctxDrawText(this.defaultColour.hexCode, currentX, currentY);

    // Draw the default colour
    currentX = this.colourWheel.x + 250;
    ctx.fillStyle = this.defaultColour.hexCode;
    ctx.fillRect(currentX, currentY - 28.5, 40, 40);

    // Draw the label for the new colour
    currentX = this.saveButton.x;
    currentY -= 40;
    ctx.fillStyle = "white";
    ctxDrawText("New: ", currentX, currentY);

    currentX += ctx.measureText("New: ").width;
    ctx.fillStyle = SETTINGS_GREEN;
    ctxDrawText(this.getCurrentColour().hexCode, currentX, currentY);

    // Draw the new colour
    currentX = this.colourWheel.x + 250;
    ctx.fillStyle = this.getCurrentColour().hexCode;
    ctx.fillRect(currentX, currentY - 28.5, 40, 40);

    // Draw the label for the original colour
    currentX = this.saveButton.x;
    currentY -= 40;
    ctx.fillStyle = "white";
    ctxDrawText("Previous: ", currentX, currentY);

    currentX += ctx.measureText("Previous: ").width;
    ctx.fillStyle = SETTINGS_GREEN;
    ctxDrawText(this.previousColour.hexCode, currentX, currentY);

    // Draw the original colour
    currentX = this.colourWheel.x + 250;
    ctx.fillStyle = this.previousColour.hexCode,
    ctx.fillRect(currentX, currentY - 28.5, 40, 40);

    // Draw a border around the displayed colours
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctx.strokeRect(currentX - 1, currentY - 29.5, 42, 122);

    // Draw the "Save Selection" button
    ctx.fillStyle = SETTINGS_GRAY;
    ctx.strokeStyle = SETTINGS_GRAY_BORDER;
    ctx.lineWidth = 4.5;
    if (this.hoveringOverElement(this.saveButton)) {
      ctx.fillStyle = LIGHT_SETTINGS_GRAY;
      setCursor("pointer");
    }
    ctx.beginPath();
    ctx.roundRect(
      this.saveButton.x,
      this.saveButton.y,
      this.saveButton.w,
      this.saveButton.h,
      3,
    );
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctxDrawText(
      "Save Selection",
      this.saveButton.x + this.saveButton.w / 2,
      this.saveButton.y + this.saveButton.h / 2,
    );

    // Draw the "Import Hex Code" button
    ctx.fillStyle = SETTINGS_GRAY;
    ctx.strokeStyle = SETTINGS_GRAY_BORDER;
    ctx.lineWidth = 4.5;
    if (this.hoveringOverElement(this.importButton)) {
      ctx.fillStyle = LIGHT_SETTINGS_GRAY;
      setCursor("pointer");
    }
    ctx.beginPath();
    ctx.roundRect(
      this.importButton.x,
      this.importButton.y,
      this.importButton.w,
      this.importButton.h,
      3,
    );
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctxDrawText(
      "Import Hex Code",
      this.importButton.x + this.importButton.w / 2,
      this.importButton.y + this.importButton.h / 2,
    );

    // Draw the "Close" button (this is basically copied from Flowr's base code
    // to maintain a consistent style)
    ctx.fillStyle = "#c1565e";
    ctx.strokeStyle = "#90464b";
    ctx.lineWidth = 5;
    if (this.hoveringOverElement(this.closeButton)) {
      ctx.fillStyle = "#c16666";
      setCursor("pointer");
    }
    ctx.beginPath();
    ctx.roundRect(
      this.closeButton.x,
      this.closeButton.y,
      this.closeButton.w,
      this.closeButton.h,
      6,
    );
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    ctx.lineWidth = 4.75;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#cccccc";
    ctx.beginPath();
    ctx.moveTo(
      this.closeButton.x + 7.5,
      this.closeButton.y + 7.5,
    );
    ctx.lineTo(
      this.closeButton.x + this.closeButton.w - 7.5,
      this.closeButton.y + this.closeButton.h - 7.5,
    );
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.moveTo(
      this.closeButton.x + this.closeButton.w - 7.5,
      this.closeButton.y + 7.5,
    );
    ctx.lineTo(
      this.closeButton.x + 7.5,
      this.closeButton.y + this.closeButton.h - 7.5,
    );
    ctx.stroke();
    ctx.closePath();

    ctx.restore();
  }

  /**
   * Handles editing the picked colour based on the user's mouse position when
   * the user is dragging the main gradient picker or the colour wheel picker.
   */
  handleDragging(): void {
    if (this.draggingMainGradient) {
      this.saturation = (mouse.canvasX - this.gradientRect.x - this.x)
        / this.gradientRect.w;
      this.brightness = 1 - (mouse.canvasY - this.gradientRect.y - this.y)
        / this.gradientRect.h;
    } else if (this.draggingColourWheel) {
      this.hue = 360 * (mouse.canvasY - this.colourWheel.y - this.y)
        / this.colourWheel.h;
    }

    // Also handle clamping here
    this.saturation = Math.max(Math.min(this.saturation, 1), 0);
    this.brightness = Math.max(Math.min(this.brightness, 1), 0);
    this.hue = Math.max(Math.min(this.hue, 360), 0);
  }

  /**
   * Checks whether the mouse is inside this menu.
   */
  mouseInMenu(): boolean {
    return mouseInBox(
      { x: mouse.canvasX, y: mouse.canvasY },
      { x: this.x, y: this.y, w: this.w, h: this.h },
    );
  }

  /**
   * Handles the user clicking on the UI.
   */
  mouseDown(): void {
    if (this.hoveringOverElement(this.gradientRect)) {
      this.draggingMainGradient = true;
    } else if (this.hoveringOverElement(this.colourWheel)) {
      this.draggingColourWheel = true;
    } else if (this.hoveringOverElement(this.saveButton)) {
      this.previousColour = this.getCurrentColour();
      this.parentMenu.saveColour(this.getCurrentColour().hexCode);
    } else if (this.hoveringOverElement(this.importButton)) {
      let colour = prompt("Please input a hex code:") ?? "";

      // Append # in case someone wants to type the hex code without #
      if (colour.charAt(0) !== "#") {
        colour = "#" + colour;
      }

      if (isHexCode(colour)) {
        this.setColour(colour);
        this.parentMenu.saveColour(colour);
      } else {
        alert(`Error: "${colour}" is not a valid hex code!`)
      }
    } else if (this.hoveringOverElement(this.closeButton)) {
      this.parentMenu.cancelColourOption();
      this.active = false;
    }
  }

  /**
   * Handles the user releasing a mouse click.
   */
  mouseUp(): void {
    this.draggingColourWheel = false;
    this.draggingMainGradient = false;
  }

  /**
   * A helper function to determine whether the mouse is hovering over one of
   * this UI's elements.
   */
  hoveringOverElement(
    element: { x: number, y: number, w: number, h: number }
  ): boolean {
    return mouseInBox(
      { x: mouse.canvasX, y: mouse.canvasY },
      {
        x: this.x + element.x,
        y: this.y + element.y,
        w: element.w,
        h: element.h,
      },
    );
  }

  /**
   * If there are unsaved changes, prompt the user on whether or not they would
   * like to save the unsaved changes.
   */
  saveBeforeClosingPrompt(): void {
    if (this.getCurrentColour().hexCode !== this.previousColour.hexCode) {
      if (confirm(
        "The colour selector has unsaved changes! Save before closing?"
      )) {
        this.previousColour = this.getCurrentColour();
        this.parentMenu.saveColour(this.getCurrentColour().hexCode);
      }
    }
  }
}
