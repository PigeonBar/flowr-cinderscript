// This file stores certain objects to avoid issues with circular imports.

import type { BooleanSettingsKey, ColourSettingsKey, HotkeysEditorSettingsKey, KeybindSettingsKey, NumberSettingsKey, RaritySettingsKey } from "./settingsManager";
import type { BooleanOption, ColourOption, CustomOption, KeybindOption, NumberOption, RarityOption } from "./settingsOptions";

type SettingsMap =
  Record<BooleanSettingsKey, BooleanOption> &
  Record<NumberSettingsKey, NumberOption> &
  Record<ColourSettingsKey, ColourOption> &
  Record<RaritySettingsKey, RarityOption> &
  Record<KeybindSettingsKey, KeybindOption> &
  Record<HotkeysEditorSettingsKey, CustomOption>;

/**
 * The full list of settings options. It is placed here so that other modules
 * can also access these options as needed.
 */
export let settingsMap: SettingsMap;

/**
 * Initializes {@linkcode settingsMap}.
 */
export function initOptions(options: SettingsMap) {
  settingsMap = Object.freeze(options);
}