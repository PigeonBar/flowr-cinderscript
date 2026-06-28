import { Rarity } from "../enums";

// TODO: Move colour and UI consts to separate files

/**
 * A lighter version of {@linkcode CINDER_COLOUR}.
 */
export const LIGHT_CINDER_COLOUR = "#ffaf60";

/**
 * A standard colour for this script, based on the Cinderleaf petal's colour.
 */
export const CINDER_COLOUR = "#fc9547";

/**
 * The colour of the Cinderleaf petal's border.
 */
export const CINDER_BORDER_COLOUR = "#cc7b3d";

/**
 * A lighter version of {@linkcode SETTINGS_GRAY}.
 */
export const LIGHT_SETTINGS_GRAY = "#cacaca";

/**
 * The colour of the settings menu's fill, copied from Flowr's base code.
 */
export const SETTINGS_GRAY = "#aaaaaa";

/**
 * The colour of the settings menu's border, copied from Flowr's base code.
 */
export const SETTINGS_GRAY_BORDER = "#8a8a8a";

/**
 * The default colour of a displayed settings value.
 */
export const SETTINGS_GREEN = "#3fff3f";

/**
 * The colour of a grayed out settings value.
 */
export const SETTINGS_VALUE_GRAY = "#afafaf";

/**
 * The colour of a settings value that has some sort of error.
 */
export const SETTINGS_RED = "#ff0000";

/**
 * The colour used for tooltips and tooltip icons.
 */
export const TOOLTIP_BLUE = "#7f7fff";

/**
 * The colour used for the borders of tooltip icons.
 */
export const TOOLTIP_BORDER_BLUE = "#3f3fff";

/**
 * A colour for light red text.
 */
export const TEXT_LIGHT_RED = "#ffbfbf";

/**
 * A colour for light blue text.
 */
export const TEXT_LIGHT_BLUE = "#bfbfff";

/**
 * A colour used for green minimap icons.
 */
export const MINIMAP_GREEN = "#00ff00";

/**
 * A colour used for yellow minimap icons.
 */
export const MINIMAP_YELLOW = "#ffe763";

/**
 * A colour used for red minimap icons.
 */
export const MINIMAP_RED = "#bb0000";

/**
 * The standard colour used for a "Close" button's fill.
 */
export const X_BUTTON_FILL = "#c1565e";

/**
 * The standard colour used for a "Close" button's fill when the user's mouse
 * is hovering over the button.
 */
export const X_BUTTON_FILL_HOVERED = "#c16666";

/**
 * The standard colour used for a "Close" button's stroke.
 */
export const X_BUTTON_STROKE = "#90464b";

/**
 * The total height of an option in the settings menu, from Flowr's base code.
 */
export const SETTINGS_OPTION_HEIGHT = 50;

/**
 * The size of each button in the settings menu, from Flowr's base code.
 */
export const SETTINGS_BUTTON_SIZE = 28;

/**
 * The padding to the right of each settings button, from Flowr's base code.
 */
export const SETTINGS_BUTTON_PADDING = 13;

/**
 * The size of the 'Edit' icon in the settings menu.
 */
export const EDIT_ICON_SIZE = 20;

/**
 * The width of the 'Delete' icon in the hotkeys editor.
 */
export const DELETE_ICON_WIDTH = EDIT_ICON_SIZE * 2 / 3;

/**
 * The diameter of the ? tooltip icon in the settings menu.
 */
export const TOOLTIP_ICON_SIZE = 20;

/**
 * The maximum possible width of a line of tooltip text.
 */
export const TOOLTIP_WIDTH_CAP = 400;

/**
 * The length of the settings menu's scrollbar.
 */
export const SCROLLBAR_LENGTH = 200;

/**
 * The minimum vertical position of the scrollbar, in order to apply padding.
 * This position also gets reflected to determine a maximum position.
 */
export const SETTINGS_SCROLLBAR_MIN_POS = 120;

/**
 * The height of each line of text in a tooltip (including spacing).
 */
export const TOOLTIP_TEXT_HEIGHT = 22.5;

/**
 * Extra height given to the mob gallery to make space for the dropdown menu.
 */
export const GALLERY_EXTRA_HEIGHT = 100;

/**
 * The amount of padding above the top row of gallery entries, to ensure there
 * is enough space to display the mob counter.
 */
export const GALLERY_TOP_PADDING = 5;

/**
 * The amount of extra horizontal space given to `mobGallery.inventorySpace`,
 * since it is no longer constrained by the X button.
 */
export const GALLERY_EXTRA_HOR_SPACE = 27;

/**
 * The amount of padding used by the dropdown UI.
 */
export const DROPDOWN_UI_PADDING = 13;

/**
 * The ratio of a petal's border width to the side length of the petal. The
 * border is drawn 0.09 side lengths outwards and 0.09 side lengths inwards
 * from the petal's sides.
 */
export const PETAL_BORDER_RATIO = 0.18;

/**
 * A special key to indicate that a keybind setting was deleted by the user.
 */
export const KEYBIND_DELETED = "<None>";

/**
 * The maximum rarity whose petal stats have been configured by the Flowr devs.
 */
export const MAX_PETAL_RARITY = Rarity.CHAOS;

/**
 * The maximum rarity overall that has been configured by the Flowr devs.
 */
export const MAX_RARITY = Colors.rarities.length;

/**
 * A list of petals that are not animated when displayed in a petal container.
 * Examples of petals that *do* have animations are Cutter (rotation) and
 * Radiance (randomly oscillating particles).
 */
export const NON_ANIM_PETALS = Object.freeze([
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
  "Carrot",
  "Wax",
]);

/**
 * A list of mob species that have a low movement speed. This includes fully
 * stationary mobs (e.g., Cactus) and mobs with random slow movements
 * (e.g., Sandstorm).
 */
export const LOW_SPEED_MOBS = Object.freeze([
  "Rock",
  "Sandstone",
  "Soil",
  "Plastic",
  "Shiny Plastic",
  "Dandelion",
  "Baby Ant",
  "Baby Termite",
  "Termite Mound",
  "Gnat Swarm",
  "Termite Egg",
  "Fire Ant Burrow",
  "Baby Fire Ant",
  "Ant Egg",
  "Fire Ant Egg",
  "Shiny Ant Egg",
  "Sea Floor Burrow",
  "Ant Burrow",
  "Shiny Ant Burrow",
  "Tree",
  "Root",
  "Cactus",
  "Shiny Cactus",
  "Sandstorm",
  "BossRose",
  "BossRose2",
  "BossBud",
  "BossTrident",
  "Square",
  "Pentagon",
  "Hexagon",
  "Wax",
  "Bubble",
  "Sponge",
  "Mushroom",
  "Coral",
  "Lilypad",
  "Flowering Lilypad",
  "Whirlpool",
]);

/**
 * A list of mob species that are rarer and more valuable than other similar
 * species (e.g., Shiny mobs).
 */
export const RARE_MOBS = Object.freeze([
  "Shiny Plastic",
  "Queen Fire Ant",
  "Queen Shiny Ant",
  "Soldier Shiny Ant",
  "Shiny Ant Burrow",
  "Evil Desert Centipede",
  "Shiny Cactus",
  "Golden Ladybug",
  "Ocean Ladybug",
  "Shiny Beetle",
  "Dark Beetle",
  "Ruby Frog",
  "Square",
  "Pentagon",
  "Hexagon",
  "Dark Electric Eel",
  "Shiny Electric Eel",
  "Shiny Lilypad",
]);

/**
 * A list of letter keys that are reserved afor important actions in Flowr's
 * base code. This includes:
 * - W, A, S, D: Movement keys
 * - Q, E: Adjust petal rotation speed
 * - R: Swap all petals
 * - Digits 0-9: Swap a single petal
 * - '-', '=', and '[': Control zoom level
 * - ';': Toggles debug info and hitboxes
 */
export const BASE_GAME_HOTKEYS = Object.freeze([
  "KeyW",
  "KeyA",
  "KeyS",
  "KeyD",
  "KeyQ",
  "KeyE",
  "KeyR",
  "Digit0",
  "Digit1",
  "Digit2",
  "Digit3",
  "Digit4",
  "Digit5",
  "Digit6",
  "Digit7",
  "Digit8",
  "Digit9",
  "Minus",
  "Equal",
  "BracketLeft",
  "Semicolon",
]);

/**
 * The full list of Flowrscript's chat hotkeys.
 */
export const FLOWRSCRIPT_HOTKEYS = Object.freeze([
  {
    chatMsg: "I hope your whole family has a nice Christmas.",
    keybind: "KeyL",
  },
  {
    chatMsg: "/deaths",
    keybind: "KeyU",
  },
  {
    chatMsg: "/damage",
    keybind: "KeyK",
  },
  {
    chatMsg: "Loading Time!",
    keybind: "KeyT",
  },
  {
    chatMsg: "I'm Out of Time",
    keybind: "KeyO",
  },
  {
    chatMsg: "/roomid",
    keybind: "KeyI",
  },
  {
    chatMsg: "AMBATUHORN AMBATUHORN AMBATUHORN AMBATUHORN AMBATUHORN AMBATUHORN AMBATUHORN AMBATUHORN AMBATUHORN AMBATUHORN AMBATUHORN AMBATUHORN AMBATUHORN AMBATUHORN AMBATUHORN AMBATUHORN AMBATUHORN AMBATUHORN AMBATUHORN AMBATUHORN AMBATUHORN AMBATUHORN AMBATUHORN AMBATUHORN AMBATUHORN AMBATUHORN AMBATUHORN",
    keybind: "KeyY",
  },
  {
    chatMsg: "Time Halfway Loaded!",
    keybind: "KeyG",
  },
  {
    chatMsg: "Dupe!",
    keybind: "KeyH",
  },
  {
    chatMsg: "Check Compass!",
    keybind: "KeyJ",
  },
  {
    chatMsg: "THE BRITISH ARE COMING!!!",
    keybind: "KeyB",
  },
  {
    chatMsg: "SOMEONE ELSE GRACE",
    keybind: "KeyF",
  },
  {
    chatMsg: "I Am Gracing!",
    keybind: "KeyN",
  },
  {
    chatMsg: "I Am Saphing!",
    keybind: "KeyX",
  },
  {
    chatMsg: "I am Duping!",
    keybind: "KeyZ",
  },
  {
    chatMsg: "SOMEONE ELSE TIME!",
    keybind: "KeyC",
  },
  {
    chatMsg: "SOMEONE ELSE SAPH!",
    keybind: "KeyV",
  },
  {
    chatMsg: "SOMEONE ELSE DUPE!",
    keybind: "KeyM",
  },
]);

/**
 * A record of the missile types that certain mobs shoot at the player.
 */
export const MOB_MISSILES: Partial<Record<EnemyType, EnemyType>> = {
  "Hornet": "Missile",
  "Grasshopper": "GrasshopperMissile",
  "Bumble Bee": "PollenMissile",
  "Queen Fire Ant": "FireMissile",
  "Sea Urchin": "UrchinMissile",
  "Scorpion": "ScorpionMissile",
  "Dandelion": "DandelionMissile",
  "Dauber": "DauberMissile",
  "Mushroom": "MushroomMissile",
  "Rock Tank": "RockMissile",
  "Queen Hornet": "Missile",
  "Queen Dauber": "DauberMissile",
};