import { Rarity } from "./enums";

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
 * The maximum rarity whose petal stats have been configured by the Flowr devs.
 */
export const MAX_PETAL_RARITY = Rarity.CHAOS;

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
 * A special key to indicate that a keybind setting was deleted by the user.
 */
export const KEYBIND_DELETED = "<None>";