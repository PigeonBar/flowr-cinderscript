// ==UserScript==
// @name         Flowr - Cinderscript
// @namespace    npm/vite-plugin-monkey
// @version      1.7.0
// @author       Applepie (Ideas + bugfixes), PigeonBar (some technical stuff)
// @description  A free, publicly available collection of QoL features for flowr.fun players.
// @icon         https://www.google.com/s2/favicons?sz=64&domain=flowr.fun
// @downloadURL  https://github.com/PigeonBar/flowr-cinderscript/raw/refs/heads/main/dist/cinderscript.user.js
// @updateURL    https://github.com/PigeonBar/flowr-cinderscript/raw/refs/heads/main/dist/cinderscript.user.js
// @match        https://flowr.fun/
// @grant        unsafeWindow
// ==/UserScript==

(function () {
  'use strict';

  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  var Rarity = /* @__PURE__ */ ((Rarity2) => {
    Rarity2[Rarity2["COMMON"] = 0] = "COMMON";
    Rarity2[Rarity2["UNUSUAL"] = 1] = "UNUSUAL";
    Rarity2[Rarity2["RARE"] = 2] = "RARE";
    Rarity2[Rarity2["EPIC"] = 3] = "EPIC";
    Rarity2[Rarity2["LEGENDARY"] = 4] = "LEGENDARY";
    Rarity2[Rarity2["MYTHIC"] = 5] = "MYTHIC";
    Rarity2[Rarity2["ULTRA"] = 6] = "ULTRA";
    Rarity2[Rarity2["SUPER"] = 7] = "SUPER";
    Rarity2[Rarity2["OMEGA"] = 8] = "OMEGA";
    Rarity2[Rarity2["FABLED"] = 9] = "FABLED";
    Rarity2[Rarity2["DIVINE"] = 10] = "DIVINE";
    Rarity2[Rarity2["SUPREME"] = 11] = "SUPREME";
    Rarity2[Rarity2["OMNIPOTENT"] = 12] = "OMNIPOTENT";
    Rarity2[Rarity2["ASTRAL"] = 13] = "ASTRAL";
    Rarity2[Rarity2["CELESTIAL"] = 14] = "CELESTIAL";
    Rarity2[Rarity2["SERAPHIC"] = 15] = "SERAPHIC";
    Rarity2[Rarity2["TRANSCENDENT"] = 16] = "TRANSCENDENT";
    Rarity2[Rarity2["ETHEREAL"] = 17] = "ETHEREAL";
    Rarity2[Rarity2["GALACTIC"] = 18] = "GALACTIC";
    Rarity2[Rarity2["ETERNAL"] = 19] = "ETERNAL";
    Rarity2[Rarity2["APOTHEOTIC"] = 20] = "APOTHEOTIC";
    Rarity2[Rarity2["VOIDBOUND"] = 21] = "VOIDBOUND";
    Rarity2[Rarity2["EXALTED"] = 22] = "EXALTED";
    Rarity2[Rarity2["CHAOS"] = 23] = "CHAOS";
    Rarity2[Rarity2["CATACLYSMIC"] = 24] = "CATACLYSMIC";
    Rarity2[Rarity2["NULLBORNE"] = 25] = "NULLBORNE";
    Rarity2[Rarity2["ECLIPSED"] = 26] = "ECLIPSED";
    Rarity2[Rarity2["RADIANT"] = 27] = "RADIANT";
    Rarity2[Rarity2["FORSAKEN"] = 28] = "FORSAKEN";
    Rarity2[Rarity2["CHROMATIC"] = 29] = "CHROMATIC";
    Rarity2[Rarity2["PRISMATIC"] = 30] = "PRISMATIC";
    Rarity2[Rarity2["ARCANE"] = 31] = "ARCANE";
    Rarity2[Rarity2["ESOTERIC"] = 32] = "ESOTERIC";
    Rarity2[Rarity2["METAPHYSICAL"] = 33] = "METAPHYSICAL";
    Rarity2[Rarity2["PRIMORDIAL"] = 34] = "PRIMORDIAL";
    Rarity2[Rarity2["VANGUARD"] = 35] = "VANGUARD";
    Rarity2[Rarity2["LUMINOUS"] = 36] = "LUMINOUS";
    Rarity2[Rarity2["FRACTURED"] = 37] = "FRACTURED";
    Rarity2[Rarity2["ELOQUENT"] = 38] = "ELOQUENT";
    Rarity2[Rarity2["TESSELATED"] = 39] = "TESSELATED";
    Rarity2[Rarity2["VANQUISHED"] = 40] = "VANQUISHED";
    Rarity2[Rarity2["COALESCENT"] = 41] = "COALESCENT";
    Rarity2[Rarity2["SPECTRAL"] = 42] = "SPECTRAL";
    Rarity2[Rarity2["UNFATHOMABLE"] = 43] = "UNFATHOMABLE";
    Rarity2[Rarity2["PARAMOUNT"] = 44] = "PARAMOUNT";
    Rarity2[Rarity2["EVANESCENT"] = 45] = "EVANESCENT";
    Rarity2[Rarity2["STARFORGED"] = 46] = "STARFORGED";
    Rarity2[Rarity2["TIMELIT"] = 47] = "TIMELIT";
    Rarity2[Rarity2["AEONIC"] = 48] = "AEONIC";
    Rarity2[Rarity2["UNREAL"] = 49] = "UNREAL";
    return Rarity2;
  })(Rarity || {});
  const LIGHT_CINDER_COLOUR = "#ffaf60";
  const CINDER_COLOUR = "#fc9547";
  const CINDER_BORDER_COLOUR = "#cc7b3d";
  const LIGHT_SETTINGS_GRAY = "#cacaca";
  const SETTINGS_GRAY = "#aaaaaa";
  const SETTINGS_GRAY_BORDER = "#8a8a8a";
  const SETTINGS_GREEN = "#3fff3f";
  const TOOLTIP_BLUE = "#7f7fff";
  const TOOLTIP_BORDER_BLUE = "#3f3fff";
  const TEXT_LIGHT_RED = "#ffbfbf";
  const TEXT_LIGHT_BLUE = "#bfbfff";
  const MAX_PETAL_RARITY = Rarity.CHAOS;
  const MAX_RARITY = Rarity.UNREAL;
  const SETTINGS_OPTION_HEIGHT = 50;
  const SETTINGS_BUTTON_SIZE = 28;
  const SETTINGS_BUTTON_PADDING = 13;
  const EDIT_ICON_SIZE = 20;
  const TOOLTIP_ICON_SIZE = 20;
  const TOOLTIP_WIDTH_CAP = 400;
  const SCROLLBAR_LENGTH = 200;
  const SETTINGS_SCROLLBAR_MIN_POS = 120;
  const TOOLTIP_TEXT_HEIGHT = 22.5;
  const GALLERY_EXTRA_HEIGHT = 100;
  const GALLERY_TOP_PADDING = 5;
  const GALLERY_EXTRA_HOR_SPACE = 27;
  const DROPDOWN_UI_PADDING = 13;
  const PETAL_BORDER_RATIO = 0.18;
  const KEYBIND_DELETED = "<None>";
  const NON_ANIM_PETALS = Object.freeze([
    "Basic",
    "Rubber",
    "Husk",
    "Horn",
    "Blood Horn",
    "Clover",
    "Dark Spine",
    "Coral",
    "Bubble",
    "Air",
    "Starfish",
    "Claw",
    "Lightning",
    "Shiny Lightning",
    "Blood Jolt",
    "Jolt",
    "Fangs",
    "Jelly",
    "Pearl",
    "Sponge",
    "Shell",
    "Bloodshot Eye",
    "Third Eye",
    "Blood Mandible",
    "Mandible",
    "Light",
    "Blood Light",
    "Rog456",
    "Heavy",
    "Rice",
    "Iris",
    "Shiny Iris",
    "Faster",
    "Stalk",
    "Stinger",
    "Blood Stinger",
    "Sand",
    "Spore",
    "Missile",
    "Homing Missile",
    "Fire Missile",
    "Bud",
    "Bloom",
    "Ruby",
    "Shiny Ruby",
    "Sapphire",
    "Amulet of Divergence",
    "Amulet of Grace",
    "Amulet of Time",
    "Emerald",
    "Rock",
    "Soil",
    "Salt",
    "Powder",
    "Leaf",
    "Blade",
    "Cinderleaf",
    "Shiny Leaf",
    "Blood Leaf",
    "Toxin",
    "Neurotoxin",
    "Batrachotoxin",
    "Yucca",
    "Shiny Yucca",
    "Pincer",
    "Yin Yang",
    "Rose",
    "Blood Rose",
    "Trident",
    "Dahlia",
    "Corn",
    "Blood Corn",
    "Bone",
    "Wing",
    "Shiny Wing",
    "Coconut",
    "Fig",
    "Watermelon",
    "Blood Watermelon",
    "Oranges",
    "Blood Oranges",
    "Neutron Star",
    "Honey",
    "Royal Serum",
    "Peas",
    "Grapes",
    "Blueberries",
    "Pomegranate",
    "Cactus",
    "Shiny Cactus",
    "Dandelion",
    "Egg",
    "Bauble of the Honeycomb",
    "Hornet Egg",
    "Shiny Egg",
    "Jellyfish Egg",
    "Neuroflare Egg",
    "Plastic Egg",
    "Web",
    "Pollen",
    "Magnet",
    "Root",
    "Stick",
    "Card",
    "Cash",
    "Ant Egg",
    "Lilypad",
    "Blossom",
    "Carapace",
    "Thorax",
    "Trinket of the Hivemind",
    "Trinket of the Sea",
    "Trinket of the Wild",
    "Plank",
    "Carrot"
  ]);
  const defaultSettings = Object.freeze({
    petalCraftPreview: true,
    autoCopyCodes: true,
    missileDrawPriority: true,
    invertAttack: false,
    invertDefend: false,
    settingsTooltips: true,
    craftingSearchBar: true,
    inventoryExpandButton: true,
    disableAllOptimizations: false,
    petalStarCaching: true,
    disablePetalStars: false,
    disablePetalAnimations: false,
    allowLockSlotsOneToFive: false,
    hideSettingsDuringRuns: false,
    baseReciprocalOfFOV: 3,
    playerHpBarScale: 2.5,
    specialDropsScale: 2.5,
    specialDropsQuantity: 1,
    petalRenderQualityThreshold: 400,
    craftAnimationLength: 0,
    petalLockShakeIntensity: 2,
    gardenBackground: Colors.biomes.garden.background,
    desertBackground: Colors.biomes.desert.background,
    oceanBackground: Colors.biomes.ocean.background,
    savannaBackground: Colors.biomes.savanna.background,
    swampBackground: Colors.biomes.swamp.background,
    zooBackground: Colors.biomes.zoo.background,
    deepZooBackground: Colors.biomes.deepzoo.background,
    specialDropsRarity: Rarity.ETHEREAL,
    keybindStatsBox: "KeyG",
    keybindInvertAttack: "Comma",
    keybindInvertDefend: "Period",
    keybindLockSlot: "KeyL"
  });
  class SettingsManager {
    /**
     * A list of saved settings. This is also saved to local storage every time
     * the user edits any of the settings.
     */
    savedSettings;
    /**
     * A list of listeners to listen to the user selecting options in the
     * settings menu.
     */
    listeners;
    constructor() {
      this.savedSettings = { ...defaultSettings };
      const loadedSettings = JSON.parse(
        localStorage.getItem("cinderSettings") ?? "{}"
      );
      this.savedSettings = { ...defaultSettings, ...loadedSettings };
      this.listeners = {
        petalCraftPreview: [],
        autoCopyCodes: [],
        missileDrawPriority: [],
        invertAttack: [],
        invertDefend: [],
        settingsTooltips: [],
        craftingSearchBar: [],
        inventoryExpandButton: [],
        disableAllOptimizations: [],
        petalStarCaching: [],
        disablePetalStars: [],
        disablePetalAnimations: [],
        allowLockSlotsOneToFive: [],
        hideSettingsDuringRuns: [],
        baseReciprocalOfFOV: [],
        playerHpBarScale: [],
        specialDropsScale: [],
        specialDropsQuantity: [],
        petalRenderQualityThreshold: [],
        craftAnimationLength: [],
        petalLockShakeIntensity: [],
        gardenBackground: [],
        desertBackground: [],
        oceanBackground: [],
        savannaBackground: [],
        swampBackground: [],
        zooBackground: [],
        deepZooBackground: [],
        specialDropsRarity: [],
        keybindStatsBox: [],
        keybindInvertAttack: [],
        keybindInvertDefend: [],
        keybindLockSlot: []
      };
    }
    /**
     * @param key The {@linkcode SettingsKey} being retrieved from.
     * @returns The user's setting for this key.
     */
    get(key) {
      return this.savedSettings[key];
    }
    /**
     * @param key The {@linkcode SettingsKey} being retrieved from.
     * @returns The default setting for this key.
     */
    getDefault(key) {
      return defaultSettings[key];
    }
    /**
     * @param key The {@linkcode SettingsKey} being written to.
     * @param value The settings value to write.
     */
    set(key, value) {
      this.savedSettings[key] = value;
      localStorage.setItem("cinderSettings", JSON.stringify(this.savedSettings));
      for (let listener of this.listeners[key]) {
        listener(value);
      }
    }
    /**
     * Adds a listener to {@linkcode listeners}, which will allow it to listen to
     * all *future* choices made by the user.
     */
    addListener(key, listener) {
      this.listeners[key].push(listener);
    }
  }
  let settings;
  function initSettingsManager() {
    settings = new SettingsManager();
  }
  const keybinds = [];
  function initKeybindHandling() {
    const originalHandleKey = inputHandler.handleKey;
    inputHandler.handleKey = function(e) {
      for (let keybind of keybinds) {
        if (checkInstruction(keybind, e, true)) {
          if (keybind.fn(e)) {
            return;
          }
        }
      }
      originalHandleKey.apply(inputHandler, [e]);
      for (let keybind of keybinds) {
        if (checkInstruction(keybind, e, false)) {
          if (keybind.fn(e)) {
            return;
          }
        }
      }
    };
  }
  function addKeybindInstruction(keybind) {
    keybinds.push({
      ...keybind,
      keyType: keybind.keyType ?? "keydown",
      inGame: keybind.inGame ?? true,
      inMenu: keybind.inMenu ?? false,
      beforeOriginal: keybind.beforeOriginal ?? false
    });
  }
  function isInGameInput() {
    return _unsafeWindow.state === "game" && !inputHandler.chatOpen;
  }
  function isInMenuInput() {
    return _unsafeWindow.state === "menu" && document.activeElement?.tagName !== "INPUT";
  }
  function checkInstruction(keybind, e, beforeOriginal) {
    if (e.repeat) {
      return false;
    }
    if (e.code === KEYBIND_DELETED) {
      console.warn(`Keypress code somehow equal to ${KEYBIND_DELETED}!`);
      console.warn(e);
      return false;
    }
    if (!(keybind.inGame && isInGameInput()) && !(keybind.inMenu && isInMenuInput())) {
      return false;
    }
    if (keybind.beforeOriginal !== beforeOriginal) {
      return false;
    }
    if (keybind.keyType !== e.type) {
      return false;
    }
    if (keybind.type === "settings") {
      return e.code === settings.get(keybind.settingsKey);
    } else if (keybind.type === "rawValue") {
      return e.code === keybind.value;
    } else if (keybind.type === "localStorage") {
      return e.code === localStorage.getItem(keybind.storageKey) && e.code.length > 0;
    } else if (keybind.type === "digit") {
      return e.code.startsWith("Digit");
    } else {
      return false;
    }
  }
  const cinderChangelogList = [
    {
      text: `- Added settings to customize biome background colours (PR #36)`,
      date: "Version 1.7.0 (Customizable Background Update)"
    },
    {
      text: `- [*] With this update, this script should now generally be ready for use by Flowrscript users!
- [*] Fixed inventory menu not being expandable (PR #35)
- [*] Fixed stat boxes being rendered far away from the cursor (PR #35)
- [*] Fixed crafting search bar extending to edge of screen (PR #35)
- [*] The build saver is no longer clickable behind other menus (PR #35)
- [*] Fixed some petal render optimizations not activating (PR #35)
- Rarity settings now also use rarity index numbers (PR #35)
- Changed inventory menu's padding to Flowrscript's more familiar layout (PR #35)`,
      date: "Version 1.6.0 (Flowrscript Compatibility Update)"
    },
    {
      text: `- The settings menu is accessible again outside the main menu, reverted from previous update (PR #34)
- [*] Fixed enemy missiles sometimes failing to display (PR #34)
- [*] Fixed this script's petal locks not working at all (PR #34)
- Made this changelog a bit wider (PR #34)
- Default special drops threshold increased (1 Trans -> 1 Eth) (PR #34)`,
      date: "Version 1.5.3"
    },
    {
      text: `- [*] Fixed some issues involving physical overlap with Flowrscript's menus (PR #33)
- Fixed the settings menu being active outside the main menu (PR #33)
- This script now waits longer for Flowrscript to load its skins (200ms -> 1000ms) (PR #33)`,
      date: "Version 1.5.2"
    },
    {
      text: `- [*] Attempted fix for the settings menu not working at all (PR #32)`,
      date: "Version 1.5.1"
    },
    {
      text: `- The mob gallery now has more types of mob counters, such as a spawn counter! (PR #31)
- Tooltip text boxes are now fully opaque (PR #31)`,
      date: "Version 1.5.0 (More Mob Counters)"
    },
    {
      text: `- Fixed an issue where some stats boxes were not wide enough to fit the kill counter (PR #30)`,
      date: "Version 1.4.2"
    },
    {
      text: `- Fixed a rendering crash when hovering over an EnemyBox in-game (PR #29)`,
      date: "Version 1.4.1"
    },
    {
      text: `- The mob gallery now tracks how many times you have killed each kind of mob (PR #27)
- It is also tracking mob spawns, but cannot display those until an upcoming UI update (PR #27)
- To reduce lag, the game no longer tries to render off-screen mob gallery entries (PR #27)`,
      date: "Version 1.4.0 (Mob Kill Counter)"
    },
    {
      text: `- Fixed a bug where the UI breaks if you click on an equipped petal without a petal below (PR #26)`,
      date: "Version 1.3.1"
    },
    {
      text: `- You can lock petal slots (default keybind: [L]) (PR #25)
- Major behind-the-scenes changes for keybind handling, hope it doesn't break anything (PR #25)`,
      date: "Version 1.3.0 (Petal Lock Update)"
    },
    {
      text: `- High Quality Renders have been optimized significantly for petals (PR #24)
- Added settings for more fine-grained control over petal rendering quality (PR #24)`,
      date: "Version 1.2.0 (Petal Renders Optimization)"
    },
    {
      text: `- Crafting animations are now shorter (PR #23)`,
      date: "Version 1.1.1"
    },
    {
      text: `- The inventory menu can now be expanded to fullscreen! (PR #22)
- High Quality Renders are now turned off when too many petals are on-screen (default: 100) (PR #22)`,
      date: "Version 1.1.0 (Fullscreen Inventory Update)"
    },
    {
      text: `- Dragged petals now get displayed above the inventory menu and other UI (PR #21)
- Dragged petals no longer randomly get sent to the shadow realm (PR #21)
- The debug info now also shows this script's version number (PR #21)`,
      date: "Version 1.0.2"
    },
    {
      text: `- Clicking on a menu (e.g, Inventory) no longer affects loadout petals behind the menu (PR #20)
- Some behind-the-scenes changes to how the search bar affects the crafting menu's height (PR #20)`,
      date: "Version 1.0.1"
    },
    {
      text: `Cinderscript's official release! Here are its initial features:
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
      date: "Version 1.0.0 (Initial Release)"
    }
  ];
  class CinderChangelog extends Changelog {
    /**
     * Whether or not this changelog has generated its entries.
     */
    generatedEntries;
    constructor() {
      super();
      this.w = 600;
      this.generatedEntries = false;
      const originalOnMouseDown = _unsafeWindow.onmousedown;
      _unsafeWindow.onmousedown = (e) => {
        originalOnMouseDown?.apply(_unsafeWindow, [e]);
        if (_unsafeWindow.connected === true && this.active) {
          this.mouseDown({ mouseX: mouse.canvasX, mouseY: mouse.canvasY });
        }
      };
      const originalOnMouseUp = _unsafeWindow.onmouseup;
      _unsafeWindow.onmouseup = (e) => {
        originalOnMouseUp?.apply(_unsafeWindow, [e]);
        if (_unsafeWindow.connected === true) {
          this.mouseUp({ mouseX: mouse.canvasX, mouseY: mouse.canvasY });
        }
      };
      const originalHandleMouse = inputHandler.handleMouse;
      inputHandler.handleMouse = (e) => {
        originalHandleMouse.apply(inputHandler, [e]);
        this.mouseMove({ mouseX: mouse.canvasX, mouseY: mouse.canvasY });
      };
      document.addEventListener("wheel", (e) => {
        this.updateScroll(
          { x: e.deltaX, y: e.deltaY },
          { mouseX: mouse.canvasX, mouseY: mouse.canvasY }
        );
      });
      const originalDraw = changelog.draw;
      changelog.draw = () => {
        originalDraw.apply(changelog);
        this.draw();
      };
    }
    toggle() {
      super.toggle();
      if (!this.active) {
        this.mouseUp({ mouseX: mouse.canvasX, mouseY: mouse.canvasY });
      }
    }
    draw() {
      super.draw();
      ctx.translate(this.x, this.renderY);
      ctx.fillStyle = "#9bb56b";
      ctx.beginPath();
      ctx.roundRect(5, 5, this.w - 50, 75);
      ctx.fill();
      ctx.closePath();
      ctx.font = "900 24px Ubuntu";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 3;
      ctx.strokeText("Cinderscript Changelog", this.w / 2, 20);
      ctx.fillText("Cinderscript Changelog", this.w / 2, 20);
      ctx.font = "900 14px Ubuntu";
      ctx.fillStyle = "#bbbbbb";
      ctx.lineWidth = 2;
      ctx.strokeText(
        "The marker [*] denotes items that only affect users who",
        this.w / 2,
        48
      );
      ctx.fillText(
        "The marker [*] denotes items that only affect users who",
        this.w / 2,
        48
      );
      ctx.strokeText(
        "are using some variant of Flowrscript at the same time.",
        this.w / 2,
        68
      );
      ctx.fillText(
        "are using some variant of Flowrscript at the same time.",
        this.w / 2,
        68
      );
      ctx.translate(-this.x, -this.y - this.offset);
    }
    mouseDown(e) {
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
    generateEntries() {
      if (this.generatedEntries) {
        return;
      }
      this.generatedEntries = true;
      const vanillaChangelogList = [...changeloglist];
      changeloglist.splice(0, changeloglist.length);
      changeloglist.push(...cinderChangelogList);
      super.generateEntries();
      changeloglist.splice(0, changeloglist.length);
      changeloglist.push(...vanillaChangelogList);
    }
  }
  let cinderChangelog;
  function initChangelog() {
    cinderChangelog = new CinderChangelog();
  }
  let flowrMod;
  function initFlowrscriptPointer() {
    if (!isNil(_unsafeWindow.flowrMod)) {
      flowrMod = _unsafeWindow.flowrMod;
    } else {
      const interval = setInterval(() => {
        if (!isNil(_unsafeWindow.flowrMod)) {
          chatAnnounce(
            "Warning - An issue was detected while trying to load Cinderscript after Flowrscript. Please report this if this is regularly happening to you."
          );
          clearInterval(interval);
        }
      }, 1e3);
    }
  }
  class RGBColour {
    /**
     * A number from 0 to 255, representing the Red intensity of this colour.
     */
    red;
    /**
     * A number from 0 to 255, representing the Green intensity of this colour.
     */
    green;
    /**
     * A number from 0 to 255, representing the Blue intensity of this colour.
     */
    blue;
    /**
     * A hex code representing this colour.
     * 
     * If this colour's intensities are decimal numbers, their rounded values are
     * used for computing this hex code.
     */
    hexCode;
    constructor(arg1, arg2, arg3) {
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
      this.red = Math.max(Math.min(this.red, 255), 0);
      this.green = Math.max(Math.min(this.green, 255), 0);
      this.blue = Math.max(Math.min(this.blue, 255), 0);
      this.hexCode = "#" + this.componentToHex(this.red) + this.componentToHex(this.green) + this.componentToHex(this.blue);
    }
    /**
     * A helper function to convert an rgb intensity to a 2-character hex code.
     */
    componentToHex(intensity) {
      const hex = Math.round(intensity).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }
    /**
     * Computes the brightness of this colour, as a number between 0 and 1.
     */
    getBrightness() {
      return Math.max(this.red, this.green, this.blue) / 255;
    }
    /**
     * Computes the saturation of this colour, as a number between 0 and 1.
     */
    getSaturation() {
      const colour1 = this.fullBrightness();
      return 1 - Math.min(colour1.red, colour1.green, colour1.blue) / 255;
    }
    /**
     * Computes the hue of this colour on the colour wheel, as a number between
     * 0 and 360.
     */
    getHue() {
      const colour2 = this.fullBrightnessAndSaturation();
      const minColour = Math.min(colour2.red, colour2.green, colour2.blue);
      const maxColour = Math.max(colour2.red, colour2.green, colour2.blue);
      if (colour2.blue === minColour) {
        if (colour2.red === maxColour) {
          return colour2.green * 60 / 255;
        } else {
          return 120 - colour2.red * 60 / 255;
        }
      } else if (colour2.red === minColour) {
        if (colour2.green === maxColour) {
          return 120 + colour2.blue * 60 / 255;
        } else {
          return 240 - colour2.green * 60 / 255;
        }
      } else {
        if (colour2.blue === maxColour) {
          return 240 + colour2.red * 60 / 255;
        } else {
          return 360 - colour2.blue * 60 / 255;
        }
      }
    }
    /**
     * Returns a copy of this colour with brightness set to full.
     */
    fullBrightness() {
      const brightness = this.getBrightness();
      if (brightness <= 0) {
        return new RGBColour(255, 255, 255);
      } else {
        const ratio = 1 / brightness;
        return new RGBColour(
          this.red * ratio,
          this.green * ratio,
          this.blue * ratio
        );
      }
    }
    /**
     * Returns a copy of this colour with brightness set to full, and then
     * saturation set to full.
     */
    fullBrightnessAndSaturation() {
      const colour1 = this.fullBrightness();
      const saturation = this.getSaturation();
      if (saturation <= 0) {
        return new RGBColour(255, 0, 0);
      } else {
        const ratio = 1 / saturation;
        const fn = (intensity) => {
          return 255 - ratio * (255 - intensity);
        };
        return new RGBColour(fn(colour1.red), fn(colour1.green), fn(colour1.blue));
      }
    }
  }
  class ColourSelectorUi {
    /**
     * The x-coordinate of this UI on the main canvas.
     */
    x;
    /**
     * The y-coordinate of this UI on the main canvas.
     */
    y;
    /**
     * The width of this UI on the main canvas.
     */
    w;
    /**
     * The height of this UI on the main canvas.
     */
    h;
    /**
     * Whether or not the user has opened this UI.
     */
    active;
    /**
     * The previous colour stored by this UI before the user started editing.
     */
    previousColour;
    /**
     * The base game's default colour for the setting that is being edited.
     */
    defaultColour;
    /**
     * The hue of the currently edited colour.
     */
    hue;
    /**
     * The saturation of the currently edited colour.
     */
    saturation;
    /**
     * The brightness of the currently edited colour.
     */
    brightness;
    /**
     * The position of the main gradient rectangle relative to this UI.
     */
    gradientRect;
    /**
     * The position of the colour wheel picker relative to this UI.
     */
    colourWheel;
    /**
     * The position of the "Save Selection" button relative to this UI.
     */
    saveButton;
    /**
     * The position of the "Import Hex Code" button relative to this UI.
     */
    importButton;
    /**
     * The position of the "Close" button relative to this UI.
     */
    closeButton;
    /**
     * The parent {@linkcode CinderSettingsMenu} that this UI belongs to.
     */
    parentMenu;
    /**
     * Whether or not the user is currently dragging the main gradient rectangle
     * picker (saturation + brightness).
     */
    draggingMainGradient;
    /**
     * Whether or not the user is currently dragging the colour wheel picker.
     */
    draggingColourWheel;
    constructor(parentMenu) {
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
        h: this.gradientRect.h
      };
      this.saveButton = {
        x: this.colourWheel.x + this.colourWheel.w + 40,
        y: this.colourWheel.y,
        w: 160,
        h: 40
      };
      this.importButton = {
        x: this.saveButton.x,
        y: this.saveButton.y + 50,
        w: 160,
        h: 40
      };
      this.closeButton = {
        x: this.w - 7.5 - 30 - 3,
        y: 7.5 + 3,
        w: 30,
        h: 30
      };
    }
    /**
     * Sets this UI to be editing a new colour for a new item/setting (i.e., any
     * time that {@linkcode previousColour} should also be overwritten).
     */
    setColour(colour) {
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
    setDefaultColour(colour) {
      this.defaultColour = new RGBColour(colour);
    }
    /**
     * Computes the colour corresponding to the currently selected hue (with full
     * saturation and brightness).
     */
    getColourForCurrentHue() {
      let red = 0;
      let green = 0;
      let blue = 0;
      if (this.hue < 60) {
        red = 255;
        green = 255 * this.hue / 60;
      } else if (this.hue < 120) {
        green = 255;
        red = 255 * (120 - this.hue) / 60;
      } else if (this.hue < 180) {
        green = 255;
        blue = 255 * (this.hue - 120) / 60;
      } else if (this.hue < 240) {
        blue = 255;
        green = 255 * (240 - this.hue) / 60;
      } else if (this.hue < 300) {
        blue = 255;
        red = 255 * (this.hue - 240) / 60;
      } else {
        red = 255;
        blue = 255 * (360 - this.hue) / 60;
      }
      return new RGBColour(red, green, blue);
    }
    /**
     * Computes the currently selected colour.
     */
    getCurrentColour() {
      const colour1 = this.getColourForCurrentHue();
      let red = colour1.red;
      let green = colour1.green;
      let blue = colour1.blue;
      red = 255 - this.saturation * (255 - red);
      green = 255 - this.saturation * (255 - green);
      blue = 255 - this.saturation * (255 - blue);
      red = this.brightness * red;
      green = this.brightness * green;
      blue = this.brightness * blue;
      return new RGBColour(red, green, blue);
    }
    /**
     * The main function to draw this UI.
     */
    draw() {
      this.x = this.parentMenu.x + this.parentMenu.w + 20;
      const targetY = this.active ? 20 : -this.h - 20;
      this.y = interpolate(this.y, targetY, 0.3);
      this.handleDragging();
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.strokeStyle = SETTINGS_GRAY_BORDER;
      ctx.fillStyle = SETTINGS_GRAY;
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.roundRect(0, 0, this.w, this.h, 3);
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
      ctx.font = "900 32px Ubuntu";
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 3.75;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctxDrawText("Colour Selector", this.w / 2, 10);
      const grad1 = ctx.createLinearGradient(
        this.gradientRect.x,
        0,
        this.gradientRect.x + this.gradientRect.w,
        0
      );
      grad1.addColorStop(0, "#ffffff");
      grad1.addColorStop(1, this.getColourForCurrentHue().hexCode);
      ctx.fillStyle = grad1;
      ctx.fillRect(
        this.gradientRect.x,
        this.gradientRect.y,
        this.gradientRect.w,
        this.gradientRect.h
      );
      const grad2 = ctx.createLinearGradient(
        0,
        this.gradientRect.y,
        0,
        this.gradientRect.y + this.gradientRect.h
      );
      grad2.addColorStop(0, "#00000000");
      grad2.addColorStop(1, "#000000");
      ctx.fillStyle = grad2;
      ctx.fillRect(
        this.gradientRect.x,
        this.gradientRect.y,
        this.gradientRect.w,
        this.gradientRect.h
      );
      const pickedX = this.gradientRect.x + this.saturation * this.gradientRect.w;
      const pickedY = this.gradientRect.y + (1 - this.brightness) * this.gradientRect.h;
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
      const grad3 = ctx.createLinearGradient(
        0,
        this.colourWheel.y,
        0,
        this.colourWheel.y + this.colourWheel.h
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
        this.colourWheel.h
      );
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.rect(
        this.colourWheel.x - 8,
        this.colourWheel.y + this.hue * this.colourWheel.h / 360 - 4,
        this.colourWheel.w + 16,
        8
      );
      ctx.stroke();
      ctx.closePath();
      let currentX = this.saveButton.x;
      let currentY = this.colourWheel.y + this.colourWheel.h - 10;
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
      currentX = this.colourWheel.x + 250;
      ctx.fillStyle = this.defaultColour.hexCode;
      ctx.fillRect(currentX, currentY - 28.5, 40, 40);
      currentX = this.saveButton.x;
      currentY -= 40;
      ctx.fillStyle = "white";
      ctxDrawText("New: ", currentX, currentY);
      currentX += ctx.measureText("New: ").width;
      ctx.fillStyle = SETTINGS_GREEN;
      ctxDrawText(this.getCurrentColour().hexCode, currentX, currentY);
      currentX = this.colourWheel.x + 250;
      ctx.fillStyle = this.getCurrentColour().hexCode;
      ctx.fillRect(currentX, currentY - 28.5, 40, 40);
      currentX = this.saveButton.x;
      currentY -= 40;
      ctx.fillStyle = "white";
      ctxDrawText("Previous: ", currentX, currentY);
      currentX += ctx.measureText("Previous: ").width;
      ctx.fillStyle = SETTINGS_GREEN;
      ctxDrawText(this.previousColour.hexCode, currentX, currentY);
      currentX = this.colourWheel.x + 250;
      ctx.fillStyle = this.previousColour.hexCode, ctx.fillRect(currentX, currentY - 28.5, 40, 40);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "black";
      ctx.strokeRect(currentX - 1, currentY - 29.5, 42, 122);
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
        3
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
        this.saveButton.y + this.saveButton.h / 2
      );
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
        3
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
        this.importButton.y + this.importButton.h / 2
      );
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
        6
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
        this.closeButton.y + 7.5
      );
      ctx.lineTo(
        this.closeButton.x + this.closeButton.w - 7.5,
        this.closeButton.y + this.closeButton.h - 7.5
      );
      ctx.stroke();
      ctx.closePath();
      ctx.beginPath();
      ctx.moveTo(
        this.closeButton.x + this.closeButton.w - 7.5,
        this.closeButton.y + 7.5
      );
      ctx.lineTo(
        this.closeButton.x + 7.5,
        this.closeButton.y + this.closeButton.h - 7.5
      );
      ctx.stroke();
      ctx.closePath();
      ctx.restore();
    }
    /**
     * Handles editing the picked colour based on the user's mouse position when
     * the user is dragging the main gradient picker or the colour wheel picker.
     */
    handleDragging() {
      if (this.draggingMainGradient) {
        this.saturation = (mouse.canvasX - this.gradientRect.x - this.x) / this.gradientRect.w;
        this.brightness = 1 - (mouse.canvasY - this.gradientRect.y - this.y) / this.gradientRect.h;
      } else if (this.draggingColourWheel) {
        this.hue = 360 * (mouse.canvasY - this.colourWheel.y - this.y) / this.colourWheel.h;
      }
      this.saturation = Math.max(Math.min(this.saturation, 1), 0);
      this.brightness = Math.max(Math.min(this.brightness, 1), 0);
      this.hue = Math.max(Math.min(this.hue, 360), 0);
    }
    /**
     * Checks whether the mouse is inside this menu.
     */
    mouseInMenu() {
      return mouseInBox(
        { x: mouse.canvasX, y: mouse.canvasY },
        { x: this.x, y: this.y, w: this.w, h: this.h }
      );
    }
    /**
     * Handles the user clicking on the UI.
     */
    mouseDown() {
      if (this.hoveringOverElement(this.gradientRect)) {
        this.draggingMainGradient = true;
      } else if (this.hoveringOverElement(this.colourWheel)) {
        this.draggingColourWheel = true;
      } else if (this.hoveringOverElement(this.saveButton)) {
        this.previousColour = this.getCurrentColour();
        this.parentMenu.saveColour(this.getCurrentColour().hexCode);
      } else if (this.hoveringOverElement(this.importButton)) {
        let colour = prompt("Please input a hex code:") ?? "";
        if (colour.charAt(0) !== "#") {
          colour = "#" + colour;
        }
        if (isHexCode(colour)) {
          this.setColour(colour);
          this.parentMenu.saveColour(colour);
        } else {
          alert(`Error: "${colour}" is not a valid hex code!`);
        }
      } else if (this.hoveringOverElement(this.closeButton)) {
        this.parentMenu.cancelColourOption();
        this.active = false;
      }
    }
    /**
     * Handles the user releasing a mouse click.
     */
    mouseUp() {
      this.draggingColourWheel = false;
      this.draggingMainGradient = false;
    }
    /**
     * A helper function to determine whether the mouse is hovering over one of
     * this UI's elements.
     */
    hoveringOverElement(element) {
      return mouseInBox(
        { x: mouse.canvasX, y: mouse.canvasY },
        {
          x: this.x + element.x,
          y: this.y + element.y,
          w: element.w,
          h: element.h
        }
      );
    }
    /**
     * If there are unsaved changes, prompt the user on whether or not they would
     * like to save the unsaved changes.
     */
    saveBeforeClosingPrompt() {
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
  let settingsMap;
  function initOptions(options) {
    settingsMap = Object.freeze(options);
  }
  class TooltipBox {
    w;
    h;
    text;
    /**
     * The alpha-value (i.e., opacity) of the drawn tooltip box.
     */
    alpha;
    /**
     * The full text for this tooltip is split into an array of lines, and each
     * line is split further into an array of words/tokens.
     */
    lines;
    constructor(text) {
      this.w = 20;
      this.h = 20 - (TOOLTIP_TEXT_HEIGHT - 15);
      this.alpha = 0;
      this.lines = [];
      this.text = text;
      this.generateDesc();
      if (typeof text === "object") {
        for (let key of text.dependentKeys) {
          settings.addListener(key, () => this.generateDesc());
        }
      }
    }
    /**
     * Draws this tooltip at the given location.
     * @param x The horizontal position for the *middle* of this tooltip box.
     * @param y The vertical position for the *top* of this tooltip box.
     * @param isHovered Whether or not the mouse is hovering over this setting's
     * tooltip icon.
     */
    draw(x, y, isHovered) {
      if (!isHovered && this.alpha < 0.1) {
        return;
      }
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
      ctx.fillStyle = TOOLTIP_BLUE;
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.rect(x - this.w / 2, y, this.w, this.h);
      ctx.fill();
      ctx.closePath();
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
    generateDesc() {
      this.w = 20;
      this.h = 20 - (TOOLTIP_TEXT_HEIGHT - 15);
      this.alpha = 0;
      ctx.font = "900 15px Ubuntu";
      const text = typeof this.text === "string" ? this.text : this.text.fn();
      const splitText = text.split(" ").map((token) => token + " ");
      this.lines = [];
      let currentLine = [];
      let currentWidth = 0;
      const addLine = () => {
        this.lines.push(currentLine);
        this.w = Math.max(this.w, currentWidth + 20);
        this.h += TOOLTIP_TEXT_HEIGHT;
        currentLine = [];
        currentWidth = 0;
      };
      for (let i = 0; i < splitText.length; i++) {
        const newText = splitText[i];
        if (newText.trim() === "$n") {
          addLine();
          continue;
        }
        const newWidth = newText[0] === "$" ? 0 : ctx.measureText(newText).width;
        if (currentWidth + newWidth > TOOLTIP_WIDTH_CAP) {
          addLine();
        }
        currentLine.push(newText);
        currentWidth += newWidth;
      }
      addLine();
    }
  }
  class TooltipIcon {
    /**
     * The {@linkcode TooltipBox} that gets displayed when the user hovers over
     * this tooltip icon.
     */
    tooltipBox;
    constructor(text) {
      this.tooltipBox = new TooltipBox(text);
    }
    /**
     * Draws the (?) icon centred at the given coordinates.
     */
    drawIcon(pos) {
      const { x, y } = pos;
      ctx.strokeStyle = TOOLTIP_BORDER_BLUE;
      ctx.fillStyle = TOOLTIP_BLUE;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(x, y, TOOLTIP_ICON_SIZE / 2, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();
      ctx.closePath();
      ctx.font = "900 17px Ubuntu";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.strokeText("?", x, y + 1);
      ctx.fillText("?", x, y + 1);
    }
    /**
     * Draws the text box for this tooltip. Also handles fading it in/out
     * depending on whether the user is currently hovering over the (?) icon.
     * @param pos The position of the *tooltip icon* (not the tooltip box itself).
     * @param e The position of the mouse.
     */
    drawText(pos, e) {
      const { x, y } = pos;
      const isHovered = mouseInBox(
        e,
        // We intentionally make the tooltip icon's "hitbox" larger
        {
          x: x - SETTINGS_BUTTON_SIZE / 2,
          y: y - SETTINGS_BUTTON_SIZE / 2,
          w: SETTINGS_BUTTON_SIZE,
          h: SETTINGS_BUTTON_SIZE
        }
      );
      this.tooltipBox.draw(x, y + TOOLTIP_ICON_SIZE / 2 + 10, isHovered);
    }
  }
  const editIcon = new Image();
  editIcon.src = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB3aWR0aD0iMTAwLjAwMDA1bW0iCiAgIGhlaWdodD0iMTAwLjAwMDA2bW0iCiAgIHZpZXdCb3g9IjAgMCAxMDAuMDAwMDUgMTAwLjAwMDA2IgogICB2ZXJzaW9uPSIxLjEiCiAgIGlkPSJzdmcxIgogICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxkZWZzCiAgICAgaWQ9ImRlZnMxIiAvPgogIDxnCiAgICAgaWQ9ImxheWVyMSIKICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtODkuNTI0OTc3LC0zNS42MzI2MDUpIj4KICAgIDxyZWN0CiAgICAgICBzdHlsZT0iZmlsbDojZmZmZmZmO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTojZmZmZmZmO3N0cm9rZS13aWR0aDowLjI4MjEzNztzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSIKICAgICAgIGlkPSJyZWN0MS04IgogICAgICAgd2lkdGg9IjMxLjEyMTQyOSIKICAgICAgIGhlaWdodD0iMTguNTYwMDA3IgogICAgICAgeD0iLTE3NC43NzIyMyIKICAgICAgIHk9Ijc0LjQxNzAyMyIKICAgICAgIHRyYW5zZm9ybT0ibWF0cml4KC0wLjcwNzEwMDA4LC0wLjcwNzExMzQ5LDAuNzA3MTAwMDgsLTAuNzA3MTEzNDksMCwwKSIgLz4KICAgIDxyZWN0CiAgICAgICBzdHlsZT0iZmlsbDojZmZmZmZmO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTojZmZmZmZmO3N0cm9rZS13aWR0aDowLjUxNDk0NTtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSIKICAgICAgIGlkPSJyZWN0MS04LTEiCiAgICAgICB3aWR0aD0iMzAuODg4NjI4IgogICAgICAgaGVpZ2h0PSI2Mi4yOTIxOTQiCiAgICAgICB4PSItMTc0LjY1NTg3IgogICAgICAgeT0iNS40NDUxNTA0IgogICAgICAgdHJhbnNmb3JtPSJtYXRyaXgoLTAuNzA3MTAwMDgsLTAuNzA3MTEzNDksMC43MDcxMDAwOCwtMC43MDcxMTM0OSwwLDApIiAvPgogICAgPHBhdGgKICAgICAgIHN0eWxlPSJmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOiNmZmZmZmY7c3Ryb2tlLXdpZHRoOjAuMDE7c3Ryb2tlLWxpbmVjYXA6c3F1YXJlO3N0cm9rZS1taXRlcmxpbWl0OjA7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjE7cGFpbnQtb3JkZXI6bWFya2VycyBzdHJva2UgZmlsbCIKICAgICAgIGlkPSJwYXRoNCIKICAgICAgIGQ9Im0gNzQuMzU4OTk5LDEzMy44ODE1OSAtMS4yNzY3NzUsMCAwLjYzODM4OCwtMS4xMDU3MiB6IgogICAgICAgdHJhbnNmb3JtPSJtYXRyaXgoLTE3LjI0NDI0MiwtMTcuMjQ0NTcsMTkuODY3Mjg2LC0xOS44Njc2NjMsLTEyNzYuOTkwOCw0MDQ0LjczNDgpIiAvPgogIDwvZz4KPC9zdmc+Cg==";
  class SettingsOption {
    name;
    state;
    changeTime;
    screenPosition;
    _tooltipIcon;
    /**
     * A legacy field that is used for the settings menu to handle
     * {@linkcode BooleanOption BooleanOptions}.
     */
    toggleFn;
    constructor(name, tooltip) {
      this.name = name;
      if (!isNil(tooltip)) {
        this._tooltipIcon = new TooltipIcon(tooltip);
      }
      this.changeTime = 0;
      this.screenPosition = { x: 0, y: 0, w: 0, h: 0 };
      this.state = void 0;
      this.toggleFn = () => {
      };
    }
    get tooltipIcon() {
      return settings.get("settingsTooltips") ? this._tooltipIcon : void 0;
    }
    /**
     * The position of the centre of the ? tooltip icon for this option.
     */
    get tooltipPos() {
      ctx.font = "900 17px Ubuntu";
      return {
        x: this.screenPosition.x + SETTINGS_BUTTON_SIZE + SETTINGS_BUTTON_PADDING * 2 + ctx.measureText(this.name).width + TOOLTIP_ICON_SIZE / 2,
        y: this.screenPosition.y + SETTINGS_BUTTON_SIZE / 2
      };
    }
    /**
     * @returns `true` iff this is a {@linkcode SettingsSectionHeading}.
     */
    isSectionHeading() {
      return false;
    }
    /**
     * @returns `true` iff this is a {@linkcode BooleanOption}.
     */
    isBooleanOption() {
      return false;
    }
    /**
     * @returns `true` iff this is a {@linkcode DisplayValueOption}.
     */
    isDisplayValueOption() {
      return false;
    }
    /**
     * Determines whether or not the given mouse coordinates are inside this
     * option's button.
     */
    mouseInButton(e) {
      return mouseInBox(e, this.screenPosition);
    }
    /**
     * Draws this option's tooltip icon.
     */
    drawTooltipIcon() {
      this.tooltipIcon?.drawIcon(this.tooltipPos);
    }
    /**
     * Draws this option's tooltip box.
     */
    drawTooltipBox(e) {
      this.tooltipIcon?.drawText(this.tooltipPos, e);
    }
    /**
     * Updates the text for this setting's tooltip.
     */
    updateTooltip() {
      this._tooltipIcon?.tooltipBox?.generateDesc();
    }
  }
  class BooleanOption extends SettingsOption {
    state;
    constructor(name, settingsKey, tooltip) {
      super(name, tooltip);
      this.state = settings.get(settingsKey);
      this.toggleFn = (state) => {
        settings.set(settingsKey, state);
      };
    }
    isBooleanOption() {
      return true;
    }
  }
  class DisplayValueOption extends SettingsOption {
    constructor(name, tooltip) {
      super(name + ": ", tooltip);
    }
    get tooltipPos() {
      let { x, y } = super.tooltipPos;
      for (let text of this.getDisplayedValues()) {
        x += ctx.measureText(text).width;
      }
      return { x, y };
    }
    /**
     * Returns this setting's name without any ": " formatting.
     */
    get simpleName() {
      return this.name.replaceAll(": ", "");
    }
    isDisplayValueOption() {
      return true;
    }
    /**
     * @returns `true` iff this is a {@linkcode ColourOption}.
     */
    isColourOption() {
      return false;
    }
    /**
     * Processes `originalColour` to make it flash white if the user has edited
     * this setting within the past 1.5s.
     */
    getFlashColour(originalColour) {
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
    getValueFillStyles() {
      return [this.getFlashColour(SETTINGS_GREEN)];
    }
    /**
     * Determines the displayed values, with formatting if necessary.
     */
    getDisplayedValues() {
      return ["" + this.state];
    }
    /**
     * Draws this option inside the given settings menu.
     * 
     * This code is largely adapted from Flowr's base code.
     */
    draw(menu) {
      this.screenPosition = {
        x: 15 + menu.x,
        y: menu.midHeight - SETTINGS_BUTTON_SIZE / 2 + menu.y,
        w: SETTINGS_BUTTON_SIZE,
        h: SETTINGS_BUTTON_SIZE
      };
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
      ctx.drawImage(
        editIcon,
        15 + SETTINGS_BUTTON_SIZE / 2 - EDIT_ICON_SIZE / 2,
        menu.midHeight - EDIT_ICON_SIZE / 2,
        EDIT_ICON_SIZE,
        EDIT_ICON_SIZE
      );
      ctx.font = "900 17px Ubuntu";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.strokeText(
        this.name,
        15 + SETTINGS_BUTTON_SIZE + SETTINGS_BUTTON_PADDING,
        menu.midHeight
      );
      ctx.fillText(
        this.name,
        15 + SETTINGS_BUTTON_SIZE + SETTINGS_BUTTON_PADDING,
        menu.midHeight
      );
      const prevTextWidth = ctx.measureText(this.name).width;
      let currentX = 15 + SETTINGS_BUTTON_SIZE + SETTINGS_BUTTON_PADDING + prevTextWidth;
      for (let i = 0; i < this.getDisplayedValues().length; i++) {
        const text = this.getDisplayedValues()[i];
        ctx.fillStyle = this.getValueFillStyles()[i];
        ctx.strokeText(text, currentX, menu.midHeight);
        ctx.fillText(text, currentX, menu.midHeight);
        currentX += ctx.measureText(text).width;
      }
      if (this.isColourOption() && !this.editingState) {
        ctx.strokeStyle = "black";
        ctx.fillStyle = this.state;
        ctx.lineWidth = 2;
        currentX += 10;
        ctx.fillRect(currentX, menu.midHeight - 10, 20, 20);
        ctx.strokeRect(currentX, menu.midHeight - 10, 20, 20);
      }
      menu.currentHeight += SETTINGS_OPTION_HEIGHT;
    }
  }
  class ColourOption extends DisplayValueOption {
    state;
    settingsKey;
    /**
     * Whether or not the player is currently editing this setting.
     */
    editingState;
    constructor(name, settingsKey, tooltip) {
      super(name, tooltip);
      this.state = settings.get(settingsKey);
      this.settingsKey = settingsKey;
      this.editingState = false;
    }
    isColourOption() {
      return true;
    }
    getDisplayedValues() {
      if (this.editingState) {
        return [this.state, " (Editing...)"];
      } else {
        return [this.state];
      }
    }
    getValueFillStyles() {
      const colour1 = this.getFlashColour(SETTINGS_GREEN);
      if (this.editingState) {
        return [colour1, CINDER_COLOUR];
      } else {
        return [colour1];
      }
    }
    onClick(menu) {
      if (!this.editingState) {
        menu.setCurrentColourOption(this);
        this.editingState = true;
      } else {
        menu.cancelColourOption();
      }
    }
    /**
     * Saves the given colour to the settings.
     */
    saveColour(newColour) {
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
    finishEdit() {
      this.editingState = false;
    }
  }
  class NumberOption extends DisplayValueOption {
    state;
    settingsKey;
    minValue;
    maxValue;
    /**
     * The number of decimal digits that this setting's value is rounded to.
     */
    decimalDigits;
    constructor(name, settingsKey, minValue, maxValue, decimalDigits, tooltip) {
      super(name, tooltip);
      this.minValue = minValue;
      this.maxValue = maxValue;
      this.decimalDigits = decimalDigits;
      this.state = settings.get(settingsKey);
      this.settingsKey = settingsKey;
    }
    onClick() {
      send({ attack: false });
      const rawValue = parseFloat(prompt(
        `You are editing the setting "${this.simpleName}".

Please enter a number between ${this.minValue} and ${this.maxValue}.`
      ) ?? "");
      if (rawValue >= this.minValue && rawValue <= this.maxValue) {
        const value = parseFloat(rawValue.toFixed(this.decimalDigits));
        this.changeTime = performance.now();
        this.state = value;
        settings.set(this.settingsKey, value);
      } else {
        alert(
          `Error: ${rawValue} is not a number between ${this.minValue} and ${this.maxValue}!`
        );
      }
    }
  }
  class RarityOption extends DisplayValueOption {
    state;
    settingsKey;
    constructor(name, settingsKey, tooltip) {
      super(name, tooltip);
      this.state = settings.get(settingsKey);
      this.settingsKey = settingsKey;
    }
    getValueFillStyles() {
      return [
        this.getFlashColour(Colors.rarities[this.state].color),
        this.getFlashColour(SETTINGS_GREEN)
      ];
    }
    getDisplayedValues() {
      return [Colors.rarities[this.state].name, ` (${this.state})`];
    }
    onClick() {
      send({ attack: false });
      const response = prompt(
        `You are editing the setting "${this.simpleName}".

Please enter a Rarity.`
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
  class KeybindOption extends DisplayValueOption {
    state;
    settingsKey;
    /**
     * Whether or not the player is currently editing this setting.
     */
    editingState;
    /**
     * A timeout for cancelling an edit for this setting.
     */
    editingStateTimeout;
    constructor(name, settingsKey, tooltip) {
      super(name, tooltip);
      this.state = settings.get(settingsKey);
      this.settingsKey = settingsKey;
      this.editingState = false;
    }
    getDisplayedValues() {
      if (this.editingState) {
        return [this.state, " (Editing...)"];
      } else {
        return [this.state];
      }
    }
    getValueFillStyles() {
      const colour1 = this.getFlashColour(
        this.state === KEYBIND_DELETED ? "#afafaf" : SETTINGS_GREEN
      );
      if (this.editingState) {
        return [colour1, CINDER_COLOUR];
      } else {
        return [colour1];
      }
    }
    onClick(menu) {
      if (!this.editingState) {
        menu.setCurrentKeybindOption(this);
        this.editingState = true;
        this.editingStateTimeout = setTimeout(() => {
          menu.cancelKeybind();
        }, 3e3);
      } else {
        menu.cancelKeybind();
      }
    }
    /**
     * Ends this option's editing state, and sets the setting to the new keybind
     * if given.
     */
    finishEdit(newKeybind) {
      clearTimeout(this.editingStateTimeout);
      this.editingState = false;
      this.editingStateTimeout = void 0;
      if (!isNil(newKeybind)) {
        this.changeTime = performance.now();
        this.state = newKeybind;
        settings.set(this.settingsKey, newKeybind);
      }
    }
  }
  class SettingsSectionHeading {
    text;
    tooltipPos;
    _tooltipIcon;
    constructor(text, tooltip) {
      this.text = text;
      if (!isNil(tooltip)) {
        this._tooltipIcon = new TooltipIcon(tooltip);
      }
      this.tooltipPos = { x: 0, y: 0 };
    }
    get tooltipIcon() {
      return settings.get("settingsTooltips") ? this._tooltipIcon : void 0;
    }
    /**
     * @returns `true` iff this is a {@linkcode SettingsSectionHeading}.
     */
    isSectionHeading() {
      return true;
    }
    /**
     * Draws this header inside the given settings menu.
     * 
     * This code is adapted from the Flowr changelog's horizontal dividers.
     */
    draw(menu) {
      ctx.font = "900 17px Ubuntu";
      const textWidth = ctx.measureText(this.text).width;
      let textLeftPos = menu.w / 2 - textWidth / 2;
      let textRightPos = menu.w / 2 + textWidth / 2;
      if (!isNil(this.tooltipIcon)) {
        const extraSpace = TOOLTIP_ICON_SIZE + SETTINGS_BUTTON_PADDING;
        textLeftPos -= extraSpace / 2;
        textRightPos += extraSpace / 2;
        this.tooltipPos = {
          x: menu.x + textRightPos - TOOLTIP_ICON_SIZE / 2,
          y: menu.y + menu.midHeight
        };
      }
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.strokeText(this.text, textLeftPos, menu.midHeight);
      ctx.fillText(this.text, textLeftPos, menu.midHeight);
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
      ctx.lineTo(menu.w - SETTINGS_BUTTON_PADDING - 16, menu.midHeight);
      ctx.stroke();
      ctx.closePath();
      menu.currentHeight += SETTINGS_OPTION_HEIGHT;
    }
    /**
     * Draws this section's tooltip icon.
     */
    drawTooltipIcon() {
      this.tooltipIcon?.drawIcon(this.tooltipPos);
    }
    /**
     * Draws this section's tooltip box.
     */
    drawTooltipBox(e) {
      this.tooltipIcon?.drawText(this.tooltipPos, e);
    }
  }
  class CinderSettingsMenu extends SettingsMenu {
    /**
     * The {@linkcode KeybindOption} currently being edited, if applicable.
     */
    currentKeybindOption;
    /**
     * The {@linkcode ColourOption} currently being edited, if applicable.
     */
    currentColourOption;
    /**
     * The {@linkcode ColourSelectorUi} that is used for editing this menu's
     * {@linkcode ColourOption ColourOptions}.
     */
    colourSelectorUi;
    /**
     * The timestamp for the most recent time that the player used a mouse wheel
     * input to scroll this menu.
     */
    lastMouseWheelTime;
    _scroll;
    /**
     * The vertical offset of the mouse from the scrollbar's centre if the user
     * is currently dragging the scrollbar, or `undefined` if the user is not
     * dragging the scrollbar.
     */
    draggingScrollbarOffset;
    /**
     * The total height of this menu's contents, equal to
     * {@linkcode SETTINGS_OPTION_HEIGHT} times `this.options.length`.
     */
    totalHeight;
    /**
     * The position of the in-game settings button outside the main menu.
     * 
     * Having one html + css settings button and another manually drawn settings
     * button is very spaghetti, but it is what it is.
     */
    inRunSettingsButton;
    /**
     * The gear icon for the in-run settings menu button.
     */
    settingsImage;
    constructor() {
      super();
      this.lastMouseWheelTime = time - 1e4;
      this._scroll = 0;
      this.draggingScrollbarOffset = void 0;
      initOptions({
        invertAttack: new BooleanOption("Invert Attack", "invertAttack"),
        invertDefend: new BooleanOption("Invert Defend", "invertDefend"),
        hideSettingsDuringRuns: new BooleanOption(
          "Hide Settings Menu During Runs",
          "hideSettingsDuringRuns"
        ),
        craftingSearchBar: new BooleanOption(
          "Crafting Search Bar",
          "craftingSearchBar"
        ),
        craftAnimationLength: new NumberOption(
          "Crafting Animation Length (seconds)",
          "craftAnimationLength",
          0,
          5,
          2,
          `The base game's default is $c${SETTINGS_GREEN} 3 $cwhite seconds. The crafting animation may run on for longer while the server is processing the craft request.`
        ),
        autoCopyCodes: new BooleanOption(
          "Auto Copy Squad Codes",
          "autoCopyCodes",
          "If this is turned on and you generate a random squad code, it automatically copies the squad code to your clipboard."
        ),
        allowLockSlotsOneToFive: new BooleanOption(
          "Allow Locking Petal Slots 1 to 5",
          "allowLockSlotsOneToFive",
          "Tip: It is recommended not to lock petal slots 1 to 5, since the Plastic boss's Mania could force you to swap those slots."
        ),
        settingsTooltips: new BooleanOption(
          "Settings Tooltips",
          "settingsTooltips"
        ),
        petalCraftPreview: new BooleanOption(
          "Petal Craft Preview",
          "petalCraftPreview"
        ),
        inventoryExpandButton: new BooleanOption(
          "Inventory Expansion Button",
          "inventoryExpandButton"
        ),
        petalLockShakeIntensity: new NumberOption(
          "Petal Lock Shake Intensity",
          "petalLockShakeIntensity",
          0,
          3,
          2
        ),
        missileDrawPriority: new BooleanOption(
          "Missile Rendering Priority",
          "missileDrawPriority",
          {
            fn: () => {
              if (isNil(flowrMod)) {
                return "If turned on, all enemy missiles will be rendered above all actual enemies.";
              } else {
                return "Since you have installed some variant of Flowrscript (which handles this feature automatically), this setting does not affect anything.";
              }
            },
            dependentKeys: []
          }
        ),
        gardenBackground: new ColourOption(
          "Garden Background Colour",
          "gardenBackground"
        ),
        desertBackground: new ColourOption(
          "Desert Background Colour",
          "desertBackground"
        ),
        oceanBackground: new ColourOption(
          "Ocean Background Colour",
          "oceanBackground"
        ),
        savannaBackground: new ColourOption(
          "Savanna Background Colour",
          "savannaBackground"
        ),
        swampBackground: new ColourOption(
          "Swamp Background Colour",
          "swampBackground"
        ),
        zooBackground: new ColourOption(
          "Zoo Background Colour",
          "zooBackground"
        ),
        deepZooBackground: new ColourOption(
          "Deep Zoo Background Colour",
          "deepZooBackground"
        ),
        baseReciprocalOfFOV: new NumberOption(
          "Base Zoom Out",
          "baseReciprocalOfFOV",
          0.33,
          5,
          2
        ),
        playerHpBarScale: new NumberOption(
          "Player HP Bar Scale",
          "playerHpBarScale",
          0.5,
          5,
          2
        ),
        specialDropsScale: new NumberOption(
          "Special Drops Scale",
          "specialDropsScale",
          1,
          5,
          2,
          {
            fn: () => `For this setting, a drop is considered 'Special' if it is worth at least $c${SETTINGS_GREEN} ${settings.get("specialDropsQuantity")} $c${Colors.rarities[settings.get("specialDropsRarity")].color} ${Colors.rarities[settings.get("specialDropsRarity")].name} $cwhite ${settings.get("specialDropsQuantity") === 1 ? "petal" : "petals"}, as configured below.`,
            dependentKeys: ["specialDropsRarity", "specialDropsQuantity"]
          }
        ),
        specialDropsRarity: new RarityOption(
          "Special Drops Threshold",
          "specialDropsRarity"
        ),
        specialDropsQuantity: new NumberOption(
          "Special Drops Threshold Amount",
          "specialDropsQuantity",
          0.1,
          999,
          1
        ),
        disableAllOptimizations: new BooleanOption(
          "Disable All Optimizations",
          "disableAllOptimizations",
          "Turning this setting ON will disable ALL of this script's optimizations, including the ones configured below. It is strongly recommended to leave this setting OFF, unless it causes unexpected rendering issues."
        ),
        petalStarCaching: new BooleanOption(
          "Petal Star Caching",
          "petalStarCaching",
          "This setting affects the stars that travel across fancy petal backgrounds. Turning this setting OFF will allow stars to twinkle independently of each other, but at a performance cost. "
        ),
        disablePetalStars: new BooleanOption(
          "Disable Petal Stars",
          "disablePetalStars"
        ),
        disablePetalAnimations: new BooleanOption(
          "Disable Petal Animations",
          "disablePetalAnimations",
          "This setting disables animations for all petals displayed inside petal containers. All fancy petal backgrounds still remain enabled."
        ),
        petalRenderQualityThreshold: new NumberOption(
          "Petal Rendering Quality Threshold",
          "petalRenderQualityThreshold",
          -1,
          1e3,
          0,
          "This setting controls how many petals can be on-screen at the same time before the base game's High Quality Renders get disabled to reduce lag. $n $n Set to -1 to keep High Quality Renders enabled at all times."
        ),
        keybindInvertAttack: new KeybindOption(
          "Invert Attack",
          "keybindInvertAttack"
        ),
        keybindInvertDefend: new KeybindOption(
          "Invert Defend",
          "keybindInvertDefend"
        ),
        keybindStatsBox: new KeybindOption(
          "Quick Stats Box",
          "keybindStatsBox",
          "This hotkey toggles the stats box of the highest-rarity mob currently alive in your room."
        ),
        keybindLockSlot: new KeybindOption(
          "Lock Petal Slot",
          "keybindLockSlot",
          "You can lock/unlock petal slots while holding down this key. When a slot is locked, you cannot swap it with its bottom petal until you unlock it. $n $n By default, you cannot lock petal slots 1 to 5. You can change this behaviour at Settings > General Gameplay > Allow Locking Petal Slots 1 to 5."
        )
      });
      this.h = 11.7 * SETTINGS_OPTION_HEIGHT;
      this.w = 480;
      this.inRunSettingsButton = {
        x: isNil(flowrMod) ? 75 : 140,
        y: 10,
        w: 45,
        h: 45
      };
      this.options = Object.freeze([
        new SettingsSectionHeading("General Gameplay"),
        settingsMap.invertAttack,
        settingsMap.invertDefend,
        settingsMap.hideSettingsDuringRuns,
        settingsMap.craftingSearchBar,
        settingsMap.craftAnimationLength,
        settingsMap.autoCopyCodes,
        settingsMap.allowLockSlotsOneToFive,
        new SettingsSectionHeading("General Display"),
        settingsMap.settingsTooltips,
        settingsMap.petalCraftPreview,
        settingsMap.inventoryExpandButton,
        settingsMap.petalLockShakeIntensity,
        settingsMap.missileDrawPriority,
        new SettingsSectionHeading("Background Colours"),
        settingsMap.gardenBackground,
        settingsMap.desertBackground,
        settingsMap.oceanBackground,
        settingsMap.savannaBackground,
        settingsMap.swampBackground,
        settingsMap.zooBackground,
        settingsMap.deepZooBackground,
        new SettingsSectionHeading("Zoom Settings"),
        settingsMap.baseReciprocalOfFOV,
        settingsMap.playerHpBarScale,
        settingsMap.specialDropsScale,
        settingsMap.specialDropsRarity,
        settingsMap.specialDropsQuantity,
        new SettingsSectionHeading("Performance"),
        settingsMap.disableAllOptimizations,
        settingsMap.petalStarCaching,
        settingsMap.disablePetalAnimations,
        settingsMap.disablePetalStars,
        settingsMap.petalRenderQualityThreshold,
        new SettingsSectionHeading(
          "Keybinds",
          "To edit a keybind, click its 'Edit' button and then enter a new key to bind it to. You can also delete a keybind by pressing the 'Delete' key on your keyboard. $n $n Caution: If you set multiple keybinds to the same key, all of your keybinds will still remain active!"
        ),
        settingsMap.keybindInvertAttack,
        settingsMap.keybindInvertDefend,
        settingsMap.keybindStatsBox,
        settingsMap.keybindLockSlot
      ]);
      this.totalHeight = SETTINGS_OPTION_HEIGHT * this.options.length;
      const originalOnMouseDown = _unsafeWindow.onmousedown;
      _unsafeWindow.onmousedown = (e) => {
        originalOnMouseDown?.apply(_unsafeWindow, [e]);
        if (_unsafeWindow.connected === true) {
          this.mouseDown({ x: mouse.canvasX, y: mouse.canvasY });
        }
      };
      const originalOnMouseUp = _unsafeWindow.onmouseup;
      _unsafeWindow.onmouseup = (e) => {
        originalOnMouseUp?.apply(_unsafeWindow, [e]);
        if (_unsafeWindow.connected === true) {
          this.mouseUp();
        }
      };
      this.settingsImage = new Image(35, 35);
      this.settingsImage.src = `gfx/gear.png?v=${ver}`;
      this.settingsImage.draggable = false;
      const originalRenderMenu = renderMenu;
      renderMenu = (dt2) => {
        originalRenderMenu(dt2);
        this.x = 110;
        this.draw();
      };
      const originalRenderGame = renderGame;
      renderGame = (dt2) => {
        originalRenderGame(dt2);
        if (_unsafeWindow.state === "game" && !settings.get("hideSettingsDuringRuns")) {
          this.drawInRunButton();
          this.draw();
        }
      };
      document.addEventListener("wheel", (e) => {
        this.mouseScroll(e);
      });
      this.colourSelectorUi = new ColourSelectorUi(this);
    }
    /**
     * The y-position at the midpoint of the option currently being rendered.
     */
    get midHeight() {
      return this.currentHeight + SETTINGS_OPTION_HEIGHT / 2;
    }
    /**
     * How much the menu's contents are currently shifted due to scrolling.
     */
    get scroll() {
      return this._scroll;
    }
    set scroll(val) {
      this._scroll = Math.min(Math.max(val, 0), this.totalHeight + 10 - this.h);
    }
    /**
     * The ratio of scrollbar movement to actual content movement.
     */
    get scrollbarRatio() {
      return (this.h - 2 * SETTINGS_SCROLLBAR_MIN_POS) / (this.totalHeight + 10 - this.h);
    }
    /**
     * The vertical position of the centre of this menu's scrollbar.
     */
    get scrollbarPos() {
      return this.scroll * this.scrollbarRatio + SETTINGS_SCROLLBAR_MIN_POS;
    }
    set scrollbarPos(pos) {
      if (!isNil(this.draggingScrollbarOffset)) {
        this.scroll = (pos - SETTINGS_SCROLLBAR_MIN_POS - this.y - this.offset) / this.scrollbarRatio;
      }
    }
    // TODO: Make the scroll translation code less spaghetti
    /**
     * The main function to draw this menu.
     */
    draw() {
      this.offset = interpolate(this.offset, this.targetOffset, 0.3);
      if (!isNil(this.draggingScrollbarOffset)) {
        this.scrollbarPos = mouse.canvasY - this.draggingScrollbarOffset;
      }
      ctx.save();
      ctx.translate(this.x, this.renderY);
      ctx.beginPath();
      ctx.roundRect(0, 0, this.w, this.h, 3);
      ctx.clip();
      ctx.closePath();
      ctx.fillStyle = SETTINGS_GRAY;
      ctx.beginPath();
      ctx.roundRect(0, 0, this.w, this.h, 3);
      ctx.fill();
      ctx.closePath();
      ctx.strokeStyle = "#7f7f7f";
      ctx.lineWidth = 8;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(this.w - 16, this.scrollbarPos - SCROLLBAR_LENGTH / 2);
      ctx.lineTo(this.w - 16, this.scrollbarPos + SCROLLBAR_LENGTH / 2);
      ctx.stroke();
      ctx.closePath();
      if (this.active && (this.mouseOnScrollbar() || !isNil(this.draggingScrollbarOffset))) {
        setCursor("pointer");
      }
      ctx.beginPath();
      ctx.roundRect(0, 0, this.w, this.h, 3);
      ctx.clip();
      ctx.closePath();
      ctx.translate(0, -this.scroll);
      const e = { x: mouse.canvasX, y: mouse.canvasY + this.scroll };
      if (!this.active || !this.mouseInMenu()) {
        e.x = e.y = -Infinity;
      }
      this.currentHeight = 5;
      for (let option of this.options) {
        this.renderOption(option);
      }
      ctx.translate(-this.x, -this.y);
      for (let option of this.options) {
        option.drawTooltipIcon();
      }
      if (this.active && this.mouseInMenu()) {
        for (let option of this.options) {
          if (!option.isSectionHeading()) {
            if (option.mouseInButton(e)) {
              setCursor("pointer");
            }
          }
        }
      }
      ctx.restore();
      ctx.strokeStyle = SETTINGS_GRAY_BORDER;
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.roundRect(this.x, this.renderY, this.w, this.h, 3);
      ctx.stroke();
      ctx.closePath();
      ctx.translate(0, -this.scroll);
      for (let option of this.options) {
        option.drawTooltipBox(e);
      }
      ctx.translate(0, this.scroll);
      this.colourSelectorUi.draw();
    }
    /**
     * Renders the given {@linkcode SettingsOption}. Each type of option is
     * rendered differently.
     */
    renderOption(option) {
      if (option.isSectionHeading()) {
        option.draw(this);
      } else if (option.isBooleanOption()) {
        this.renderToggle(option);
      } else if (option.isDisplayValueOption()) {
        option.draw(this);
      }
    }
    /**
     * Draws this menu's in-run settings menu button during runs.
     * 
     * This function also handles moving the settings menu to the right of the
     * in-run menu button.
     */
    drawInRunButton() {
      ctx.lineWidth = 5;
      ctx.strokeStyle = CINDER_BORDER_COLOUR;
      ctx.fillStyle = CINDER_COLOUR;
      if (this.mouseOnInRunButton()) {
        setCursor("pointer");
        ctx.fillStyle = LIGHT_CINDER_COLOUR;
      }
      ctx.beginPath();
      ctx.roundRect(
        this.inRunSettingsButton.x,
        this.inRunSettingsButton.y,
        this.inRunSettingsButton.w,
        this.inRunSettingsButton.h,
        6
      );
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
      ctx.drawImage(
        this.settingsImage,
        this.inRunSettingsButton.x,
        this.inRunSettingsButton.y,
        this.inRunSettingsButton.w,
        this.inRunSettingsButton.h
      );
      this.x = this.inRunSettingsButton.x + 65;
    }
    /**
     * Processes the user clicking on the settings menu. Each type of option is
     * processed differently. This code is adapted from Flowr's client code.
     */
    mouseDown(e) {
      if (this.mouseOnInRunButton()) {
        this.toggle();
      }
      if (!this.mouseInMenu()) {
        if (this.active && _unsafeWindow.state !== "menu" && !this.mouseOnInRunButton()) {
          this.toggle();
        }
        return;
      }
      if (!this.active) {
        return;
      }
      if (_unsafeWindow.state !== "menu" && settings.get("hideSettingsDuringRuns")) {
        return;
      }
      this.colourSelectorUi.mouseDown();
      if (this.mouseOnScrollbar()) {
        this.draggingScrollbarOffset = mouse.canvasY - (this.renderY + this.scrollbarPos);
      }
      e.y += this.scroll;
      for (let option of this.options) {
        if (!option.isSectionHeading()) {
          if (option.mouseInButton(e)) {
            if (option.isBooleanOption()) {
              this.processToggle(option, e);
            } else if (option.isDisplayValueOption()) {
              option.onClick(this);
            }
          }
        }
      }
    }
    /**
     * Precesses the user releasing a mouse click.
     */
    mouseUp() {
      this.draggingScrollbarOffset = void 0;
      this.colourSelectorUi.mouseUp();
    }
    /**
     * Scrolls this menu up/down in response to a mouse wheel input.
     * 
     * This does not handle the player dragging the scrollbar.
     */
    mouseScroll(e) {
      if (this.active && this.mouseInPrimaryMenu()) {
        this.scroll += e.deltaY / 2;
        this.lastMouseWheelTime = time;
      }
    }
    /**
     * Returns `true` iff this menu received a mouse wheel scroll input within
     * the past 250ms.
     */
    hasRecentMouseScroll() {
      return performance.now() - this.lastMouseWheelTime < 250;
    }
    toggle() {
      super.toggle();
      if (!this.active) {
        this.cancelKeybind();
        this.cancelColourOption();
        this.mouseUp();
      }
    }
    /**
     * Sets a {@linkcode ColourOption} to be edited, and cancel the previous
     * colour option if applicable.
     * 
     * This function also handles setting {@linkcode colourSelectorUi} to be
     * editing the new colour option, if it exists.
     */
    setCurrentColourOption(option) {
      if (!isNil(this.currentColourOption)) {
        this.currentColourOption.finishEdit();
      }
      if (this.colourSelectorUi.active && _unsafeWindow.state === "menu") {
        this.colourSelectorUi.saveBeforeClosingPrompt();
      }
      this.currentColourOption = option;
      if (!isNil(this.currentColourOption)) {
        this.colourSelectorUi.active = true;
        this.colourSelectorUi.setColour(this.currentColourOption.state);
        this.colourSelectorUi.setDefaultColour(
          settings.getDefault(this.currentColourOption.settingsKey)
        );
      } else {
        this.colourSelectorUi.active = false;
      }
    }
    /**
     * Cancels editing the current colour option.
     */
    cancelColourOption() {
      this.setCurrentColourOption(void 0);
    }
    /**
     * Saves the given colour to the currently edited colour option.
     */
    saveColour(colour) {
      this.currentColourOption?.saveColour(colour);
    }
    /**
     * Sets a {@linkcode KeybindOption} to be edited, and cancel the previous
     * keybind option if applicable.
     */
    setCurrentKeybindOption(option) {
      if (!isNil(this.currentKeybindOption)) {
        this.currentKeybindOption.finishEdit();
      }
      this.currentKeybindOption = option;
    }
    /**
     * Cancels editing the current keybind option.
     */
    cancelKeybind() {
      this.setCurrentKeybindOption(void 0);
    }
    /**
     * Checks whether the mouse is inside this menu, excluding its colour
     * selector UI.
     */
    mouseInPrimaryMenu() {
      return mouseInBox(
        { x: mouse.canvasX, y: mouse.canvasY },
        { x: this.x + 4, y: this.renderY + 4, w: this.w - 8, h: this.h - 8 }
      );
    }
    /**
     * Checks whether the mouse is inside this menu (including its colour
     * selector UI), excluding its borders.
     */
    mouseInMenu() {
      return this.mouseInPrimaryMenu() || this.colourSelectorUi.mouseInMenu();
    }
    /**
     * Checks whether the mouse is hovering over this menu's scrollbar.
     */
    mouseOnScrollbar() {
      return mouseInBox(
        { x: mouse.canvasX, y: mouse.canvasY },
        {
          x: this.x + this.w - 24,
          y: this.renderY + this.scrollbarPos - SCROLLBAR_LENGTH / 2,
          w: 16,
          h: SCROLLBAR_LENGTH
        }
      );
    }
    /**
     * Checks whether the mouse is on the in-run settings menu button.
     * 
     * Note: If we are currently in the main menu, then the in-run settings
     * button is disabled, so this function returns `false`.
     */
    mouseOnInRunButton() {
      return _unsafeWindow.state === "game" && mouseInBox(
        { x: mouse.canvasX, y: mouse.canvasY },
        this.inRunSettingsButton
      );
    }
  }
  let cinderSettingsMenu;
  function initSettingsMenu() {
    cinderSettingsMenu = new CinderSettingsMenu();
  }
  let MENU_LIST;
  function initMenuList() {
    const rawList = [
      settingsMenu,
      changelog,
      cinderSettingsMenu,
      cinderChangelog,
      globalInventory,
      craftingMenu,
      mobGallery
    ];
    if (!isNil(flowrMod)) {
      rawList.push(
        shop,
        flowrMod.flowrSettingsMenu,
        flowrMod.petalGallery
      );
    }
    MENU_LIST = Object.freeze(rawList);
  }
  function isNil(arg) {
    return arg === void 0 || arg === null;
  }
  function chatAnnounce(msg, color = CINDER_COLOUR) {
    chatDiv.classList.remove("hidden");
    appendChatAnnouncement("[Cinder]: " + msg, color);
  }
  const theoryCraft = [];
  function convertPetalValue(amount, oldRarity, newRarity) {
    if (oldRarity > MAX_PETAL_RARITY) {
      return Infinity;
    }
    if (newRarity > MAX_PETAL_RARITY) {
      return 0;
    }
    while (oldRarity < newRarity) {
      amount /= theoryCraft[oldRarity];
      oldRarity++;
    }
    while (oldRarity > newRarity) {
      amount *= theoryCraft[oldRarity - 1];
      oldRarity--;
    }
    return amount;
  }
  function rarityToIndex(rarity) {
    const ret = Rarity[rarity.toUpperCase()];
    if (isNil(ret)) {
      return void 0;
    } else if (!isNaN(Number(rarity))) {
      return Number(rarity);
    } else {
      return ret;
    }
  }
  function deepCopy(obj, depth = 5) {
    if (depth === 0) {
      return obj;
    }
    if (obj === null) {
      return obj;
    }
    if (typeof obj === "object") {
      try {
        if (Array.isArray(obj)) {
          return obj.map((item) => deepCopy(item, depth - 1));
        } else {
          const ret = Object.create(Object.getPrototypeOf(obj));
          for (let key in obj) {
            ret[key] = deepCopy(obj[key], depth - 1);
          }
          return ret;
        }
      } catch (e) {
        console.warn("Failed to copy:", obj);
        return obj;
      }
    } else {
      return obj;
    }
  }
  function isTopMenu(menu) {
    return Object.hasOwn(menu, "active");
  }
  function isShop(menu) {
    return menu.constructor === Shop;
  }
  function mouseOnMenu() {
    if (cinderSettingsMenu.mouseInMenu()) {
      return true;
    }
    if (_unsafeWindow.state !== "menu") {
      return false;
    }
    for (let menu of MENU_LIST) {
      if (mouseInBox(
        {
          x: mouse.canvasX,
          y: mouse.canvasY
        },
        {
          x: isTopMenu(menu) ? menu.x : 130,
          y: isShop(menu) ? menu.menu.y.val : menu.renderY,
          w: isShop(menu) ? 600 : menu.w,
          h: isShop(menu) ? 500 : menu.h
        }
      )) {
        return true;
      }
    }
    return false;
  }
  function ctxDrawText(...params) {
    ctx.strokeText(...params);
    ctx.fillText(...params);
  }
  function isHexCode(str) {
    return !isNil(str.match(new RegExp("^#[0-9a-fA-F]{6}$")));
  }
  function addScreenshotMode() {
    const originalRenderGame = renderGame;
    const originalOnMessage = ws.onmessage;
    const originalDeadMenuDraw = deadMenu.draw;
    const queuedMessages = [];
    let screenshotMode = false;
    let screenshotRoom;
    let runningRoom;
    function toggleScreenshotMode() {
      screenshotMode = !screenshotMode;
      if (screenshotMode) {
        deadMenu.draw = () => {
        };
        screenshotRoom = deepCopy(room);
        runningRoom = room;
        renderGame = (dt2) => {
          ws.onmessage = (data2) => {
            queuedMessages.push(data2);
          };
          chatDiv.classList.add("hidden");
          room = screenshotRoom;
          originalRenderGame(dt2);
          ctx.save();
          ctx.lineWidth = 6;
          ctx.font = "900 32px Ubuntu";
          ctx.textAlign = "right";
          ctx.textBaseline = "top";
          ctx.fillStyle = CINDER_COLOUR;
          ctx.strokeStyle = "black";
          const text = "Screenshot Mode";
          ctx.strokeText(text, canvas.w - 30, 30);
          ctx.fillText(text, canvas.w - 30, 30);
          ctx.restore();
          room = runningRoom;
          let data = queuedMessages.shift();
          while (!isNil(data)) {
            originalOnMessage?.apply(ws, [data]);
            data = queuedMessages.shift();
          }
          ws.onmessage = originalOnMessage;
        };
      } else {
        room = runningRoom;
        chatDiv.classList.remove("hidden");
        deadMenu.draw = originalDeadMenuDraw;
        renderGame = originalRenderGame;
        let data = queuedMessages.shift();
        while (!isNil(data)) {
          originalOnMessage?.apply(ws, [data]);
          data = queuedMessages.shift();
        }
        ws.onmessage = originalOnMessage;
      }
    }
    addKeybindInstruction({
      type: "localStorage",
      storageKey: "cinderDevScreenshotMode",
      fn: toggleScreenshotMode
    });
  }
  const version = "1.7.0";
  function addScriptVersionToDebugInfo() {
    const originalRenderDebug = renderDebug;
    renderDebug = () => {
      let baseDebugText = "";
      let baseDebugX = 0;
      let baseDebugY = 0;
      const originalFillText = ctx.fillText;
      ctx.fillText = function(text, x2, y2, maxWidth) {
        baseDebugText = text;
        baseDebugX = x2;
        baseDebugY = y2;
        originalFillText.apply(this, [text, x2, y2, maxWidth]);
      };
      originalRenderDebug();
      ctx.fillText = originalFillText;
      const versionText = `Cinderscript: v${version}, `;
      const x = baseDebugX - ctx.measureText(baseDebugText).width;
      const y = baseDebugY;
      ctx.fillStyle = LIGHT_CINDER_COLOUR;
      ctx.strokeText(versionText, x, y);
      ctx.fillText(versionText, x, y);
    };
  }
  function displayMobGalleryOutsideMenu() {
    mobGallery.activeOutsideMenu = false;
    addKeybindInstruction({
      type: "localStorage",
      storageKey: "cinderDevGalleryOutsideMenu",
      fn: toggleMobGalleryOutsideMenu
    });
    const originalRenderGame = renderGame;
    renderGame = function(dt2) {
      originalRenderGame(dt2);
      if (mobGallery.activeOutsideMenu && mobGallery.menuActive) {
        mobGallery.draw();
      }
    };
    const originalDraw = PetalContainer.prototype.draw;
    PetalContainer.prototype.draw = function(inGame, number) {
      const scrolledPos = {
        x: mobGallery.inventorySpace.x + mobGallery.scrollExcess.x * mobGallery.scroll.render.x,
        y: mobGallery.renderY + mobGallery.inventorySpace.y - mobGallery.y + mobGallery.scrollExcess.y * mobGallery.scroll.render.y
      };
      const petalPos = {
        x: this.render.x - this.render.w / 2,
        y: this.render.y - this.render.w / 2
      };
      if (this === mobGallery.rows[this.type]?.[this.rarity] && (petalPos.x > scrolledPos.x + mobGallery.inventorySpace.w || petalPos.x + this.render.w < scrolledPos.x || petalPos.y > scrolledPos.y + mobGallery.inventorySpace.h || petalPos.y + this.render.w < scrolledPos.y)) {
        this.updateInterpolate();
        return;
      }
      originalDraw.apply(this, [inGame, number]);
    };
    const originalDiscoverEnemy = addDiscoveredEnemy;
    addDiscoveredEnemy = function(type = "Ladybug", rarity = Rarity.COMMON) {
      if (!discoveredEnemies[type]?.[rarity]) {
        originalDiscoverEnemy(type, rarity);
      }
    };
  }
  function toggleMobGalleryOutsideMenu() {
    if (_unsafeWindow.state !== "game") {
      return;
    }
    if (mobGallery.menuActive && mobGallery.activeOutsideMenu) {
      mobGallery.activeOutsideMenu = false;
    } else {
      mobGallery.activeOutsideMenu = true;
    }
    if (mobGallery.menuActive !== mobGallery.activeOutsideMenu) {
      mobGallery.toggleMenu();
    }
  }
  let renderCounter = 0;
  let disableHqp = false;
  function autoReducePetalQuality() {
    _unsafeWindow._hqp = _unsafeWindow.hqp;
    Object.defineProperty(_unsafeWindow, "hqp", {
      get: function() {
        return this._hqp && (!disableHqp || settings.get("disableAllOptimizations"));
      },
      set: function(value) {
        this._hqp = value;
      }
    });
    if (!isNil(flowrMod)) {
      flowrMod._noFancy = flowrMod.noFancy;
      Object.defineProperty(flowrMod, "noFancy", {
        get: function() {
          return this._noFancy || disableHqp && !settings.get("disableAllOptimizations");
        },
        set: function(value) {
          this._noFancy = value;
        }
      });
    }
    const originalDrawPetal = PetalContainer.prototype.draw;
    PetalContainer.prototype.draw = function(inGame, number) {
      if (settings.get("disableAllOptimizations")) {
        originalDrawPetal.apply(this, [inGame, number]);
        return;
      }
      renderCounter++;
      originalDrawPetal.apply(this, [inGame, number]);
      if (exceededThreshold()) {
        disableHqp = true;
      }
    };
    const originalDraw = draw;
    draw = function() {
      if (settings.get("disableAllOptimizations")) {
        originalDraw();
        return;
      }
      renderCounter = 0;
      originalDraw();
      disableHqp = exceededThreshold();
    };
  }
  function exceededThreshold() {
    const threshold = settings.get("petalRenderQualityThreshold");
    return threshold >= 0 && renderCounter > threshold;
  }
  function handleBackgroundColourSettings() {
    Colors.biomes.garden.background = settings.get("gardenBackground");
    Colors.biomes.desert.background = settings.get("desertBackground");
    Colors.biomes.ocean.background = settings.get("oceanBackground");
    Colors.biomes.savanna.background = settings.get("savannaBackground");
    Colors.biomes.swamp.background = settings.get("swampBackground");
    Colors.biomes.zoo.background = settings.get("zooBackground");
    Colors.biomes.deepzoo.background = settings.get("deepZooBackground");
    settings.addListener("gardenBackground", (option) => {
      Colors.biomes.garden.background = option;
    });
    settings.addListener("desertBackground", (option) => {
      Colors.biomes.desert.background = option;
    });
    settings.addListener("oceanBackground", (option) => {
      Colors.biomes.ocean.background = option;
    });
    settings.addListener("savannaBackground", (option) => {
      Colors.biomes.savanna.background = option;
    });
    settings.addListener("swampBackground", (option) => {
      Colors.biomes.swamp.background = option;
    });
    settings.addListener("zooBackground", (option) => {
      Colors.biomes.zoo.background = option;
    });
    settings.addListener("deepZooBackground", (option) => {
      Colors.biomes.deepzoo.background = option;
    });
  }
  function addCraftingSearchBar() {
    craftingMenu.rawPetalContainers = { ...craftingMenu.petalContainers };
    craftingMenu.searchBarDimensions = {
      x: craftingMenu.inventorySpace.x + 4,
      // `inventorySpace` has not been translated yet
      y: craftingMenu.inventorySpace.y - 45 + 50,
      w: craftingMenu.inventorySpace.w - 8,
      h: 35
    };
    const craftSearch = document.createElement("input");
    craftSearch.className = petalsearch.className;
    craftSearch.type = "text";
    craftSearch.tabIndex = -2;
    craftSearch.maxLength = 20;
    craftSearch.autocomplete = "off";
    craftSearch.spellcheck = false;
    craftSearch.addEventListener("input", () => {
      craftingMenu.recalculateFilteredPetals();
    });
    document.body.appendChild(craftSearch);
    craftingMenu.craftSearch = craftSearch;
    craftingMenu.mouseInSearchBar = function() {
      return this.searchBarActive && mouseInBox(
        { x: mouse.canvasX, y: mouse.canvasY },
        {
          x: this.searchBarDimensions.x + 130,
          y: this.searchBarDimensions.y + this.renderY,
          w: this.searchBarDimensions.w,
          h: this.searchBarDimensions.h
        }
      );
    };
    craftingMenu.searchBarFocused = function() {
      return document.activeElement === this.craftSearch;
    };
    const originalDraw = craftingMenu.drawInventory;
    craftingMenu.drawInventory = function(alpha = 1) {
      this.inventorySpace.h = this.h - this.inventorySpace.y - 4;
      if (this.maxRarity > 5) {
        this.inventorySpace.h -= 24;
      }
      if (!settings.get("craftingSearchBar")) {
        originalDraw.apply(this, [alpha]);
        return;
      }
      originalDraw.apply(this, [alpha]);
      this.searchBarDimensions.w = Math.min(
        craftingMenu.inventorySpace.w - 8,
        craftingMenu.w - 42
      );
      ctx.translate(130, this.renderY);
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(
        this.searchBarDimensions.x,
        this.searchBarDimensions.y,
        this.searchBarDimensions.w,
        this.searchBarDimensions.h
      );
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
      if (this.mouseInSearchBar()) {
        setCursor("text");
      }
      const hasText = this.craftSearch.value !== "";
      ctx.fillStyle = hasText ? "#000000" : "#cccccc";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.font = "600 22px Ubuntu";
      ctx.letterSpacing = "0px";
      ctx.fillText(
        hasText ? this.craftSearch.value : "Search...",
        this.searchBarDimensions.x + 8,
        this.searchBarDimensions.y + this.searchBarDimensions.h / 2
      );
      if (this.searchBarFocused() && Math.floor(time / 500) % 2 === 0) {
        const text = this.craftSearch.value;
        const caretIndex = this.craftSearch.selectionStart ?? text.length;
        const textWidth = ctx.measureText(text.slice(0, caretIndex)).width;
        const caretX = this.searchBarDimensions.x + 8 + textWidth;
        ctx.lineWidth = 2;
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.moveTo(caretX, this.searchBarDimensions.y + 5);
        ctx.lineTo(
          caretX,
          this.searchBarDimensions.y + this.searchBarDimensions.h - 5
        );
        ctx.stroke();
        ctx.closePath();
      }
      ctx.translate(-130, -this.renderY);
    };
    const originalMouseDown = craftingMenu.mouseDown;
    craftingMenu.mouseDown = function({ mouseX, mouseY }, evt) {
      originalMouseDown.apply(this, [{ mouseX, mouseY }, evt]);
      if (this.mouseInSearchBar()) {
        setTimeout(() => craftSearch.focus(), 0);
      }
    };
    const originalToggle = craftingMenu.toggleMenu;
    craftingMenu.toggleMenu = function() {
      originalToggle.apply(this, []);
      this.craftSearch.value = "";
      this.recalculateFilteredPetals();
    };
    craftingMenu.recalculateFilteredPetals = function() {
      let filterCount = 0;
      this.petalContainers = {};
      for (let type in this.rawPetalContainers) {
        if (type.toLowerCase().includes(this.craftSearch.value.toLowerCase())) {
          filterCount++;
          this.petalContainers[type] = this.rawPetalContainers[type];
        }
      }
      this.recalculateTypeIndexes();
      if (filterCount < 5) {
        this.scrollbar.top = 0;
        this.scrollbar.bottom = 0;
        this.scrollbar.renderTop = 0;
        this.scrollbar.renderBottom = 0;
        this.scroll = 0;
      }
    };
    function rawPetalModifier(key) {
      const originalFn = craftingMenu[key];
      craftingMenu[key] = function(...args) {
        this.petalContainers = this.rawPetalContainers;
        originalFn.apply(craftingMenu, args);
        this.recalculateFilteredPetals();
      };
    }
    rawPetalModifier("addPetalContainer");
    rawPetalModifier("removePetalContainer");
    rawPetalModifier("removePetalContainerAmount");
    rawPetalModifier("runCraftingAnimation");
    const originalInitInventory = globalInventory.initInventory;
    globalInventory.initInventory = function(data) {
      craftingMenu.rawPetalContainers = {};
      originalInitInventory.apply(this, [data]);
    };
    craftingMenu.updateSearchBarActive = function() {
      const oldTranslate = this.searchBarActive ? 50 : 0;
      this.searchBarActive = settings.get("craftingSearchBar");
      const newTranslate = (this.searchBarActive ? 50 : 0) - oldTranslate;
      this.h += newTranslate;
      this.inventorySpace.y += newTranslate;
      this.scrollbar.start += newTranslate;
      this.scrollbar.end += newTranslate;
    };
    craftingMenu.searchBarActive = false;
    craftingMenu.updateSearchBarActive();
    settings.addListener("craftingSearchBar", () => {
      craftingMenu.updateSearchBarActive();
    });
  }
  function displayMissilesAboveEnemies() {
    if (!isNil(flowrMod)) {
      return;
    }
    const originalRenderGame = renderGame;
    renderGame = (dt2) => {
      if (!settings.get("missileDrawPriority")) {
        originalRenderGame(dt2);
        return;
      }
      const queuedMissiles = [];
      const maxId = Math.max(...Object.keys(room.enemies).map((k) => Number(k)));
      for (let id in room.enemies) {
        const enemy = room.enemies[id];
        if (enemy.type.includes("Missile")) {
          enemy.draw = function() {
            queuedMissiles.push(this);
          };
        }
        if (Number(id) === maxId) {
          enemy.draw = function() {
            Enemy.prototype.draw.apply(this);
            for (let missile of queuedMissiles) {
              Enemy.prototype.draw.apply(missile);
            }
          };
        }
      }
      originalRenderGame(dt2);
      for (let enemy of Object.values(room.enemies)) {
        enemy.draw = Enemy.prototype.draw;
      }
    };
  }
  function prioritizeRenderingDragPetal() {
    const dragPetalCanvas = document.createElement("canvas");
    dragPetalCanvas.style = "z-index: 1; pointer-events: none";
    document.body.appendChild(dragPetalCanvas);
    const dragPetalCtx = dragPetalCanvas.getContext("2d");
    const originalPetalDraw = PetalContainer.prototype.draw;
    PetalContainer.prototype.draw = function(inGame, number) {
      if (this.isDraggingPetalContainer) {
        dragPetalCanvas.width = canvas.width;
        dragPetalCanvas.height = canvas.height;
        const originalCtx = ctx;
        if (!isNil(dragPetalCtx)) {
          ctx = dragPetalCtx;
          ctx.setTransform(originalCtx.getTransform());
        }
        originalPetalDraw.apply(this, [inGame, number]);
        ctx = originalCtx;
      } else {
        originalPetalDraw.apply(this, [inGame, number]);
      }
    };
    const originalDraw = draw;
    draw = function() {
      dragPetalCtx?.reset();
      dragPetalCtx?.clearRect(0, 0, dragPetalCanvas.width, dragPetalCanvas.height);
      originalDraw();
    };
  }
  function enlargeZoomedOutItems() {
    const originalRenderHpBar = renderHpBar;
    renderHpBar = function(data, entity) {
      if (data.flowerName !== void 0 && entity?.id === _unsafeWindow.selfId) {
        const scale = settings.get("playerHpBarScale");
        const rScale = scale ** (1 / 1.2);
        data.y -= (scale - 1) * data.radius;
        data.radius *= rScale;
      }
      originalRenderHpBar(data, entity);
    };
    function calculatePetalSize(petal) {
      const desiredRarity = settings.get("specialDropsRarity");
      const desiredQuantity = settings.get("specialDropsQuantity");
      const effectiveQuantity = convertPetalValue(
        petal.amount,
        petal.rarity,
        desiredRarity
      );
      if (effectiveQuantity >= desiredQuantity) {
        const scale = settings.get("specialDropsScale");
        petal.w = 50 * scale;
        petal.h = 50 * scale;
      } else {
        petal.w = 50;
        petal.h = 50;
      }
    }
    const originalNewPetalContainer = processGameMessageMap.newPetalContainer;
    processGameMessageMap.newPetalContainer = function(data, _me, _advanced) {
      const scale = settings.get("specialDropsScale");
      const desiredRarity = settings.get("specialDropsRarity");
      const desiredQuantity = settings.get("specialDropsQuantity");
      const effectiveQuantity = convertPetalValue(
        data.amount ?? 1,
        data.rarity,
        desiredRarity
      );
      if (effectiveQuantity >= desiredQuantity) {
        const originalSize = data.w;
        const dx = data.x - data.originalX;
        const dy = data.y - data.originalY;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d > 0) {
          data.x = data.originalX + dx * (d + originalSize * (scale - 1)) / d;
          data.y = data.originalY + dy * (d + originalSize * (scale - 1)) / d;
        }
      }
      originalNewPetalContainer(data, _me, _advanced);
      const petal = room.petalContainers[data.id];
      if (!isNil(petal)) {
        calculatePetalSize(petal);
      }
    };
    function recalculateAllPetalSizes() {
      for (let petal of Object.values(room.petalContainers)) {
        calculatePetalSize(petal);
      }
    }
    settings.addListener("specialDropsScale", recalculateAllPetalSizes);
    settings.addListener("specialDropsRarity", recalculateAllPetalSizes);
    settings.addListener("specialDropsQuantity", recalculateAllPetalSizes);
  }
  const expandIcon = new Image();
  expandIcon.src = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB3aWR0aD0iMjkuOTk5OTkybW0iCiAgIGhlaWdodD0iMzAuMDAwMDExbW0iCiAgIHZpZXdCb3g9IjAgMCAyOS45OTk5OTIgMzAuMDAwMDExIgogICB2ZXJzaW9uPSIxLjEiCiAgIGlkPSJzdmcxIgogICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxkZWZzCiAgICAgaWQ9ImRlZnMxIiAvPgogIDxnCiAgICAgaWQ9ImxheWVyMSIKICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNzQsLTE1NC4wMDAwMSkiPgogICAgPHBhdGgKICAgICAgIHN0eWxlPSJmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOiNmZmZmZmY7c3Ryb2tlLXdpZHRoOjAuMDE7c3Ryb2tlLWxpbmVjYXA6c3F1YXJlO3N0cm9rZS1taXRlcmxpbWl0OjA7cGFpbnQtb3JkZXI6bWFya2VycyBzdHJva2UgZmlsbCIKICAgICAgIGlkPSJwYXRoMSIKICAgICAgIGQ9Ik0gNzcuMTA4NTg4LDExNS40NDI5OSAzMi41NTEzNTgsMTAyLjc2MDQyIDY1LjgxMzQwMSw3MC41MTQwMTUgWiIKICAgICAgIHRyYW5zZm9ybT0ibWF0cml4KDAuMTY2OTA4LC0wLjA2Nzg5NDA2LDAuMTc2MjAyMDEsMC4yMzI0MzMzOCw1Ni41OTE3MzIsMTU2LjMyNDEpIiAvPgogICAgPHBhdGgKICAgICAgIHN0eWxlPSJmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOiNmZmZmZmY7c3Ryb2tlLXdpZHRoOjAuMDE7c3Ryb2tlLWxpbmVjYXA6c3F1YXJlO3N0cm9rZS1taXRlcmxpbWl0OjA7cGFpbnQtb3JkZXI6bWFya2VycyBzdHJva2UgZmlsbCIKICAgICAgIGlkPSJwYXRoMS04IgogICAgICAgZD0iTSA3Ny4xMDg1ODgsMTE1LjQ0Mjk5IDMyLjU1MTM1OCwxMDIuNzYwNDIgNjUuODEzNDAxLDcwLjUxNDAxNSBaIgogICAgICAgdHJhbnNmb3JtPSJtYXRyaXgoLTAuMTY2OTA4LDAuMDY3ODk0MDYsLTAuMTc2MjAyMDEsLTAuMjMyNDMzMzgsMTIxLjQwODAzLDE4MS42NzYxMSkiIC8+CiAgICA8cmVjdAogICAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtmaWxsLW9wYWNpdHk6MTtzdHJva2U6I2ZmZmZmZjtzdHJva2Utd2lkdGg6MC4wMTQwNzQzO3N0cm9rZS1saW5lY2FwOnNxdWFyZTtzdHJva2UtbWl0ZXJsaW1pdDowO3BhaW50LW9yZGVyOm1hcmtlcnMgc3Ryb2tlIGZpbGwiCiAgICAgICBpZD0icmVjdDIiCiAgICAgICB3aWR0aD0iNC4xMTg1NTg0IgogICAgICAgaGVpZ2h0PSIxOC4zNTYzMzMiCiAgICAgICB4PSIxODAuNDYwNDUiCiAgICAgICB5PSI0Ny4xODQyODQiCiAgICAgICB0cmFuc2Zvcm09Im1hdHJpeCgwLjcwNzcyMTA1LDAuNzA2NDkxOTcsLTAuNzA4MTgxMzMsMC43MDYwMzA2LDAsMCkiIC8+CiAgICA8cmVjdAogICAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtmaWxsLW9wYWNpdHk6MDtzdHJva2U6I2ZmZmZmZjtzdHJva2Utd2lkdGg6MC4wMTg3MzQ7c3Ryb2tlLWxpbmVjYXA6c3F1YXJlO3N0cm9rZS1taXRlcmxpbWl0OjA7cGFpbnQtb3JkZXI6bWFya2VycyBzdHJva2UgZmlsbCIKICAgICAgIGlkPSJyZWN0MyIKICAgICAgIHdpZHRoPSIyOS45ODEyNjYiCiAgICAgICBoZWlnaHQ9IjI5Ljk4MTI2NiIKICAgICAgIHg9Ijc0LjAwOTM2OSIKICAgICAgIHk9IjE1NC4wMDkzNyIgLz4KICA8L2c+Cjwvc3ZnPgo=";
  function addInventoryMenuExpansion() {
    const petalSize = {
      /**
       * The raw side length of each square petal container, without padding.
       */
      raw: 65,
      /**
       * Petal size + 20 units of horizontal padding.
       */
      horizontal: 65 + 20,
      /**
       * Petal size + 12 units of vertical padding.
       */
      vertical: 65 + 12
    };
    const menuLeftPadding = 35;
    const menuRightPadding = 50;
    const menuTopPadding = 100;
    const screenLeftPadding = 130;
    const screenRightPadding = 10;
    const screenTopPadding = 110;
    const screenBottomPadding = 20;
    const buttonSize = 30;
    const buttonPadding = 7.5 + 3;
    const originalHeight = globalInventory.h;
    globalInventory.expanded = false;
    const nicknameTextbox = document.getElementsByClassName("nickname")[0];
    const nicknameUI = nicknameTextbox.parentElement;
    globalInventory.calculatePetalPositions = function() {
      let petalIndex = 0;
      for (let group of Object.values(this.petalContainers).reverse()) {
        for (let pc of group) {
          if (this.filteredOutBySearch(pc)) {
            continue;
          }
          const row = Math.floor(petalIndex / globalInventory.petalsPerRow);
          const column = petalIndex % globalInventory.petalsPerRow;
          Object.defineProperties(pc, {
            x: {
              get: () => petalSize.raw / 2 + menuLeftPadding + column * petalSize.horizontal,
              set: () => {
              },
              configurable: true
            },
            y: {
              get: () => petalSize.raw / 2 + menuTopPadding + row * petalSize.vertical + globalInventory.render.scroll,
              set: () => {
              },
              configurable: true
            },
            relativeY: {
              get: function() {
                return this.y - menuTopPadding;
              },
              set: () => {
              },
              configurable: true
            }
          });
          petalIndex++;
        }
      }
    };
    globalInventory.recalculateDimensions = function() {
      if (this.expanded) {
        this.h = canvas.h - screenTopPadding - screenBottomPadding;
        const maxInventorySpaceWidth = canvas.w - screenLeftPadding - screenRightPadding - menuLeftPadding - menuRightPadding;
        this.petalsPerRow = Math.floor(maxInventorySpaceWidth / petalSize.horizontal);
      } else {
        this.petalsPerRow = flowrMod?.newinventory ? 6 : 5;
        this.h = originalHeight;
      }
      Object.defineProperty(this, "w", {
        get: function() {
          return petalSize.horizontal * this.petalsPerRow + menuLeftPadding + menuRightPadding;
        },
        set: () => {
        },
        configurable: true
      });
    };
    globalInventory.toggleExpansion = function() {
      if (!settings.get("inventoryExpandButton")) {
        this.expanded = false;
        this.recalculateDimensions();
        nicknameUI?.classList?.remove("hidden");
      }
      this.expanded = !this.expanded;
      this.recalculateDimensions();
      if (!isNil(nicknameUI)) {
        if (this.expanded) {
          nicknameUI.classList.add("hidden");
        } else {
          nicknameUI.classList.remove("hidden");
        }
      }
    };
    const originalToggleMenu = globalInventory.toggleMenu;
    globalInventory.toggleMenu = function() {
      originalToggleMenu.apply(this);
      if (this.expanded) {
        this.toggleExpansion();
      }
      this.lastDragStartTime = void 0;
      this.lastDragEndTime = void 0;
    };
    globalInventory.getExpandButtonDimensions = function() {
      return {
        x: screenLeftPadding + this.w - 2 * (buttonSize + buttonPadding),
        y: this.renderY + buttonPadding,
        w: buttonSize,
        h: buttonSize
      };
    };
    globalInventory.hoveringOverExpand = function() {
      return mouseInBox(
        { x: mouse.canvasX, y: mouse.canvasY },
        this.getExpandButtonDimensions()
      );
    };
    const originalDraw = globalInventory.draw;
    globalInventory.draw = function() {
      if (!settings.get("inventoryExpandButton")) {
        originalDraw.apply(this);
        return;
      }
      const originalDrawStatsBox = StatsBox.prototype.draw;
      if (!isNil(this.lastDragStartTime)) {
        this.lastCloseTime = time - Math.min(0.2 * (time - this.lastDragStartTime), 159.9);
        StatsBox.prototype.draw = () => {
        };
      }
      if (!isNil(this.lastDragEndTime)) {
        this.lastOpenTime = time - 0.5 * (time - this.lastDragEndTime);
      }
      this.calculatePetalPositions();
      originalDraw.apply(this);
      StatsBox.prototype.draw = originalDrawStatsBox;
      const buttonDims = this.getExpandButtonDimensions();
      ctx.strokeStyle = CINDER_BORDER_COLOUR;
      ctx.fillStyle = CINDER_COLOUR;
      if (this.hoveringOverExpand()) {
        setCursor("pointer");
        ctx.fillStyle = LIGHT_CINDER_COLOUR;
      }
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.roundRect(buttonDims.x, buttonDims.y, buttonDims.w, buttonDims.h, 6);
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
      ctx.drawImage(
        expandIcon,
        buttonDims.x,
        buttonDims.y,
        buttonDims.w,
        buttonDims.h
      );
    };
    globalInventory.shouldHideFromDraggingPetal = function() {
      return this.expanded && !isNil(draggingPetalContainer);
    };
    const originalMouseDown = globalInventory.mouseDown;
    globalInventory.mouseDown = function({ mouseX, mouseY }, inv) {
      if (!settings.get("inventoryExpandButton")) {
        originalMouseDown.apply(this, [{ mouseX, mouseY }, inv]);
        return;
      }
      originalMouseDown.apply(this, [{ mouseX, mouseY }, inv]);
      if (this.shouldHideFromDraggingPetal()) {
        this.lastDragEndTime = void 0;
        this.lastDragStartTime = time;
        nicknameUI?.classList?.remove("hidden");
      }
      if (this.hoveringOverExpand()) {
        this.toggleExpansion();
      }
    };
    const originalMouseUp = globalInventory.mouseUp;
    globalInventory.mouseUp = function({ mouseX, mouseY }, inv, skipFastFlag) {
      if (this.shouldHideFromDraggingPetal()) {
        this.lastDragStartTime = void 0;
        this.lastDragEndTime = time;
        nicknameUI?.classList?.add("hidden");
      }
      if (isNil(skipFastFlag)) {
        originalMouseUp.apply(this, [{ mouseX, mouseY }, inv]);
      } else {
        originalMouseUp.apply(this, [{ mouseX, mouseY }, inv, skipFastFlag]);
      }
    };
    window.addEventListener("resize", function() {
      if (globalInventory.expanded) {
        globalInventory.recalculateDimensions();
      }
    });
    globalInventory.recalculateDimensions();
  }
  function allowFastCrafting() {
    craftingMenu._finishedCraft = false;
    craftingMenu.craftAnimationCountdown = 0;
    Object.defineProperty(craftingMenu, "finishedCraft", {
      get: function() {
        return this._finishedCraft && this.craftAnimationCountdown < 0;
      },
      set: function(v) {
        this._finishedCraft = v;
      }
    });
    const originalStartAnimation = craftingMenu.startCraftingAnimation;
    craftingMenu.startCraftingAnimation = function() {
      originalStartAnimation.apply(this);
      this.craftAnimationCountdown = 1e3 * settings.get("craftAnimationLength");
      this.finishedCraft = false;
      this.craftingAnimationTimer = Math.PI * 36288e3;
    };
    const originalRunAnimation = craftingMenu.runCraftingAnimation;
    craftingMenu.runCraftingAnimation = function() {
      this.craftAnimationCountdown -= dt;
      originalRunAnimation.apply(this);
    };
  }
  function fixDraggingPetalsOutOfBounds() {
    const originalSimulateDragging = simulatedraggingPetalContainer;
    simulatedraggingPetalContainer = (x, y) => {
      if (x < -1e10 && y < -1e10) {
        return;
      }
      x = Math.max(0, Math.min(canvas.width, x));
      y = Math.max(0, Math.min(canvas.height, y));
      originalSimulateDragging(x, y);
    };
  }
  function fixNegativeRadiusFreeze() {
    const originalArc = ctx.arc;
    ctx.arc = function(...args) {
      if (args[2] > 0) {
        originalArc.apply(this, args);
      }
    };
  }
  class DropdownUI {
    /**
     * The x-coordinate of the centre of the whole dropdown UI.
     */
    x;
    /**
     * The y-coordinate of the centre of the whole dropdown UI.
     */
    y;
    /**
     * The dropdown menu's choice is stored in local storage at this storage key.
     */
    localStorageKey;
    /**
     * The label for the dropdown menu, displayed to the left of the menu.
     */
    labelText;
    /**
     * The width of the {@linkcode labelText}.
     */
    labelWidth;
    /**
     * A tooltip icon, displayed to the right of the dropdown menu.
     */
    tooltipIcon;
    /**
     * The coordinates for the tooltip icon.
     */
    tooltipPos;
    /**
     * The options that the user can select in this dropdown menu.
     */
    options;
    /**
     * The width used to display the dropdown itself, based on the widths of its
     * contents.
     */
    optionsWidth;
    /**
     * The height that each dropdown option will take up.
     */
    heightPerOption = 30;
    /**
     * The choice that the user has currently selected.
     */
    currentChoice;
    /**
     * Whether or not the user has expanded the dropdown menu to display its list
     * of options.
     */
    expanded;
    /**
     * The vertical translation of the list of options, relative to its fully
     * expanded position. (This number is negative when the list of options is
     * retracted.)
     */
    optionsTranslateY;
    /**
     * A list of listeners to listen to the user selecting options in this
     * dropdown menu.
     */
    listeners;
    /**
     * The timestamp of the most recent time that the user clicked on an option.
     */
    optionSelectedTime;
    constructor(labelText, localStorageKey, x, y, options, tooltip) {
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
      this.optionSelectedTime = time - 1e4;
      const localStorageChoice = localStorage.getItem(localStorageKey);
      if (isNil(localStorageChoice)) {
        this.currentChoice = this.options[0];
        localStorage.setItem(
          this.localStorageKey,
          JSON.stringify(this.currentChoice)
        );
      } else {
        this.currentChoice = JSON.parse(localStorageChoice);
      }
      this.optionsWidth = 60;
      ctx.font = "900 17px Ubuntu";
      for (let { text } of this.options) {
        this.optionsWidth = Math.max(this.optionsWidth, ctx.measureText(text).width + 60);
      }
      this.labelWidth = ctx.measureText(labelText).width;
    }
    /**
     * The total width of the whole dropdown UI.
     */
    get width() {
      const originalFont = ctx.font;
      ctx.font = "900 17px Ubuntu";
      const ret = this.labelWidth + DROPDOWN_UI_PADDING + this.optionsWidth + DROPDOWN_UI_PADDING + TOOLTIP_ICON_SIZE;
      ctx.font = originalFont;
      return ret;
    }
    /**
     * The x-coordinate of the left side of the dropdown options.
     */
    get optionsX() {
      return this.x - this.width / 2 + this.labelWidth + DROPDOWN_UI_PADDING;
    }
    /**
     * The total height taken up by this menu's list of options, equal to
     * {@linkcode options options.length} times {@linkcode heightPerOption}.
     */
    get totalOptionsHeight() {
      return this.options.length * this.heightPerOption;
    }
    /**
     * This function sets {@linkcode currentChoice} to the given option, saves it
     * in local storage, and triggers all of the {@linkcode listeners}.
     */
    setOption(option) {
      this.currentChoice = option;
      localStorage.setItem(this.localStorageKey, JSON.stringify(option));
      for (let fn of this.listeners) {
        fn(option.text);
      }
    }
    /**
     * Toggles whether or not the dropdown menu is opened or closed.
     */
    toggleExpansion() {
      this.expanded = !this.expanded;
    }
    draw() {
      let currentX = this.x - this.width / 2;
      ctx.font = "900 17px Ubuntu";
      ctx.lineWidth = 2;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.strokeStyle = "black";
      ctx.fillStyle = "white";
      ctx.strokeText(this.labelText, currentX, this.y);
      ctx.fillText(this.labelText, currentX, this.y);
      currentX += this.labelWidth + DROPDOWN_UI_PADDING;
      if (this.expanded) {
        this.optionsTranslateY = interpolate(this.optionsTranslateY, 0, 0.3);
      } else {
        this.optionsTranslateY = interpolate(
          this.optionsTranslateY,
          -this.totalOptionsHeight,
          0.3
        );
      }
      ctx.save();
      ctx.beginPath();
      ctx.rect(
        currentX - 10,
        this.y + this.heightPerOption / 2 - 10,
        this.optionsWidth + 20,
        (this.options.length + 1) * this.heightPerOption
      );
      ctx.clip();
      ctx.closePath();
      const hoveredOption = this.hoveredOptionIndex();
      ctx.translate(0, this.optionsTranslateY);
      let currentY = this.y + this.heightPerOption;
      for (let i = 0; i < this.options.length; i++) {
        const { text, colour } = this.options[i];
        ctx.fillStyle = i === hoveredOption ? "#bfbfbf" : "white";
        ctx.beginPath();
        ctx.rect(
          currentX,
          currentY - this.heightPerOption / 2,
          this.optionsWidth,
          this.heightPerOption
        );
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
        ctx.fillStyle = colour;
        ctx.strokeText(text, currentX + 5, currentY);
        ctx.fillText(text, currentX + 5, currentY);
        currentY += this.heightPerOption;
      }
      ctx.restore();
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.rect(
        currentX,
        this.y - this.heightPerOption / 2,
        this.optionsWidth,
        this.heightPerOption
      );
      ctx.stroke();
      ctx.fill();
      ctx.closePath();
      ctx.fillStyle = this.currentChoice.colour;
      ctx.strokeText(this.currentChoice.text, currentX + 5, this.y);
      ctx.fillText(this.currentChoice.text, currentX + 5, this.y);
      ctx.beginPath();
      ctx.moveTo(currentX + this.optionsWidth - 5, this.y - 5);
      ctx.lineTo(currentX + this.optionsWidth - 15, this.y + 5);
      ctx.lineTo(currentX + this.optionsWidth - 25, this.y - 5);
      ctx.stroke();
      ctx.closePath();
      if (this.hoveringOverOpener() || hoveredOption > -1) {
        setCursor("pointer");
      }
      currentX += this.optionsWidth + DROPDOWN_UI_PADDING;
      this.tooltipPos = { x: currentX + TOOLTIP_ICON_SIZE / 2, y: this.y };
      this.tooltipIcon.drawIcon(this.tooltipPos);
      this.tooltipIcon.drawText(
        this.tooltipPos,
        { x: mouse.canvasX, y: mouse.canvasY }
      );
    }
    /**
     * Determines whether or not the user is hovering over the dropdown menu to
     * open/close it.
     */
    hoveringOverOpener() {
      return mouseInBox(
        { x: mouse.canvasX, y: mouse.canvasY },
        {
          x: this.optionsX,
          y: this.y - this.heightPerOption / 2,
          w: this.optionsWidth,
          h: this.heightPerOption
        }
      );
    }
    /**
     * Returns the index of the option that the user is currently hovering over,
     * or -1 if the user is currently not hovering over any option.
     */
    hoveredOptionIndex() {
      if (mouse.canvasY <= this.y + this.heightPerOption / 2) {
        return -1;
      }
      if (!mouseInBox(
        { x: mouse.canvasX, y: mouse.canvasY },
        {
          x: this.optionsX,
          y: this.y + this.heightPerOption / 2 + this.optionsTranslateY,
          w: this.optionsWidth,
          h: this.totalOptionsHeight
        }
      )) {
        return -1;
      }
      const relativeY = mouse.canvasY - (this.y + this.heightPerOption / 2 + this.optionsTranslateY);
      const index = Math.floor(relativeY / this.heightPerOption);
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
        this.setOption(this.options[hoveredOption]);
        this.optionSelectedTime = time;
        this.expanded = false;
        this.optionsTranslateY = -this.totalOptionsHeight;
      } else if (this.expanded) {
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
    addListener(fn, applyCurrent = true) {
      this.listeners.push(fn);
      if (applyCurrent) {
        fn(this.currentChoice.text);
      }
    }
    /**
     * Returns `true` if and only if the user clicked on an option within the
     * past 250ms.
     */
    recentlySelectedOption() {
      return time - this.optionSelectedTime < 250;
    }
  }
  function addGalleryCounterDropdownMenu() {
    const originalResize = mobGallery.resize;
    mobGallery.resize = function(h) {
      originalResize.apply(this, [h]);
      this.h += GALLERY_EXTRA_HEIGHT;
      this.dimensions.h += GALLERY_EXTRA_HEIGHT;
      this.inventorySpace.y += GALLERY_EXTRA_HEIGHT;
      this.scrollBounds.y.end += GALLERY_EXTRA_HEIGHT;
      this.inventorySpace.w += GALLERY_EXTRA_HOR_SPACE;
      this.scrollBounds.y.start = this.inventorySpace.y + this.scrollBarSize / 2 + 14 + GALLERY_TOP_PADDING;
    };
    const originalDrawRows = mobGallery.drawRows;
    mobGallery.drawRows = function() {
      originalDrawRows.apply(this);
      this.scrollExcess.x -= GALLERY_EXTRA_HOR_SPACE;
    };
    mobGallery._currentY = mobGallery.currentY;
    Object.defineProperty(mobGallery, "currentY", {
      get: function() {
        return this._currentY;
      },
      set: function(v) {
        this._currentY = Math.max(v, this.inventorySpace.y + GALLERY_TOP_PADDING);
      }
    });
    const originalUpdateScroll = mobGallery.updateScroll;
    mobGallery.updateScroll = function(scroll, { mouseX, mouseY }) {
      if (mouseInBox(
        { x: mouseX, y: mouseY },
        {
          x: this.x,
          y: this.inventorySpace.y,
          w: this.w,
          h: this.inventorySpace.h
        }
      )) {
        originalUpdateScroll.apply(this, [scroll, { mouseX, mouseY }]);
      }
    };
    const dropdownUI = new DropdownUI(
      "Display count:",
      "cinderMobStatDisplay",
      mobGallery.x + mobGallery.w / 2,
      mobGallery.renderY + 80,
      [
        { text: "None", colour: "white" },
        { text: "Kills", colour: TEXT_LIGHT_RED },
        { text: "Spawns", colour: TEXT_LIGHT_BLUE },
        { text: "Kills +", colour: TEXT_LIGHT_RED },
        { text: "Spawns +", colour: TEXT_LIGHT_BLUE }
      ],
      `The "Kills +" and "Spawns +" options count Lucky mobs multiple times based on their loot multipliers.`
    );
    dropdownUI.addListener((option) => {
      mobGallery.setCountMode(option);
    });
    const originalDrawInventory = mobGallery.drawInventory;
    mobGallery.drawInventory = function(alpha) {
      originalDrawInventory.apply(this, [alpha]);
      ctx.font = "900 32px Ubuntu";
      ctx.lineWidth = 3.75;
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.strokeText("Mob Gallery", this.x + this.w / 2, this.renderY + 15);
      ctx.fillText("Mob Gallery", this.x + this.w / 2, this.renderY + 15);
      dropdownUI.y = this.renderY + 75;
      dropdownUI.draw();
    };
    const originalMouseDown = mobGallery.mouseDown;
    mobGallery.mouseDown = function({ x, y }) {
      originalMouseDown.apply(this, [{ x, y }]);
      dropdownUI.mouseDown();
    };
    const originalDrawStatsBox = Enemy.prototype.drawStatsBox;
    Enemy.prototype.drawStatsBox = function(drawBelow, rarityOverride) {
      if (dropdownUI.hoveredOptionIndex() > -1 || dropdownUI.recentlySelectedOption()) {
        this.isHovered = false;
      }
      originalDrawStatsBox.apply(this, [drawBelow, rarityOverride]);
    };
  }
  const wsDataEditing = [];
  function allowWsDataEditing() {
    function injectWsSend() {
      const originalSend = ws.send;
      ws.send = function(data) {
        const rawData = msgpackr.unpack(data);
        for (let fn of wsDataEditing) {
          fn(rawData);
        }
        originalSend.apply(ws, [msgpackr.pack(rawData)]);
      };
    }
    const originalInitWS = initWS;
    initWS = function() {
      originalInitWS();
      injectWsSend();
    };
    if (!isNil(ws)) {
      injectWsSend();
    }
  }
  function addWsDataEditing(fn) {
    wsDataEditing.push(fn);
  }
  function enableInvertAttackAndDefend() {
    let rawAttacking = false;
    let rawDefending = false;
    function updateClientAttack() {
      const newAttacking = rawAttacking !== settings.get("invertAttack");
      if (!isNil(_unsafeWindow.selfId)) {
        const player = room.flowers[_unsafeWindow.selfId];
        if (!isNil(player)) {
          player.attacking = newAttacking;
        }
      }
      return newAttacking;
    }
    function updateClientDefend() {
      const newDefending = rawDefending !== settings.get("invertDefend");
      if (!isNil(_unsafeWindow.selfId)) {
        const player = room.flowers[_unsafeWindow.selfId];
        if (!isNil(player)) {
          player.defending = newDefending;
        }
      }
      return newDefending;
    }
    addWsDataEditing((data) => {
      if (!isNil(data.attack)) {
        rawAttacking = data.attack;
        data.attack = updateClientAttack();
      } else if (data[0] === "a") {
        rawAttacking = data[1];
        data[1] = updateClientAttack();
      } else if (!isNil(data.defend)) {
        rawDefending = data.defend;
        data.defend = updateClientDefend();
      } else if (data[0] === "d") {
        rawDefending = data[1];
        data[1] = updateClientDefend();
      }
    });
    addKeybindInstruction(
      { type: "settings", settingsKey: "keybindInvertAttack", fn: () => {
        const newInvertAttack = !settings.get("invertAttack");
        settings.set("invertAttack", newInvertAttack);
        chatAnnounce(
          "Invert Attack set to " + (newInvertAttack ? "ON" : "OFF") + "!",
          TEXT_LIGHT_RED
        );
      } }
    );
    addKeybindInstruction(
      { type: "settings", settingsKey: "keybindInvertDefend", fn: () => {
        const newInvertDefend = !settings.get("invertDefend");
        settings.set("invertDefend", newInvertDefend);
        chatAnnounce(
          "Invert Defend set to " + (newInvertDefend ? "ON" : "OFF") + "!",
          TEXT_LIGHT_BLUE
        );
      } }
    );
    settings.addListener("invertAttack", (option) => {
      settingsMap.invertAttack.state = option;
      send({ attack: rawAttacking });
    });
    settings.addListener("invertDefend", (option) => {
      settingsMap.invertDefend.state = option;
      send({ defend: rawDefending });
    });
    const originalEnterGame = enterGame;
    enterGame = function() {
      originalEnterGame();
      send({ attack: false });
      send({ defend: false });
    };
  }
  function addMobGalleryKillCounter() {
    mobGallery.setCountMode = function(value) {
      this.countMode = value;
      for (let type in this.rows) {
        for (let rarity = 0; rarity < this.rows[type].length; rarity++) {
          this.updateStat(type, rarity);
        }
      }
      cachedImages.statBoxes.enemies = {};
    };
    mobGallery.getStatCounter = function() {
      switch (this.countMode.toLowerCase()) {
        case "kills":
          return killCounter;
        case "spawns":
          return spawnCounter;
        case "kills +":
          return killPlusCounter;
        case "spawns +":
          return spawnPlusCounter;
        default:
          return void 0;
      }
    };
    mobGallery.getStatTextColour = function() {
      if (["kills", "kills +"].includes(this.countMode.toLowerCase())) {
        return TEXT_LIGHT_RED;
      } else if (["spawns", "spawns +"].includes(this.countMode.toLowerCase())) {
        return TEXT_LIGHT_BLUE;
      } else {
        return "white";
      }
    };
    mobGallery.updateStat = function(type, rarity) {
      if (isNonLootableEnemyType(type)) {
        return 1;
      }
      const stat = this.getStatCounter()?.getStat(type, rarity) ?? 1;
      const mobContainer = mobGallery.rows[type]?.[rarity];
      if (typeof mobContainer === "object") {
        mobContainer.amount = stat;
        if (!isNil(this.getStatCounter())) {
          mobContainer.lastAmountChangedTime = time;
        } else {
          mobContainer.lastAmountChangedTime = time - 1e4;
        }
      }
      cachedImages.statBoxes.enemies[`${type}${rarity}`] = void 0;
      return stat;
    };
    let nextMobDroppedLoot = false;
    const originalAddPetal = processGameMessageMap.newPetalContainer;
    processGameMessageMap.newPetalContainer = function(data, _me, _advanced) {
      originalAddPetal(data, _me, _advanced);
      if (_unsafeWindow.spectating) {
        return;
      }
      nextMobDroppedLoot = true;
    };
    const originalRemoveEnemy = processGameMessageMap.removeEnemy;
    processGameMessageMap.removeEnemy = function(data, _me, _advanced) {
      const enemy = room.enemies[data.removeEnemy];
      originalRemoveEnemy(data, _me, _advanced);
      if (_unsafeWindow.spectating) {
        return;
      }
      if (localStorage.getItem("cinderDevMobCounterWarnings")) {
        let usingHorn = false;
        for (let petal of Object.values(inventory.topPetalContainers)) {
          if (petal?.type === "Horn") {
            usingHorn = true;
          }
        }
        if (nextMobDroppedLoot && enemy.lootMultiplier === 0 && !enemy.isBoss) {
          console.warn("Unexpected loot!", time);
          console.warn(enemy);
        } else if (!nextMobDroppedLoot && enemy.lootMultiplier > 0 && !usingHorn) {
          console.warn("No loot!", time);
          console.warn(enemy);
        }
      }
      if (nextMobDroppedLoot && !enemy.isBoss && enemy.lootMultiplier > 0) {
        killCounter.incrementStat(enemy.type, enemy.rarity, 1);
        killPlusCounter.incrementStat(
          enemy.type,
          enemy.rarity,
          enemy.lootMultiplier
        );
      }
      nextMobDroppedLoot = false;
    };
    const originalAddEnemy = processGameMessageMap.newEnemy;
    processGameMessageMap.newEnemy = function(data, _me, _advanced) {
      originalAddEnemy(data, _me, _advanced);
      if (_unsafeWindow.spectating) {
        return;
      }
      const enemy = room.enemies[data.id];
      enemy.lootMultiplier = 1 + (room.shinyWave ?? 0);
      if (expectNoLoot(enemy)) {
        enemy.lootMultiplier = 0;
      }
      if (enemy.lootMultiplier > 0 && !enemy.isBoss) {
        spawnCounter.incrementStat(enemy.type, enemy.rarity, 1);
        spawnPlusCounter.incrementStat(
          enemy.type,
          enemy.rarity,
          enemy.lootMultiplier
        );
      }
    };
    const originalGenerate = mobGallery.generateEnemyPc;
    mobGallery.generateEnemyPc = function(type, rarity, dimensions) {
      const container = originalGenerate.apply(this, [type, rarity, dimensions]);
      if (!isNonLootableEnemyType(type)) {
        container.amount = mobGallery.updateStat(type, rarity);
      }
      return container;
    };
    const originalDraw = PetalContainer.prototype.draw;
    PetalContainer.prototype.draw = function(inGame, number) {
      originalDraw.apply(this, [inGame, number]);
      if (this === mobGallery.rows[this.type]?.[this.rarity] && !isNonLootableEnemyType(this.type) && !isNil(mobGallery.getStatCounter())) {
        this.drawAmount(mobGallery.getStatTextColour());
      }
    };
    const originalGenEcBox = StatsBox.prototype.genEcBox;
    StatsBox.prototype.genEcBox = function() {
      const canvas2 = originalGenEcBox.apply(this);
      const statsBoxCtx = canvas2.getContext("2d");
      if (this.isGallery && !isNonLootableEnemyType(this.name) && !isNil(mobGallery.getStatCounter()) && !isNil(statsBoxCtx)) {
        statsBoxCtx.resetTransform();
        statsBoxCtx.letterSpacing = "0px";
        statsBoxCtx.font = `900 ${1.2 * 22.5}px Ubuntu`;
        const x = 10 + 7.5 + statsBoxCtx.measureText(this.name).width;
        const y = 10 + 4 + 4;
        statsBoxCtx.font = `900 ${0.75 * 22.5}px Ubuntu`;
        statsBoxCtx.lineWidth = 0.75 * 3.25;
        statsBoxCtx.fillStyle = mobGallery.getStatTextColour();
        statsBoxCtx.strokeStyle = "black";
        statsBoxCtx.textAlign = "left";
        statsBoxCtx.textBaseline = "top";
        statsBoxCtx.strokeText("x" + this.amount.toLocaleString(), x, y);
        statsBoxCtx.fillText("x" + this.amount.toLocaleString(), x, y);
      }
      return canvas2;
    };
    const originalDrawStatsBox = Enemy.prototype.drawStatsBox;
    Enemy.prototype.drawStatsBox = function(drawBelow, rarityOverride) {
      let isGallery = false;
      const galleryEntry = mobGallery.rows[this.type]?.[this.rarity];
      if (typeof galleryEntry === "object" && this === galleryEntry.petals[0]) {
        isGallery = true;
      }
      let cache = cachedImages.statBoxes.enemies[`${this.type}${this.rarity}`];
      if (isGallery !== cache?.isGallery) {
        cachedImages.statBoxes.enemies[`${this.type}${this.rarity}`] = void 0;
      }
      originalDrawStatsBox.apply(this, [drawBelow, rarityOverride]);
      cache = cachedImages.statBoxes.enemies[`${this.type}${this.rarity}`];
      if (isGallery && !isNil(cache) && !cache.isGallery && typeof galleryEntry === "object") {
        cache.amount = galleryEntry.amount;
        if (!isNil(cache.image)) {
          cache.image = cache.genEcBox();
        }
      }
      if (!isNil(cache)) {
        cache.isGallery = isGallery;
      }
      return canvas;
    };
  }
  function isNonLootableEnemyType(type) {
    return type.includes("Missile") || type.includes("Egg");
  }
  function expectNoLoot(enemy) {
    return isNonLootableEnemyType(enemy.type) || enemy.type.includes("Eel") && !enemy.isHead || enemy.type.includes("Leech") && !enemy.isHead || bosses.length > 0;
  }
  class MobCounter {
    /**
     * The local storage key to store the tracked stats in.
     */
    storageKey;
    /**
     * The stats being tracked by this tracker. The format is:
     * `savedStats[playerName][enemyType][enemyRarity]`.
     */
    savedStats;
    /**
     * Constructs a new tracker using stats saved at the given storage key.
     */
    constructor(storageKey) {
      this.storageKey = storageKey;
      this.savedStats = JSON.parse(
        localStorage.getItem(storageKey) ?? "{}"
      );
    }
    /**
     * Retrieves the tracked stat for the given mob of the given rarity. If the
     * given mob does not have a tracked stat yet, return `0` instead.
     */
    getStat(type, rarity) {
      return this.savedStats[username]?.[type]?.[rarity] ?? 0;
    }
    /**
     * Increment the tracked stat for the given mob of the given rarity.
     */
    incrementStat(type, rarity, amount) {
      if (isNil(this.savedStats[username])) {
        this.savedStats[username] = {};
      }
      if (isNil(this.savedStats[username][type])) {
        this.savedStats[username][type] = {};
      }
      if (isNil(this.savedStats[username][type][rarity])) {
        this.savedStats[username][type][rarity] = 0;
      }
      this.savedStats[username][type][rarity] += amount;
      localStorage.setItem(this.storageKey, JSON.stringify(this.savedStats));
      if (this === mobGallery.getStatCounter()) {
        mobGallery.updateStat(type, rarity);
      }
    }
  }
  let killCounter;
  let killPlusCounter;
  let spawnCounter;
  let spawnPlusCounter;
  function initMobCounters() {
    killCounter = new MobCounter("cinderKillCounter");
    killPlusCounter = new MobCounter("cinderKillPlusCounter");
    spawnCounter = new MobCounter("cinderSpawnCounter");
    spawnPlusCounter = new MobCounter("cinderSpawnPlusCounter");
  }
  function modifyBaseFOV() {
    addKeybindInstruction({ type: "rawValue", value: "BracketLeft", fn: () => {
      fov = 1 / settings.get("baseReciprocalOfFOV");
    } });
    const originalEnterGame = enterGame;
    enterGame = function() {
      originalEnterGame();
      fov = 1 / settings.get("baseReciprocalOfFOV");
    };
    settings.addListener("baseReciprocalOfFOV", (option) => {
      fov = 1 / option;
    });
  }
  function optimizeHighQualityRenders() {
    const airCachedThisFrame = [];
    const airCanvases = [];
    const airCtx = [];
    const airPetals = [];
    initializeCachedAir();
    const starCanvas = new OffscreenCanvas(30, 30);
    const starCtx = starCanvas.getContext("2d");
    let simStarX = 0;
    let simStarY = 0;
    const originalDraw = draw;
    draw = function() {
      if (settings.get("disableAllOptimizations")) {
        originalDraw();
        return;
      }
      starCtx?.reset();
      if (settings.get("petalStarCaching") && !isNil(starCtx)) {
        const originalCtx = ctx;
        ctx = starCtx;
        simStarX += 0.1;
        simStarY += 0.1;
        ctx.translate(15, 15);
        drawStar(0, 0);
        ctx.translate(-15, -15);
        ctx = originalCtx;
      }
      for (let rarity = 0; rarity <= MAX_RARITY; rarity++) {
        airCachedThisFrame[rarity] = false;
        airCtx[rarity]?.reset();
      }
      originalDraw();
    };
    const originalDrawPetal = PetalContainer.prototype.draw;
    PetalContainer.prototype.draw = function(inGame, number) {
      if (settings.get("disablePetalStars") && !settings.get("disableAllOptimizations") && !isNil(this.stars)) {
        for (let star of this.stars) {
          star.x = Infinity;
          star.y = Infinity;
        }
      }
      if (settings.get("disableAllOptimizations") || this === airPetals[this.rarity] || (!_unsafeWindow.hqp || flowrMod?.noFancy) || this.shouldAnimate() || inGame && !isNil(number) && !isNil(petalReloadData[number])) {
        originalDrawPetal.apply(this, [inGame, number]);
        return;
      } else {
        this.shouldDrawCachedAir = true;
        const originalGradient = staticGradients[this.rarity];
        const originalBorder = Colors.rarities[this.rarity].border;
        const originalFill = ctx.fill;
        const originalRoundRect = ctx.roundRect;
        originalDrawPetal.apply(this, [inGame, number]);
        this.shouldDrawCachedAir = false;
        staticGradients[this.rarity] = originalGradient;
        Colors.rarities[this.rarity].border = originalBorder;
        ctx.fill = originalFill;
        ctx.roundRect = originalRoundRect;
        if (!isNil(flowrMod)) {
          flowrMod.noFancy = false;
        } else {
          _unsafeWindow.hqp = true;
        }
      }
    };
    const originalInterpolate = PetalContainer.prototype.updateInterpolate;
    PetalContainer.prototype.updateInterpolate = function() {
      originalInterpolate.apply(this);
      if (settings.get("disableAllOptimizations")) {
        return;
      }
      if (this.shouldDrawCachedAir) {
        if (this.toOscillate && !toRender(
          { x: this.render.x, y: this.render.y, radius: this.radius },
          window.camera
        ) && !this.toSkipCulling) {
          return;
        }
        ctx.save();
        ctx.translate(this.render.x, this.render.y);
        let scale = this.getScale();
        let rotation = this.getRotation();
        if (rotation !== 0) {
          ctx.rotate(rotation);
        }
        if (scale !== 1) {
          ctx.scale(scale, scale);
        }
        if (this.toOscillate && !this.isDisplayPetalContainer) {
          ctx.globalAlpha = 0.3;
          ctx.fillStyle = "black";
          ctx.beginPath();
          ctx.roundRect(-30, -30, 60, 60, 5);
          ctx.fill();
          ctx.closePath();
          ctx.globalAlpha = 1;
          const originalFill = ctx.fill;
          ctx.fill = function() {
            if (ctx.globalAlpha < 0.5 && (ctx.fillStyle === "black" || ctx.fillStyle === "#000000")) {
              ctx.fill = originalFill;
              return;
            }
            originalFill.apply(this);
          };
        }
        if (!isNil(flowrMod)) {
          const originalRoundRect = ctx.roundRect;
          ctx.roundRect = function(x, y, w, h, radii) {
            if (ctx.globalAlpha === 0.5 && (ctx.fillStyle === "white" || ctx.fillStyle === "#ffffff")) {
              return;
            }
            originalRoundRect.apply(this, [x, y, w, h, radii]);
          };
        }
        const newCtx = airCtx[this.rarity];
        if (!airCachedThisFrame[this.rarity] && !isNil(newCtx)) {
          const oldCtx = ctx;
          ctx = newCtx;
          airPetals[this.rarity].stars = [];
          airPetals[this.rarity].draw();
          ctx = oldCtx;
          airCachedThisFrame[this.rarity] = true;
        }
        ctx.drawImage(airCanvases[this.rarity], -50, -50, 100, 100);
        this.drawStars();
        staticGradients[this.rarity] = "transparent";
        Colors.rarities[this.rarity].border = "transparent";
        if (!isNil(flowrMod)) {
          flowrMod.noFancy = true;
        } else {
          _unsafeWindow.hqp = false;
        }
        ctx.restore();
      }
    };
    function drawStar(x, y) {
      ctx.beginPath();
      let twinkleTime = Date.now() / 600;
      if (ctx === starCtx) {
        twinkleTime += simStarX / 30 + simStarY / 30;
      } else {
        twinkleTime += x / 30 + y / 30;
      }
      const grad = ctx.createRadialGradient(x, y, 15, x, y, 0);
      grad.addColorStop(0, "transparent");
      grad.addColorStop(0.8, `rgba(255,255,255,${(Math.cos(twinkleTime) + 1) * 0.8})`);
      grad.addColorStop(1, "white");
      ctx.fillStyle = grad;
      ctx.globalAlpha = 0.3;
      ctx.fillRect(-25, -25, 50, 50);
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#fff";
      ctx.arc(x, y, 1, 0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();
    }
    PetalContainer.prototype.drawStars = function() {
      const totalStars = Colors.rarities[this.rarity].fancy?.stars;
      if (!isNil(totalStars) && (_unsafeWindow.hqp && !flowrMod?.noFancy)) {
        if (isNil(this.stars)) {
          this.stars = [];
          for (let starnum = 0; starnum < totalStars; starnum++) {
            this.stars.push(
              { x: Math.random() * 50 - 25, y: Math.random() * 50 - 25 }
            );
          }
        }
        ctx.beginPath();
        ctx.roundRect(-22.75, -22.75, 45.5, 45.5, 0.25);
        ctx.clip();
        ctx.closePath();
        for (let star of this.stars) {
          star.x += 0.1;
          star.y += 0.1;
          if (star.x > 25 || star.y > 25) {
            star.x = Math.random() * 800 - 20 - 30;
            star.y = -30;
          }
          if (star.x < 25 && star.x > -25 && star.y < 25 && star.y > -25) {
            if (settings.get("petalStarCaching")) {
              ctx.drawImage(starCanvas, star.x - 15, star.y - 15, 30, 30);
            } else {
              drawStar(star.x, star.y);
            }
          }
        }
      }
    };
    function initializeCachedAir() {
      for (let rarity = 0; rarity <= MAX_RARITY; rarity++) {
        const newCanvas = new OffscreenCanvas(120, 120);
        airCanvases.push(newCanvas);
        airCtx.push(newCanvas.getContext("2d"));
        const airPetal = new PetalContainer(
          [new Petal({ type: "Air", rarity })],
          {
            x: 60,
            y: 60,
            w: 60,
            h: 60,
            toOscillate: false
          },
          Math.random(),
          1
        );
        airPetal.nameless = true;
        airPetal.spawnAnimation = 1;
        airPetals.push(airPetal);
        airCachedThisFrame.push(false);
      }
    }
  }
  function patchFlowrscriptPrototypes() {
    if (!isNil(flowrMod)) {
      const OldInventory = inventory.constructor;
      OldInventory.prototype.swapPetals = Inventory.prototype.swapPetals;
    }
  }
  function addPetalCraftPreview() {
    craftingMenu.previewPetalSlot = {
      x: craftingMenu.w * 0.83,
      y: craftingMenu.h * 0.167,
      w: 65,
      h: 65
    };
    const originalDrawCrafting = craftingMenu.drawInventory;
    craftingMenu.drawInventory = function(alpha = 1) {
      if (!settings.get("petalCraftPreview")) {
        originalDrawCrafting.apply(this, [alpha]);
        return;
      }
      originalDrawCrafting.apply(this, [alpha]);
      ctx.translate(130, this.renderY);
      if (!isNil(this.previewPetalContainer)) {
        this.previewPetalContainer.y = this.previewPetalSlot.y;
      }
      const slot = this.previewPetalSlot;
      ctx.fillStyle = this.getSlotColor();
      ctx.beginPath();
      ctx.roundRect(
        slot.x - this.petalContainerSize / 2,
        slot.y - this.petalContainerSize / 2,
        this.petalContainerSize,
        this.petalContainerSize,
        8
      );
      ctx.fill();
      ctx.closePath();
      ctx.fillStyle = "#f0f0f0";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 3.75;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "900 16px Ubuntu";
      ctx.strokeText("Preview", slot.x, slot.y - 55);
      ctx.fillText("Preview", slot.x, slot.y - 55);
      const mouseX = mouse.canvasX;
      const mouseY = mouse.canvasY;
      const container = this.previewPetalContainer;
      container?.draw();
      ctx.translate(-130, -this.renderY);
      if (!isNil(container)) {
        if (mouseInBox(
          { x: mouseX, y: mouseY },
          {
            x: container.render.x - container.w / 2 + 130,
            y: container.render.y - container.h / 2 + this.renderY,
            w: container.w,
            h: container.h
          }
        )) {
          container.isHovered = true;
        }
        container.drawStatsBox(
          false,
          false,
          container.render.x + 130,
          container.render.y + this.renderY
        );
      }
    };
    const originalAddPetal = craftingMenu.addCraftingPetalContainers;
    craftingMenu.addCraftingPetalContainers = function(type, rarity, amount, attempt) {
      originalAddPetal.apply(this, [type, rarity, amount, attempt]);
      const currentPetal = this.craftingPetalContainers[0];
      if (currentPetal !== void 0 && (this.previewPetalContainer?.type !== currentPetal.type || this.previewPetalContainer?.rarity !== currentPetal.rarity + 1)) {
        const slot = this.previewPetalSlot;
        this.previewPetalContainer = new PetalContainer(
          [new Petal({ type: currentPetal.type, rarity: currentPetal.rarity + 1 })],
          { x: slot.x, y: slot.y, w: 65, h: 65, toOscillate: false },
          Math.random(),
          1
        );
      }
    };
    const originalRemovePetal = craftingMenu.removeCraftingPetalContainers;
    craftingMenu.removeCraftingPetalContainers = function() {
      originalRemovePetal.apply(this);
      this.previewPetalContainer = void 0;
    };
    const originalEnterGame = craftingMenu.enterGame;
    craftingMenu.enterGame = function() {
      originalEnterGame.apply(this);
      this.previewPetalContainer = void 0;
    };
  }
  const petalLockIcon = new Image();
  petalLockIcon.src = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB3aWR0aD0iNTQuNTAwMzJtbSIKICAgaGVpZ2h0PSI2NC41MDAwMDhtbSIKICAgdmlld0JveD0iMCAwIDU0LjUwMDMyIDY0LjUwMDAwOCIKICAgdmVyc2lvbj0iMS4xIgogICBpZD0ic3ZnMSIKICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcwogICAgIGlkPSJkZWZzMSIgLz4KICA8ZwogICAgIGlkPSJsYXllcjEiCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTY5Ljk5OTk5OSwtNzApIj4KICAgIDxyZWN0CiAgICAgICBzdHlsZT0iZmlsbDojZGYwMmZmO2ZpbGwtb3BhY2l0eTowO3N0cm9rZTojZmZmZmZmO3N0cm9rZS13aWR0aDo0LjQ5ODtzdHJva2UtbGluZWNhcDpzcXVhcmU7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjE7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjE7cGFpbnQtb3JkZXI6bWFya2VycyBzdHJva2UgZmlsbCIKICAgICAgIGlkPSJyZWN0MiIKICAgICAgIHdpZHRoPSI1MC4wMDIzMTkiCiAgICAgICBoZWlnaHQ9IjUwLjAwMjMxOSIKICAgICAgIHg9IjcyLjI0OTAwMSIKICAgICAgIHk9IjcyLjI0OTAwMSIgLz4KICAgIDxyZWN0CiAgICAgICBzdHlsZT0iZmlsbDojZmZmZmZmO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTojZmZmZmZmO3N0cm9rZS13aWR0aDowO3N0cm9rZS1saW5lY2FwOnNxdWFyZTtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MTtwYWludC1vcmRlcjptYXJrZXJzIHN0cm9rZSBmaWxsIgogICAgICAgaWQ9InJlY3QzIgogICAgICAgd2lkdGg9IjgiCiAgICAgICBoZWlnaHQ9IjUiCiAgICAgICB4PSI5My4yNSIKICAgICAgIHk9IjEyOS41IiAvPgogICAgPGVsbGlwc2UKICAgICAgIHN0eWxlPSJmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjA7c3Ryb2tlOiNmZmZmZmY7c3Ryb2tlLXdpZHRoOjI7c3Ryb2tlLWxpbmVjYXA6c3F1YXJlO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoxO3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxO3BhaW50LW9yZGVyOm1hcmtlcnMgc3Ryb2tlIGZpbGwiCiAgICAgICBpZD0icGF0aDMiCiAgICAgICBjeD0iOTcuMjUiCiAgICAgICBjeT0iMTI5LjUiCiAgICAgICByeD0iMi41IgogICAgICAgcnk9IjQiIC8+CiAgPC9nPgo8L3N2Zz4K";
  function addPetalSlotLocking() {
    const lockManager = new LockManager();
    const oldDrawInventory = inventory.draw;
    inventory.draw = function(alpha) {
      oldDrawInventory.apply(this, [alpha]);
      lockManager.draw(this);
    };
    const oldDrawMenuInventory = menuInventory.draw;
    menuInventory.draw = function(alpha) {
      oldDrawMenuInventory.apply(this, [alpha]);
      lockManager.draw(this);
    };
    addKeybindInstruction({
      type: "settings",
      settingsKey: "keybindLockSlot",
      keyType: "keydown",
      inGame: true,
      inMenu: true,
      fn: () => {
        lockManager.lockKeybindHeld = true;
      }
    });
    addKeybindInstruction({
      type: "settings",
      settingsKey: "keybindLockSlot",
      keyType: "keyup",
      inGame: true,
      inMenu: true,
      fn: () => {
        lockManager.lockKeybindHeld = false;
      }
    });
    addKeybindInstruction({
      type: "rawValue",
      value: "KeyR",
      inGame: true,
      inMenu: true,
      beforeOriginal: true,
      fn: () => {
        lockManager.swappingAllPetals = true;
      }
    });
    addKeybindInstruction({
      type: "rawValue",
      value: "KeyR",
      inGame: true,
      inMenu: true,
      beforeOriginal: false,
      fn: () => {
        lockManager.swappingAllPetals = false;
      }
    });
    const originalSwap = Inventory.prototype.swapPetals;
    Inventory.prototype.swapPetals = function(index, toSend) {
      if (lockManager.toggleLock(this, index)) {
        return;
      }
      if (!lockManager.applyLock(this, index)) {
        originalSwap.apply(this, [index, toSend]);
      }
    };
  }
  class LockManager {
    /**
     * Whether or not each slot is currently locked.
     */
    slotLocked;
    /**
     * The *target* opacity of each lock icon (from 0 to 1) based the slot's
     * status, such as whether the user has locked it, whether it is currently
     * occupied, etc..
     */
    alpha;
    /**
     * The current opacity of each lock icon, which approaches 
     * {@linkcode alpha} smoothly.
     */
    renderAlpha;
    /**
     * Whether or not the user is holding the [Lock Petal Slot] key.
     */
    lockKeybindHeld;
    /**
     * The timer for each petal slot's shaking animation when the user tries to
     * swap a locked petal, in milliseconds.
     */
    shakeTimer;
    /**
     * Whether or not the user is currently swapping all petals by pressing [R].
     */
    swappingAllPetals;
    constructor() {
      const storedLocks = localStorage.getItem("cinderLocks");
      if (!isNil(storedLocks)) {
        this.slotLocked = JSON.parse(storedLocks);
      } else {
        this.slotLocked = Array(10).fill(false);
      }
      this.alpha = Array(10).fill(0);
      this.renderAlpha = Array(10).fill(0);
      this.shakeTimer = Array(10).fill(0);
      this.lockKeybindHeld = false;
      this.swappingAllPetals = false;
    }
    /**
     * A helper function to determine whether a slot is lockable, according to
     * the settings and the total number of petals that the loadout has.
     */
    isAllowedToLock(loadout, slot) {
      return (slot >= 5 || settings.get("allowLockSlotsOneToFive")) && slot < loadout.topPetalSlots.length;
    }
    /**
     * Draws the lock icons onto the petal slots of the given loadout.
     */
    draw(loadout) {
      for (let i = 0; i < 10; i++) {
        if (!this.isAllowedToLock(loadout, i)) {
          this.slotLocked[i] = false;
        }
      }
      for (let i = 0; i < loadout.topPetalSlots.length; i++) {
        this.updateAlpha(loadout, i);
        this.drawIcon(loadout, i);
      }
      ctx.globalAlpha = 1;
    }
    /**
     * A helper function to update {@linkcode alpha} and {@linkcode renderAlpha}
     * for a single slot.
     */
    updateAlpha(loadout, slot) {
      const petal = loadout.topPetalContainers[slot];
      const slotObject = loadout.topPetalSlots[slot];
      if (!this.isAllowedToLock(loadout, slot)) {
        this.alpha[slot] = 0;
      } else if (this.slotLocked[slot]) {
        if (isNil(petal) || Math.abs(petal.render.x - slotObject.x) > 5 || Math.abs(petal.render.y - slotObject.y) > 5) {
          this.alpha[slot] = 0.5;
        } else {
          this.alpha[slot] = 1;
        }
      } else {
        if (this.lockKeybindHeld) {
          this.alpha[slot] = 0.5;
        } else {
          this.alpha[slot] = 0;
        }
      }
      this.renderAlpha[slot] = interpolate(this.renderAlpha[slot], this.alpha[slot], dt / 200);
    }
    /**
     * A helper function to draw the lock icon for a single petal slot.
     */
    drawIcon(loadout, slot) {
      const sizeMult = this.alpha[slot] === 1 ? Math.pow(1 + PETAL_BORDER_RATIO / 2, 2) : 1 + PETAL_BORDER_RATIO / 2 + 0.02;
      const iconRatio = petalLockIcon.height / petalLockIcon.width;
      const slotObject = loadout.topPetalSlots[slot];
      this.shakeTimer[slot] = Math.max(0, this.shakeTimer[slot] - dt);
      const intensity = settings.get("petalLockShakeIntensity");
      const iconX = slotObject.x - sizeMult * slotObject.size / 2 + intensity * Math.sin(this.shakeTimer[slot] * 2 * Math.PI / 75);
      ctx.globalAlpha = this.renderAlpha[slot];
      ctx.drawImage(
        petalLockIcon,
        iconX,
        slotObject.y - sizeMult * slotObject.size / 2 + loadout.translateY,
        sizeMult * slotObject.size,
        sizeMult * slotObject.size * iconRatio
      );
    }
    /**
     * Toggles the given slot's lock status if the slot is lockable.
     * 
     * Locking petals requires the following 3 criteria:
     * 1. The user is holding the [Lock Petal Slot] key.
     * 2. The user is allowed to lock the given slot.
     * 3. The user is not pressing [R] to swap the entire loadout.
     * 
     * @returns `true` iff the slot was successfully toggled.
     */
    toggleLock(loadout, slot) {
      if (this.lockKeybindHeld && this.isAllowedToLock(loadout, slot) && !this.swappingAllPetals) {
        this.slotLocked[slot] = !this.slotLocked[slot];
        localStorage.setItem("cinderLocks", JSON.stringify(this.slotLocked));
        if (this.slotLocked[slot]) {
          this.shakeTimer[slot] = 225;
        }
        return true;
      }
      return false;
    }
    /**
     * @returns `true` iff the slot is currently locked.
     */
    applyLock(loadout, slot) {
      if (this.slotLocked[slot] && !isNil(loadout.topPetalContainers[slot])) {
        this.shakeTimer[slot] = 225;
        return true;
      }
      return false;
    }
  }
  function addQuickStatsBoxHotkey() {
    let showQuickStatsBox = false;
    addKeybindInstruction({
      type: "settings",
      settingsKey: "keybindStatsBox",
      fn: () => {
        showQuickStatsBox = !showQuickStatsBox;
      }
    });
    const originalRenderGame = renderGame;
    renderGame = (dt2) => {
      const originalDrawStatsBox = PetalContainer.prototype.drawStatsBox;
      if (showQuickStatsBox) {
        PetalContainer.prototype.drawStatsBox = function(drawBelow, mob, x, y) {
          if (this.petals[0]?.constructor === Petal) {
            originalDrawStatsBox.apply(this, [drawBelow, mob, x, y]);
          }
        };
      }
      originalRenderGame(dt2);
      PetalContainer.prototype.drawStatsBox = originalDrawStatsBox;
      if (showQuickStatsBox) {
        const totalCount = {};
        for (let enemyBox of Object.values(room.enemyBoxes)) {
          totalCount[enemyBox.type] ??= 0;
          totalCount[enemyBox.type] += enemyBox.amount;
        }
        let highestBox = void 0;
        for (let enemyBox of Object.values(room.enemyBoxes)) {
          if (isNil(highestBox) || enemyBox.rarity > highestBox.rarity || enemyBox.rarity === highestBox.rarity && totalCount[enemyBox.type] <= totalCount[highestBox.type]) {
            if (!enemyBox.isBoss) {
              highestBox = enemyBox;
            }
          }
        }
        if (!isNil(highestBox)) {
          if (isNil(highestBox.ec)) {
            highestBox.ec = mobGallery.generateEnemyPc(
              highestBox.type,
              highestBox.rarity,
              1
            );
          }
          if (!Stats.enemies[highestBox.type]) {
            calculateStats();
          } else {
            highestBox.ec.isHovered = true;
            highestBox.ec.drawStatsBox(
              true,
              true,
              canvas.w / 2 + highestBox.x,
              highestBox.y + highestBox.w / 2 + 3 * highestBox.w / 5
            );
          }
        }
      }
    };
  }
  function addRandomizedSquadCodes() {
    const originalSendRoomRequest = sendRoomRequest;
    sendRoomRequest = function(msg) {
      if (msg.findPrivate === true && msg.squadCode === "") {
        const newCode = randomSquadCode();
        msg.squadCode = newCode;
        if (settings.get("autoCopyCodes")) {
          navigator.clipboard.writeText(newCode);
          chatAnnounce("Code copied to clipboard! (" + newCode + ")");
        } else {
          chatAnnounce("Random code generated! (" + newCode + ")");
        }
      }
      originalSendRoomRequest(msg);
    };
    const originalPrompt = prompt;
    _unsafeWindow.prompt = function(msg, _def) {
      if (msg === "Enter Private Squad Code") {
        msg = "Enter private squad code (leave empty to generate a random code):";
      }
      return originalPrompt(msg, _def);
    };
  }
  function randomSquadCode() {
    let squadCode = "";
    let hasLetter = false;
    for (let i = 0; i < 6; i++) {
      const roll = Math.floor(Math.random() * 16);
      if (roll < 10) {
        squadCode += String.fromCharCode("0".charCodeAt(0) + roll);
      } else {
        squadCode += String.fromCharCode("a".charCodeAt(0) + roll - 10);
        hasLetter = true;
      }
    }
    return hasLetter ? squadCode : randomSquadCode();
  }
  function prioritizeRenderingStatsBoxes() {
    const statsBoxCanvas = document.createElement("canvas");
    statsBoxCanvas.style = "z-index: 2; pointer-events: none";
    document.body.appendChild(statsBoxCanvas);
    const statsBoxCtx = statsBoxCanvas.getContext("2d");
    const originalStatsBoxDraw = StatsBox.prototype.draw;
    StatsBox.prototype.draw = function() {
      statsBoxCanvas.width = canvas.width;
      statsBoxCanvas.height = canvas.height;
      const originalCtx = ctx;
      if (!isNil(statsBoxCtx)) {
        ctx = statsBoxCtx;
        ctx.globalAlpha = originalCtx.globalAlpha;
        ctx.setTransform(originalCtx.getTransform());
      }
      originalStatsBoxDraw.apply(this);
      ctx = originalCtx;
    };
    const originalDraw = draw;
    draw = function() {
      statsBoxCtx?.reset();
      statsBoxCtx?.clearRect(0, 0, statsBoxCanvas.width, statsBoxCanvas.height);
      originalDraw();
    };
  }
  function widerMobStatsBoxes() {
    const originalGenerateDesc = StatsBox.prototype.generateDesc;
    StatsBox.prototype.generateDesc = function(min, max) {
      const dimensions = originalGenerateDesc.apply(this, [min, max]);
      ctx.font = `900 ${1.2 * 22.5}px Ubuntu`;
      const textWidth = ctx.measureText(this.name).width;
      dimensions.width = Math.max(dimensions.width, textWidth + 175);
      dimensions.width = Math.max(Math.min(dimensions.width, max), min);
      return dimensions;
    };
  }
  function allowEditingKeybinds() {
    const originalHandleKey = inputHandler.handleKey;
    inputHandler.handleKey = function(e) {
      if ((_unsafeWindow.state === "menu" || !settings.get("hideSettingsDuringRuns")) && e.type === "keydown" && !e.repeat && !isNil(cinderSettingsMenu.currentKeybindOption)) {
        if (e.code === "Delete") {
          cinderSettingsMenu.currentKeybindOption.finishEdit(KEYBIND_DELETED);
        } else {
          cinderSettingsMenu.currentKeybindOption.finishEdit(e.code);
        }
        cinderSettingsMenu.cancelKeybind();
        return;
      }
      originalHandleKey.apply(inputHandler, [e]);
    };
  }
  function handleMenuTranslations() {
    for (let menu of MENU_LIST) {
      if (isTopMenu(menu)) {
        Object.defineProperty(menu, "renderY", {
          get: function() {
            return this.y + this.offset;
          }
        });
      } else {
        Object.defineProperty(menu, "renderY", {
          get: function() {
            this.lastOpenTime ??= time - 160;
            this.lastCloseTime ??= time - 160;
            if (!this.menuActive && time - this.lastCloseTime >= 160) {
              return canvas.h;
            }
            let translate = 0;
            if (time - this.lastCloseTime < 160) {
              translate += this.h * easeOutCubic((time - this.lastCloseTime) / 160);
            }
            if (time - this.lastOpenTime < 160) {
              translate += (this.h + 40) * (1 - easeOutCubic((time - this.lastOpenTime) / 160));
            }
            return canvas.h - this.h - 20 + translate;
          }
        });
      }
    }
  }
  function initExportedObjects() {
    initSettingsManager();
    initSettingsMenu();
    initChangelog();
    initMobCounters();
    initMenuList();
  }
  function initTheoryCraft() {
    if (theoryCraft.length > 0) {
      console.warn("theoryCraft already initialized!");
      return;
    }
    for (let rarity = 0; rarity <= MAX_PETAL_RARITY; rarity++) {
      theoryCraft.push(5);
      let probFailedSoFar = 1;
      let attempt = 0;
      while (probFailedSoFar > 0) {
        probFailedSoFar *= 1 - calculateChance(attempt, rarity) / 100;
        theoryCraft[rarity] += probFailedSoFar * 2.5;
        attempt++;
      }
    }
  }
  function addNewMenuButtons() {
    const menuSeparatorLine = document.createElement("div");
    menuSeparatorLine.id = "menuSeparatorLine";
    const buttonList = changelogButton.parentElement;
    buttonList?.appendChild(menuSeparatorLine);
    const settingsImage = new Image(35, 35);
    settingsImage.src = `gfx/gear.png?v=${ver}`;
    settingsImage.draggable = false;
    const cinderSettingsButton = document.createElement("div");
    cinderSettingsButton.className = "cinderMenuButton";
    cinderSettingsButton.appendChild(settingsImage);
    cinderSettingsButton.onclick = () => {
      cinderSettingsMenu.toggle();
    };
    buttonList?.appendChild(cinderSettingsButton);
    const githubIcon = new Image(35, 35);
    githubIcon.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik01Ni43OTM3IDg0Ljk2ODhDNDQuNDE4NyA4My40Njg4IDM1LjcgNzQuNTYyNSAzNS43IDYzLjAzMTNDMzUuNyA1OC4zNDM4IDM3LjM4NzUgNTMuMjgxMyA0MC4yIDQ5LjkwNjNDMzguOTgxMiA0Ni44MTI1IDM5LjE2ODcgNDAuMjUgNDAuNTc1IDM3LjUzMTNDNDQuMzI1IDM3LjA2MjUgNDkuMzg3NSAzOS4wMzEzIDUyLjM4NzUgNDEuNzVDNTUuOTUgNDAuNjI1IDU5LjcgNDAuMDYyNSA2NC4yOTM3IDQwLjA2MjVDNjguODg3NSA0MC4wNjI1IDcyLjYzNzUgNDAuNjI1IDc2LjAxMjUgNDEuNjU2M0M3OC45MTg3IDM5LjAzMTMgODQuMDc1IDM3LjA2MjUgODcuODI1IDM3LjUzMTNDODkuMTM3NSA0MC4wNjI1IDg5LjMyNSA0Ni42MjUgODguMTA2MiA0OS44MTI1QzkxLjEwNjIgNTMuMzc1IDkyLjcgNTguMTU2MyA5Mi43IDYzLjAzMTNDOTIuNyA3NC41NjI1IDgzLjk4MTIgODMuMjgxMyA3MS40MTg3IDg0Ljg3NUM3NC42MDYyIDg2LjkzNzUgNzYuNzYyNSA5MS40Mzc1IDc2Ljc2MjUgOTYuNTkzOEw3Ni43NjI1IDEwNi4zNDRDNzYuNzYyNSAxMDkuMTU2IDc5LjEwNjIgMTEwLjc1IDgxLjkxODcgMTA5LjYyNUM5OC44ODc1IDEwMy4xNTYgMTEyLjIgODYuMTg3NSAxMTIuMiA2NS4xODc1QzExMi4yIDM4LjY1NjMgOTAuNjM3NSAxNyA2NC4xMDYyIDE3QzM3LjU3NSAxNyAxNi4yIDM4LjY1NjIgMTYuMiA2NS4xODc1QzE2LjIgODYgMjkuNDE4NyAxMDMuMjUgNDcuMjMxMiAxMDkuNzE5QzQ5Ljc2MjUgMTEwLjY1NiA1Mi4yIDEwOC45NjkgNTIuMiAxMDYuNDM4TDUyLjIgOTguOTM3NUM1MC44ODc1IDk5LjUgNDkuMiA5OS44NzUgNDcuNyA5OS44NzVDNDEuNTEyNSA5OS44NzUgMzcuODU2MiA5Ni41IDM1LjIzMTIgOTAuMjE4OEMzNC4yIDg3LjY4NzUgMzMuMDc1IDg2LjE4NzUgMzAuOTE4NyA4NS45MDYzQzI5Ljc5MzcgODUuODEyNSAyOS40MTg3IDg1LjM0MzggMjkuNDE4NyA4NC43ODEzQzI5LjQxODcgODMuNjU2MyAzMS4yOTM3IDgyLjgxMjUgMzMuMTY4NyA4Mi44MTI1QzM1Ljg4NzUgODIuODEyNSAzOC4yMzEyIDg0LjUgNDAuNjY4NyA4Ny45Njg4QzQyLjU0MzcgOTAuNjg3NSA0NC41MTI1IDkxLjkwNjMgNDYuODU2MiA5MS45MDYzQzQ5LjIgOTEuOTA2MyA1MC43IDkxLjA2MjUgNTIuODU2MiA4OC45MDYzQzU0LjQ1IDg3LjMxMjUgNTUuNjY4NyA4NS45MDYzIDU2Ljc5MzcgODQuOTY4OFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=";
    githubIcon.id = "githubIcon";
    githubIcon.draggable = false;
    const githubButton = document.createElement("div");
    githubButton.className = "cinderMenuButton";
    const githubLink = document.createElement("a");
    githubLink.href = "https://github.com/PigeonBar/flowr-cinderscript";
    githubLink.target = "_blank";
    githubLink.title = "Check out Cinderscript on GitHub!";
    githubLink.appendChild(githubIcon);
    githubButton.appendChild(githubLink);
    buttonList?.appendChild(githubButton);
    const changelogImage = new Image(24, 24);
    changelogImage.src = `gfx/scroll.png?v=${ver}`;
    changelogImage.draggable = false;
    const cinderChangelogButton = document.createElement("div");
    cinderChangelogButton.className = "cinderMenuButton";
    cinderChangelogButton.appendChild(changelogImage);
    cinderChangelogButton.onclick = () => {
      cinderChangelog.toggle();
    };
    buttonList?.appendChild(cinderChangelogButton);
    const styles = `
    #menuSeparatorLine {
      background-color: ${CINDER_BORDER_COLOUR};
      margin-left: 10px;
      margin-top: 10px;
      width: 41px;
      height: 5px;
      border-radius: 3px;
    }

    #githubIcon {
      margin-top: 3px;
    }

    .cinderMenuButton {
      border-color: ${CINDER_BORDER_COLOUR};
      border-style: solid;
      border-width: 3px;
      background-color: ${CINDER_COLOUR};
      border-radius: 8px;
      margin-left: 10px;
      margin-top: 10px;
      width: 35px;
      height: 35px;
      transition: background-color 0.1s;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    .cinderMenuButton:hover {
      cursor: pointer;
      background-color: ${LIGHT_CINDER_COLOUR};
    }
    
    #changelogButton:hover {
      cursor: pointer;  /* I think the Flowr devs forgot to add this */
    }
  `;
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
  }
  function initPetalDrawingUtils() {
    PetalContainer.prototype.getScale = function() {
      let scale = this.render.w / 50;
      const renderAnimationTimer = smoothstep(this.spawnAnimation);
      scale *= renderAnimationTimer;
      if (this.toOscillate) {
        scale *= 1 + Math.sin(performance.now() / 1e3 / 0.076) / 52;
      }
      return scale;
    };
    PetalContainer.prototype.getRotation = function() {
      let rotation = 0;
      const renderAnimationTimer = smoothstep(this.spawnAnimation);
      rotation -= (1 - renderAnimationTimer) * Math.PI * 3;
      if (this.isDraggingPetalContainer) {
        this.draggingTimer ??= 0;
        const nextFrameTimer = this.draggingTimer + 1e3 / 30 * dt / 16.66;
        rotation += Math.sin(nextFrameTimer / 280) * 0.28;
      } else if (!isNil(this.undraggingPetalContainerTimer)) {
        if (isNil(this.interval)) {
          this.lastDraggingAngle ??= 0;
          rotation += interpolate(this.lastDraggingAngle, 0, 0.15);
        }
      }
      if (this.toOscillate === true) {
        this.angleOffset ??= 0;
        rotation += this.angleOffset;
      }
      return rotation;
    };
    PetalContainer.prototype.shouldAnimate = function() {
      return !NON_ANIM_PETALS.includes(this.type) && !settings.get("disablePetalAnimations");
    };
    PetalContainer.prototype.drawAmount = function(textColour = "white") {
      ctx.save();
      const scale = this.getScale();
      ctx.translate(this.render.x, this.render.y);
      if (performance.now() - this.lastAmountChangedTime < 240) {
        ctx.globalAlpha = smoothstep(
          (performance.now() - this.lastAmountChangedTime) / 240
        );
      }
      ctx.font = `600 ${13 * scale}px Ubuntu`;
      ctx.letterSpacing = "1px";
      ctx.textBaseline = "middle";
      ctx.textAlign = "right";
      ctx.fillStyle = textColour;
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.translate((70 / 2.5 + 0.5) * scale, (-42 / 2.5 + 0.5) * scale);
      ctx.rotate(Math.PI / 9.1);
      if (this.greyed) {
        ctx.globalAlpha *= 0.3;
      }
      ctx.strokeText("x" + formatAmount(this.amount), 0, 0);
      ctx.fillText("x" + formatAmount(this.amount), 0, 0);
      ctx.restore();
    };
  }
  function preventClickingBehindMenus() {
    const originalMouseDown = menuInventory.mouseDown;
    menuInventory.mouseDown = function({ mouseX, mouseY }, inv) {
      if (!mouseOnMenu()) {
        originalMouseDown.apply(this, [{ mouseX, mouseY }, inv]);
      }
    };
    const originalAddClosest = menuInventory.addClosest;
    menuInventory.addClosest = function(p, globalInv) {
      if (!mouseOnMenu()) {
        return originalAddClosest.apply(this, [p, globalInv]);
      } else {
        return false;
      }
    };
    const originalDrawStats = PetalContainer.prototype.drawStatsBox;
    PetalContainer.prototype.drawStatsBox = function(drawBelow, mob, x, y) {
      if (isNil(this.hasParentMenu)) {
        if (mob) {
          this.hasParentMenu = this === mobGallery.rows[this.type]?.[this.rarity];
        } else {
          this.hasParentMenu = !Object.values(menuInventory.topPetalContainers).includes(this) && !Object.values(menuInventory.bottomPetalContainers).includes(this) && !Object.values(inventory.topPetalContainers).includes(this) && !Object.values(inventory.bottomPetalContainers).includes(this);
        }
      }
      if (!this.hasParentMenu && mouseOnMenu()) {
        this.isHovered = false;
      }
      originalDrawStats.apply(this, [drawBelow, mob, x, y]);
    };
    const originalGetClosest = menuInventory.getClosest;
    menuInventory.getClosest = function(p) {
      if (!mouseOnMenu()) {
        return originalGetClosest.apply(menuInventory, [p]);
      } else {
        return false;
      }
    };
    const originalRender = squadUI.render;
    squadUI.render = function(dt2) {
      const originalX = mouse.canvasX;
      const originalY = mouse.canvasY;
      if (mouseOnMenu()) {
        mouse.canvasX = mouse.canvasY = -1e99;
      }
      originalRender.apply(this, [dt2]);
      mouse.canvasX = originalX;
      mouse.canvasY = originalY;
    };
    const originalStartSliderDrag = squadUI.startSliderDrag;
    squadUI.startSliderDrag = function(x) {
      if (!mouseOnMenu()) {
        originalStartSliderDrag.apply(this, [x]);
      }
    };
    const originalBiomeMouseDown = biomeManager.mouseDown;
    biomeManager.mouseDown = function({ mouseX, mouseY }) {
      if (!mouseOnMenu()) {
        originalBiomeMouseDown.apply(this, [{ mouseX, mouseY }]);
      }
    };
    const originalWindowMouseDown = _unsafeWindow.onmousedown;
    _unsafeWindow.onmousedown = function(e) {
      originalWindowMouseDown?.apply(_unsafeWindow, [e]);
      if (mouseOnMenu()) {
        mouse.clickPosition = "up";
      }
    };
  }
  function preventMenuOverlap() {
    for (let menu of MENU_LIST) {
      if (isShop(menu)) {
        const originalToggle = menu.toggle;
        menu.toggle = function() {
          if (!menu.menu.active) {
            closeAllMenus();
          }
          originalToggle.apply(menu);
        };
      } else if (isTopMenu(menu)) {
        const originalToggle = menu.toggle;
        menu.toggle = function() {
          if (!menu.active) {
            closeAllMenus();
          }
          originalToggle.apply(menu);
        };
      } else {
        const originalToggle = menu.toggleMenu;
        menu.toggleMenu = function() {
          if (!menu.menuActive) {
            closeAllMenus();
          }
          originalToggle.apply(menu);
        };
      }
    }
    const ascendUI = _unsafeWindow.ascendUI;
    if (!isNil(ascendUI)) {
      const originalDraw = ascendUI.draw;
      ascendUI.draw = function() {
        if (isNil(this.offset)) {
          this.offset = 0;
        }
        if (cinderSettingsMenu.colourSelectorUi.active) {
          this.offset = interpolate(this.offset, -200, 0.2);
        } else {
          this.offset = interpolate(this.offset, 0, 0.2);
        }
        ctx.translate(0, this.offset);
        originalDraw.apply(this);
        ctx.translate(0, -this.offset);
      };
      Object.defineProperty(ascendUI, "buttonDimensions", {
        get: function() {
          return {
            x: canvas.w / 2 - 34.2266 * 4 / 2,
            y: 18.5 * 2 + (this.offset ?? 0),
            w: 34.2266 * 4,
            h: 40
          };
        },
        set: () => {
        }
      });
    }
    const originalLevelInit = levelBar.init;
    levelBar.init = function(xp) {
      originalLevelInit.apply(this, [xp]);
      const charSelector = _unsafeWindow.characterSelector;
      if (!isNil(charSelector)) {
        const originalDraw = charSelector.draw;
        charSelector.draw = function() {
          if (isNil(this.offset)) {
            this.offset = 0;
          }
          if (cinderSettingsMenu.colourSelectorUi.active) {
            this.offset = interpolate(this.offset, -200, 0.2);
          } else {
            this.offset = interpolate(this.offset, 0, 0.2);
          }
          ctx.translate(0, this.offset);
          originalDraw.apply(this);
          ctx.translate(0, -this.offset);
          for (let char of this.characters) {
            char.y += this.offset;
          }
        };
      }
    };
    if (!isNil(flowrMod)) {
      const originalDrawIcon = flowrMod.flowrSettingsMenu.drawIcon;
      flowrMod.flowrSettingsMenu.drawIcon = function(alpha) {
        if (_unsafeWindow.state === "menu") {
          for (let menu of MENU_LIST) {
            if (isTopMenu(menu) && menu !== flowrMod?.flowrSettingsMenu && menu.active) {
              return;
            }
          }
        }
        originalDrawIcon.apply(this, [alpha]);
      };
    }
  }
  function closeAllMenus() {
    for (let menu of MENU_LIST) {
      if (isShop(menu)) {
        if (menu.menu.active) {
          menu.toggle();
        }
      } else if (isTopMenu(menu)) {
        if (menu.active) {
          menu.toggle();
        }
      } else {
        if (menu.menuActive) {
          menu.toggleMenu();
        }
      }
    }
  }
  function blockFovChangeFromSettingsScroll() {
    let previousFrameFov = fov;
    const originalRenderGame = renderGame;
    renderGame = (dt2) => {
      if (cinderSettingsMenu.hasRecentMouseScroll()) {
        fov = previousFrameFov;
      }
      previousFrameFov = fov;
      originalRenderGame(dt2);
    };
  }
  function unfreezeObjects() {
    processGameMessageMap = { ...processGameMessageMap };
    Colors.rarities = structuredClone(Colors.rarities);
  }
  function refreezeObjects() {
    Object.freeze(processGameMessageMap);
  }
  const mainScriptPromise = new Promise(async (resolve) => {
    await new Promise((resolve2) => setTimeout(resolve2, 1e3));
    initFlowrscriptPointer();
    initExportedObjects();
    unfreezeObjects();
    initTheoryCraft();
    allowWsDataEditing();
    preventMenuOverlap();
    initKeybindHandling();
    allowEditingKeybinds();
    addNewMenuButtons();
    handleMenuTranslations();
    initPetalDrawingUtils();
    blockFovChangeFromSettingsScroll();
    addPetalCraftPreview();
    addCraftingSearchBar();
    addRandomizedSquadCodes();
    displayMissilesAboveEnemies();
    modifyBaseFOV();
    enlargeZoomedOutItems();
    fixNegativeRadiusFreeze();
    enableInvertAttackAndDefend();
    prioritizeRenderingStatsBoxes();
    preventClickingBehindMenus();
    fixDraggingPetalsOutOfBounds();
    addInventoryMenuExpansion();
    autoReducePetalQuality();
    allowFastCrafting();
    optimizeHighQualityRenders();
    addPetalSlotLocking();
    addMobGalleryKillCounter();
    widerMobStatsBoxes();
    addGalleryCounterDropdownMenu();
    addQuickStatsBoxHotkey();
    handleBackgroundColourSettings();
    addScreenshotMode();
    addScriptVersionToDebugInfo();
    displayMobGalleryOutsideMenu();
    prioritizeRenderingDragPetal();
    patchFlowrscriptPrototypes();
    refreezeObjects();
    resolve();
  });
  const originalOnLoad = _unsafeWindow.onload;
  _unsafeWindow.onload = function(ev) {
    mainScriptPromise.then(
      () => {
        originalOnLoad?.apply(_unsafeWindow, [ev]);
      }
    );
  };

})();