import { unsafeWindow } from "$";

const cinderChangelogList: ChangelogEntry[] = [
  {text: `Cinderscript's official release! Here are its initial features:
- The crafting menu now has a petal search bar (PR #18)
- Invert Attack/Defend hotkeys (Default: Comma/Period) (PR #10)
- Hotkey to display stats box of the highest-rarity mob alive in your room (Default: "G") (PR #9)
- Fix a client freeze bug from displaying mobs with negative size (PR #8)
- The player's HP bar and high-rarity petal drops are now rendered larger (PR #7)
- When entering a new game, the game is now zoomed out by default (PR #5)
- Enemy missiles will no longer be hidden below enemy mobs (PR #4)
- Players can generate a random squad code by entering an empty private code (PR #3)
- The crafting menu now has a petal craft preview (PR #1)
- These features are configurable in the settings menu!`,
  date: "Version 1.0.0"},
];

/**
 * A class for this script's changelog.
 */
export class CinderChangelog extends Changelog {
  /**
   * Whether or not this changelog has generated its entries.
   */
  generatedEntries: boolean;

  constructor() {
    super();

    this.generatedEntries = false;

    const originalOnMouseDown = unsafeWindow.onmousedown;
    unsafeWindow.onmousedown = (e: MouseEvent) => {
      originalOnMouseDown?.apply(unsafeWindow, [e]);

      if (unsafeWindow.connected === true && this.active) {
        this.mouseDown({mouseX: mouse.canvasX, mouseY: mouse.canvasY});
      }
    }
    const originalOnMouseUp = unsafeWindow.onmouseup;
    unsafeWindow.onmouseup = (e: MouseEvent) => {
      originalOnMouseUp?.apply(unsafeWindow, [e]);

      if (unsafeWindow.connected === true) {
        this.mouseUp({mouseX: mouse.canvasX, mouseY: mouse.canvasY});
      }
    }
    const originalHandleMouse = inputHandler.handleMouse;
    inputHandler.handleMouse = (e: MouseEvent) => {
      originalHandleMouse.apply(inputHandler, [e]);

      this.mouseMove({mouseX: mouse.canvasX, mouseY: mouse.canvasY});
    }
    document.addEventListener("wheel", (e: WheelEvent) => {
      this.updateScroll(
        {x: e.deltaX, y: e.deltaY},
        {mouseX: mouse.canvasX, mouseY: mouse.canvasY},
      );
    });

    // Allow this changelog to be drawn
    const originalDraw = changelog.draw;
    changelog.draw = () => {
      originalDraw.apply(changelog);
      this.draw();
    }
  }

  toggle() {
    super.toggle();

    if (!this.active) {
      this.mouseUp({mouseX: mouse.canvasX, mouseY: mouse.canvasY});
    }
  }

  draw() {
    super.draw();

    // Cover the changelog's previous title
    ctx.translate(this.x, this.y + this.offset);
    ctx.fillStyle = "#9bb56b";
    ctx.beginPath();
    ctx.roundRect(5, 5, this.w - 50, 75);
    ctx.fill();
    ctx.closePath();

    // Redraw the title so that it says "Cinderscript Changelog"
    ctx.font = "900 30px Ubuntu";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;
    ctx.strokeText("Cinderscript Changelog", this.w / 2, 40);
    ctx.fillText("Cinderscript Changelog", this.w / 2, 40);
    ctx.translate(-this.x, -this.y - this.offset);
  }

  mouseDown(e: CanvasMouseData2) {
    super.mouseDown(e);

    if (this.hoveringOverX) {
      this.toggle();
    }
  }

  /**
   * Generates this changelog's entries if they are not already generated.
   * 
   * To try to maximize modularity/compatibility, we reuse the superclass's
   * `generateEntries` function. That function is hardcoded to retrieve entries
   * from {@linkcode changeloglist}, so we need to temporarily overwrite
   * `changeloglist`. This is a bit inefficient, but fortunately, we only need
   * to do this once per page load.
   */
  generateEntries(): void {
    if (this.generatedEntries) {
      return;
    }
    this.generatedEntries = true;

    // Overwrite changeloglist
    const vanillaChangelogList = [...changeloglist];
    changeloglist.splice(0, changeloglist.length);
    changeloglist.push(...cinderChangelogList);

    super.generateEntries();

    // Restore changeloglist
    changeloglist.splice(0, changeloglist.length);
    changeloglist.push(...vanillaChangelogList);
  }
}

export const cinderChangelog = new CinderChangelog();