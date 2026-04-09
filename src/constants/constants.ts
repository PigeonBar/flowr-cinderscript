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
 * The default colour of a displayed settings value.
 */
export const SETTINGS_GREEN = "#3fff3f";

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
 * The maximum rarity whose petal stats have been configured by the Flowr devs.
 */
export const MAX_PETAL_RARITY = Rarity.CHAOS;

/**
 * The maximum rarity overall that has been configured by the Flowr devs.
 */
export const MAX_RARITY = Rarity.UNREAL;

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
 * The size of the edit icon in the settings menu.
 */
export const EDIT_ICON_SIZE = 20;

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
]);