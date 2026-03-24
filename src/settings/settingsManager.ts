import { Rarity } from "../enums";
import { settingsMap } from "./settingsObjects";

export type BooleanSettingsKey = 
  "petalCraftPreview" |
  "autoCopyCodes" |
  "missileDrawPriority" |
  "invertAttack" |
  "invertDefend" |
  "settingsTooltips" |
  "craftingSearchBar" |
  "inventoryExpandButton";

export type NumberSettingsKey =
  "baseReciprocalOfFOV" |
  "playerHpBarScale" |
  "specialDropsScale" |
  "specialDropsQuantity" |
  "petalRenderQualityThreshold";

export type RaritySettingsKey =
  "specialDropsRarity";

export type KeybindSettingsKey =
  "keybindStatsBox" |
  "keybindInvertAttack" |
  "keybindInvertDefend";

type CinderSettings =
  Record<BooleanSettingsKey, boolean> &
  Record<NumberSettingsKey, number> &
  Record<RaritySettingsKey, Rarity> &
  Record<KeybindSettingsKey, string>;

export type SettingsKey = keyof CinderSettings;

const defaultSettings = Object.freeze({
  petalCraftPreview: true,
  autoCopyCodes: true,
  missileDrawPriority: true,
  invertAttack: false,
  invertDefend: false,
  settingsTooltips: true,
  craftingSearchBar: true,
  inventoryExpandButton: true,
  baseReciprocalOfFOV: 3,
  playerHpBarScale: 2.5,
  specialDropsScale: 2.5,
  specialDropsQuantity: 1,
  petalRenderQualityThreshold: 100,
  specialDropsRarity: Rarity.TRANSCENDENT,
  keybindStatsBox: "KeyG",
  keybindInvertAttack: "Comma",
  keybindInvertDefend: "Period",
}) as CinderSettings;

export class SettingsManager {
  savedSettings: CinderSettings = {...defaultSettings};

  constructor() {
    const loadedSettings = JSON.parse(
      localStorage.getItem("cinderSettings") ?? "{}"
    ) as CinderSettings;

    this.savedSettings = {...this.savedSettings, ...loadedSettings};
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

    // Some more code to make certain things update to settings changes
    if (key === "invertAttack") {
      settingsMap.invertAttack.state = value;
    } else if (key === "invertDefend") {
      settingsMap.invertDefend.state = value;
    }

    if (key === "specialDropsQuantity" || key === "specialDropsRarity") {
      settingsMap.specialDropsScale.updateTooltip();
    }

    if (key === "craftingSearchBar") {
      craftingMenu.updateSearchBarActive();
    }
  }
}

export const settings = new SettingsManager();