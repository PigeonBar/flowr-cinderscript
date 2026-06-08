import { unsafeWindow } from "$";

const cinderChangelogList: ChangelogEntry[] = [
  {text: `- Overhauled the petal lock system, please see the tooltip in the settings menu for more details (PR #38)
- Attempted fix for inverted attack/defend breaking if you die and then revive (PR #38)
- Added more tooltips to clarify minimap settings (PR #38)
- Added a "Welcome" message directing new users to the settings menu (PR #38)
- Default special drops threshold increased (1 Eth -> 1 Gala) (PR #38)`,
  date: "Version 1.8.1"},
  {text: `- Added a toggleable minimap (default keybind: [M]) (PR #37)`,
  date: "Version 1.8.0 (Minimap Update)"},
  {text: `- Added settings to customize biome background colours (PR #36)`,
  date: "Version 1.7.0 (Customizable Background Update)"},
  {text: `- [*] With this update, this script should now generally be ready for use by Flowrscript users!
- [*] Fixed inventory menu not being expandable (PR #35)
- [*] Fixed stat boxes being rendered far away from the cursor (PR #35)
- [*] Fixed crafting search bar extending to edge of screen (PR #35)
- [*] The build saver is no longer clickable behind other menus (PR #35)
- [*] Fixed some petal render optimizations not activating (PR #35)
- Rarity settings now also use rarity index numbers (PR #35)
- Changed inventory menu's padding to Flowrscript's more familiar layout (PR #35)`,
  date: "Version 1.6.0 (Flowrscript Compatibility Update)"},
  {text: `- The settings menu is accessible again outside the main menu, reverted from previous update (PR #34)
- [*] Fixed enemy missiles sometimes failing to display (PR #34)
- [*] Fixed this script's petal locks not working at all (PR #34)
- Made this changelog a bit wider (PR #34)
- Default special drops threshold increased (1 Trans -> 1 Eth) (PR #34)`,
  date: "Version 1.5.3"},
  {text: `- [*] Fixed some issues involving physical overlap with Flowrscript's menus (PR #33)
- Fixed the settings menu being active outside the main menu (PR #33)
- This script now waits longer for Flowrscript to load its skins (200ms -> 1000ms) (PR #33)`,
  date: "Version 1.5.2"},
  {text: `- [*] Attempted fix for the settings menu not working at all (PR #32)`,
  date: "Version 1.5.1"},
  {text: `- The mob gallery now has more types of mob counters, such as a spawn counter! (PR #31)
- Tooltip text boxes are now fully opaque (PR #31)`,
  date: "Version 1.5.0 (More Mob Counters)"},
  {text: `- Fixed an issue where some stats boxes were not wide enough to fit the kill counter (PR #30)`,
  date: "Version 1.4.2"},
  {text: `- Fixed a rendering crash when hovering over an EnemyBox in-game (PR #29)`,
  date: "Version 1.4.1"},
  {text: `- The mob gallery now tracks how many times you have killed each kind of mob (PR #27)
- It is also tracking mob spawns, but cannot display those until an upcoming UI update (PR #27)
- To reduce lag, the game no longer tries to render off-screen mob gallery entries (PR #27)`,
  date: "Version 1.4.0 (Mob Kill Counter)"},
  {text: `- Fixed a bug where the UI breaks if you click on an equipped petal without a petal below (PR #26)`,
  date: "Version 1.3.1"},
  {text: `- You can lock petal slots (default keybind: [L]) (PR #25)
- Major behind-the-scenes changes for keybind handling, hope it doesn't break anything (PR #25)`,
  date: "Version 1.3.0 (Petal Lock Update)"},
  {text: `- High Quality Renders have been optimized significantly for petals (PR #24)
- Added settings for more fine-grained control over petal rendering quality (PR #24)`,
  date: "Version 1.2.0 (Petal Renders Optimization)"},
  {text: `- Crafting animations are now shorter (PR #23)`,
  date: "Version 1.1.1"},
  {text: `- The inventory menu can now be expanded to fullscreen! (PR #22)
- High Quality Renders are now turned off when too many petals are on-screen (default: 100) (PR #22)`,
  date: "Version 1.1.0 (Fullscreen Inventory Update)"},
  {text: `- Dragged petals now get displayed above the inventory menu and other UI (PR #21)
- Dragged petals no longer randomly get sent to the shadow realm (PR #21)
- The debug info now also shows this script's version number (PR #21)`,
  date: "Version 1.0.2"},
  {text: `- Clicking on a menu (e.g, Inventory) no longer affects loadout petals behind the menu (PR #20)
- Some behind-the-scenes changes to how the search bar affects the crafting menu's height (PR #20)`,
  date: "Version 1.0.1"},
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
  date: "Version 1.0.0 (Initial Release)"},
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
    this.w = 600;

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
    ctx.translate(this.x, this.renderY);
    ctx.fillStyle = "#9bb56b";
    ctx.beginPath();
    ctx.roundRect(5, 5, this.w - 50, 75);
    ctx.fill();
    ctx.closePath();

    // Redraw the title so that it says "Cinderscript Changelog"
    ctx.font = "900 24px Ubuntu";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.strokeText("Cinderscript Changelog", this.w / 2, 20);
    ctx.fillText("Cinderscript Changelog", this.w / 2, 20);

    // Draw the [*] marker explanation
    ctx.font = "900 14px Ubuntu";
    ctx.fillStyle = "#bbbbbb";
    ctx.lineWidth = 2;
    ctx.strokeText(
      "The marker [*] denotes items that only affect users who",
      this.w / 2,
      48,
    );
    ctx.fillText(
      "The marker [*] denotes items that only affect users who",
      this.w / 2,
      48,
    );
    ctx.strokeText(
      "are using some variant of Flowrscript at the same time.",
      this.w / 2,
      68,
    );
    ctx.fillText(
      "are using some variant of Flowrscript at the same time.",
      this.w / 2,
      68,
    );
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

export let cinderChangelog: CinderChangelog;

/**
 * A helper function to initialize {@linkcode cinderChangelog}, to prevent
 * certain side effects from its constructor running during importing.
 */
export function initChangelog(): void {
  cinderChangelog = new CinderChangelog();
}