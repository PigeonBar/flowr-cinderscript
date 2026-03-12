import { TOOLTIP_BLUE, TOOLTIP_TEXT_HEIGHT, TOOLTIP_WIDTH_CAP } from "../constants";

export type Tooltip = string | (() => string);

/**
 * A text box that displays tooltips for settings.
 * 
 * Some of this code is adapted from Flowr's base code for StatBoxes.
 * 
 * TODO: Implement caching if needed.
 */
export class TooltipBox {
  w: number;
  h: number;
  text: Tooltip;

  /**
   * The alpha-value (i.e., opacity) of the drawn tooltip box.
   */
  alpha: number;

  /**
   * The full text for this tooltip is split into an array of lines, and each
   * line is split further into an array of words/tokens.
   */
  lines: string[][];

  constructor(text: Tooltip) {
    this.w = 20;
    this.h = 20 - (TOOLTIP_TEXT_HEIGHT - 15);
    this.alpha = 0;
    this.lines = [];
    this.text = text;

    this.generateDesc();
  }

  /**
   * Draws this tooltip at the given location.
   * @param x The horizontal position for the *middle* of this tooltip box.
   * @param y The vertical position for the *top* of this tooltip box.
   * @param isHovered Whether or not the mouse is hovering over this setting's
   * tooltip icon.
   */
  draw(x: number, y: number, isHovered: boolean): void {
    if (!isHovered && this.alpha < 0.1) {
      return;
    }

    // Tooltip box will become more opaque if tooltip icon is hovered
    if (isHovered) {
      this.alpha += dt / 150;
      if (this.alpha > 1) {
        this.alpha = 1;
      }
    } else {
      this.alpha -= dt / 150;
      if (this.alpha < 0) {
        this.alpha = 0;
      }
    }

    ctx.save();

    ctx.globalAlpha = this.alpha;

    // Display a translucent blue rectangle to contain the text
    ctx.globalAlpha *= 0.8;
    ctx.fillStyle = TOOLTIP_BLUE;
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.rect(x - this.w / 2, y, this.w, this.h);
    ctx.fill();
    ctx.closePath();
    ctx.globalAlpha /= 0.8;

    // Display the text
    ctx.font = "900 15px Ubuntu";
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    let currentHeight = y + 10;
    for (let line of this.lines) {
      let currentX = x - this.w / 2 + 10;
      for (let token of line) {
        if (token[0] === "$") {
          // Special token for changing colour
          if (token[1] === "c") {
            ctx.fillStyle = token.substring(2).trim();
          }
        } else {
          ctx.strokeText(token, currentX, currentHeight);
          ctx.fillText(token, currentX, currentHeight);
          currentX += ctx.measureText(token).width;
        }
      }
      currentHeight += TOOLTIP_TEXT_HEIGHT;
    }

    ctx.restore();
  }

  /**
   * Regenerates this tooltip's entire description. Also updates this box's
   * dimensions based on the dimensions of the text.
   */
  generateDesc(): void {
    this.w = 20;
    this.h = 20 - (TOOLTIP_TEXT_HEIGHT - 15);
    this.alpha = 0;

    // Split the given text into lines, making sure that each line does not
    // become too long.
    ctx.save();
    ctx.font = "900 15px Ubuntu"; // Set font for measuring text width
    const text = (typeof this.text === "string") ? this.text : this.text();
    const splitText = text.split(" ").map(token => token + " ");
    this.lines = [];
    let currentLine = [];
    let currentWidth = 0;
    for (let i = 0; i < splitText.length; i++) {
      const newText = splitText[i];
      // Only non-special tokens (no $) will contribute to the width
      const newWidth = newText[0] === "$" ? 0 : ctx.measureText(newText).width;
      if (currentWidth + newWidth > TOOLTIP_WIDTH_CAP) {
        this.addLine(currentLine, currentWidth);
        currentLine = [];
        currentWidth = 0;
      }
      currentLine.push(newText);
      currentWidth += newWidth;
    }
    // Also add the final line before concluding
    this.addLine(currentLine, currentWidth);
    ctx.restore();
  }

  /**
   * Adds another line of text to this tooltip box. Also updates this box's
   * dimensions based on the dimensions of the text.
   */
  addLine(currentLine: string[], currentWidth: number): void {
    this.lines.push(currentLine);
    this.w = Math.max(this.w, currentWidth + 20);
    this.h += TOOLTIP_TEXT_HEIGHT;
  }
}