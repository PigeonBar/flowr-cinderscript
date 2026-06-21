import { unsafeWindow } from "$";
import { SCROLLBAR_LENGTH, SETTINGS_GRAY, SETTINGS_GRAY_BORDER, SETTINGS_OPTION_HEIGHT, SETTINGS_SCROLLBAR_MIN_POS } from "../constants/constants";
import { isNil } from "../utils";
import { settings } from "./settingsManager";
import type { SettingsOption, SettingsSectionHeading } from "./settingsOptions";

/**
 * A scrollable menu that can hold {@linkcode SettingsOption} objects.
 * 
 * The scrollbar is somewhat adapted from Flowr's base code for its changelog.
 */
export abstract class AbstractSettingsMenu extends SettingsMenu {
  /**
   * The timestamp for the most recent time that the player used a mouse wheel
   * input to scroll this menu.
   */
  lastMouseWheelTime: number;

  /**
   * How much the menu's contents are currently shifted due to scrolling.
   */
  scroll: number;

  /**
   * The vertical offset of the mouse from the scrollbar's centre if the user
   * is currently dragging the scrollbar, or `undefined` if the user is not
   * dragging the scrollbar.
   */
  draggingScrollbarOffset?: number;

  constructor() {
    super();

    this.lastMouseWheelTime = time - 10000;
    this.scroll = 0;
    this.draggingScrollbarOffset = undefined;

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
    const originalRenderMenu = renderMenu;
    renderMenu = (dt: number) => {
      originalRenderMenu(dt);
      this.draw();
    }
    const originalRenderGame = renderGame;
    renderGame = (dt: number) => {
      originalRenderGame(dt);

      // Check that the game isn't in the "reconnecting" state
      if (unsafeWindow.state === "game"
        && !settings.get("hideSettingsDuringRuns")
      ) {
        this.draw();
      }
    }

    // Allow this menu to respond to scrolling inputs
    document.addEventListener("wheel", (e: WheelEvent) => {
      this.mouseScroll(e);
    });
  }

  /**
   * The total height of this menu's contents, equal to
   * {@linkcode SETTINGS_OPTION_HEIGHT} times `this.options.length`.
   */
  get totalHeight(): number {
    return SETTINGS_OPTION_HEIGHT * this.options.length;
  }

  /**
   * The y-position at the midpoint of the option currently being rendered.
   */
  get midHeight(): number {
    return this.currentHeight + SETTINGS_OPTION_HEIGHT / 2;
  }

  /**
   * The ratio of scrollbar movement to actual content movement.
   */
  get scrollbarRatio(): number {
    if (this.totalHeight + 10 - this.h === 0) {
      // Failsafe: Prevent division by zero
      return 1e99;
    }
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

  /**
   * The main function to draw this settings menu.
   */
  draw(): void {
    this.offset = interpolate(this.offset, this.targetOffset, 0.3);

    if (!isNil(this.draggingScrollbarOffset)) {
      this.scrollbarPos = mouse.canvasY - this.draggingScrollbarOffset;
    }

    // Enforce scrollbar bounds here
    this.scroll =
      Math.max(Math.min(this.scroll, this.totalHeight + 10 - this.h), 0);
    
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

    // Draw the scrollbar. Note that we deactivate the scrollbar if the total
    // height of the options is less than the menu's allocated height.
    if (this.scrollbarRatio > 0) {
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
    ctx.letterSpacing = "0px";
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
  }

  /**
   * Renders the given {@linkcode SettingsOption}. Each type of option is
   * rendered differently.
   */
  renderOption(option: SettingsOption | SettingsSectionHeading): void {
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
  mouseDown(e: CanvasMouseData): void {
    // Prevent clicking on off-screen options
    if (!this.mouseInMenu()) {
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

    // Process clicking the scrollbar
    if (this.mouseOnScrollbar()) {
      this.draggingScrollbarOffset =
        mouse.canvasY - (this.renderY + this.scrollbarPos);
    }

    e.y += this.scroll; // Apply scroll translation

    // We must create a *copy* of `this.options` here, otherwise this loop can
    // get screwed up by the hotkeys editor being able to add new options.
    for (let option of [...this.options]) {
      if (!option.isSectionHeading()) {
        if (option.mouseInButton(e)) {
          if (option.isBooleanOption()) {
            this.processToggle(option, e);
          } else if (option.isDisplayValueOption()) {
            option.onClick(this, e);
          }
        }
      }
    }
  }

  /**
   * Processes the user releasing a mouse click.
   */
  mouseUp(): void {
    this.draggingScrollbarOffset = undefined;
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

    // When toggling this menu off, also cancel dragging the scrollbar.
    if (!this.active) {
      this.mouseUp();
    }
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
   * Checks whether the mouse is inside this menu, excluding its borders.
   */
  mouseInMenu(): boolean {
    return this.mouseInPrimaryMenu();
  }

  /**
   * Checks whether the mouse is hovering over this menu's scrollbar.
   * 
   * Note that we deactivate the scrollbar and return `false` if the total
   * height of the options is less than the menu's allocated height.
   */
  mouseOnScrollbar(): boolean {
    if (this.scrollbarRatio <= 0) {
      return false;
    }

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
}