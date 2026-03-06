// Lots TBD. This file is currently just a bare-bones list of what settings I
// want to be available later.

import { Rarity } from "./enums";

type BooleanSettingsKey = 
  "petalCraftPreview" |
  "autoCopyCodes" |
  "missileDrawPriority" |
  "invertAttack" |
  "invertDefend";

type NumberSettingsKey =
  "baseReciprocalOfFOV" | // Between 0.33 and 5. Base game default is 1.
  "playerHpBarScale" | // Between 0.5 and 5
  "specialDropsScale" | // Between 1 and 5
  "specialDropsQuantity"; // Between 0.1 and 999

type RaritySettingsKey =
  "specialDropsRarity";

type KeybindSettingsKey =
  "keybindStatsBox" |
  "keybindInvertAttack" |
  "keybindInvertDefend";

type CinderSettings = Record<BooleanSettingsKey, boolean> &
  Record<NumberSettingsKey, number> &
  Record<RaritySettingsKey, Rarity> &
  Record<KeybindSettingsKey, string>;

type SettingsKey = keyof CinderSettings;

const defaultSettings = Object.freeze({
  petalCraftPreview: true,
  autoCopyCodes: true,
  missileDrawPriority: true,
  invertAttack: false,
  invertDefend: false,
  baseReciprocalOfFOV: 3,
  playerHpBarScale: 2.5,
  specialDropsScale: 2.5,
  specialDropsQuantity: 1,
  specialDropsRarity: Rarity.TRANSCENDENT,
  keybindStatsBox: "KeyG",
  keybindInvertAttack: "Comma",
  keybindInvertDefend: "Period",
}) as CinderSettings;

class SettingsManager {
  savedSettings: CinderSettings = {...defaultSettings};

  constructor() {
    const loadedSettings = JSON.parse(
      localStorage.getItem("cinderSettings") ?? "{}"
    ) as CinderSettings;

    this.savedSettings = {...this.savedSettings, ...loadedSettings};

    // A temporary dev backdoor before a proper settings menu is created.
    settingsMenu.cinderSetting = (key: SettingsKey, value: any) => {
      // @ts-ignore
      this.set(key, value);
    }
  }

  /**
   * @param key The {@linkcode SettingsKey} being retrieved from.
   * @returns The user's setting for this key.
   */
  get(key: BooleanSettingsKey): boolean;
  get(key: NumberSettingsKey): number;
  get(key: RaritySettingsKey): Rarity;
  get(key: KeybindSettingsKey): string;
  get(key: SettingsKey): any {
    return this.savedSettings[key];
  }

  /**
   * @param key The {@linkcode SettingsKey} being written to.
   * @param value The settings value to write.
   */
  set(key: BooleanSettingsKey, value: boolean): void;
  set(key: NumberSettingsKey, value: number): void;
  set(key: RaritySettingsKey, value: Rarity): void;
  set(key: KeybindSettingsKey, value: string): void;
  set<K extends SettingsKey>(key: K, value: any): void {
    // Note: The "<K extends SettingsKey>" is mandatory, or else
    // `this.savedSettings[key]` has type `never`. I have no idea why.
    this.savedSettings[key] = value;
    localStorage.setItem("cinderSettings", JSON.stringify(this.savedSettings));

    // TODO: When the player uses the invert attack/defend hotkeys, it should
    // also toggle the buttons in the settings menu.
  }
}

export const settings = new SettingsManager();