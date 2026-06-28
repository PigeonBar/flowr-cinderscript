import { KEYBIND_DELETED } from "../constants/constants";
import { Rarity } from "../enums";
import type { ChatHotkeys } from "./hotkeysUtils";

/**
 * Settings keys for settings that take a boolean value.
 */
export type BooleanSettingsKey = 
  "petalCraftPreview" |
  "autoCopyCodes" |
  "missileDrawPriority" |
  "invertAttack" |
  "invertDefend" |
  "settingsTooltips" |
  "craftingSearchBar" |
  "inventoryExpandButton" |
  "disableAllOptimizations" |
  "disablePetalStars" |
  "disablePetalAnimations" |
  "allowLockSlotsOneToFive" |
  "hideSettingsDuringRuns" |
  "minimapAlwaysShowBosses" |
  "minimapAlwaysShowRareMobs" |
  "minimapRareMobAura" |
  "disableWelcomeMessage" |
  "useChatHotkeys" |
  "autoUnequipGrace" |
  "missileStatsInStatsBoxes";

/**
 * Settings keys for settings that take a numerical value.
 */
export type NumberSettingsKey =
  "baseReciprocalOfFOV" |
  "playerHpBarScale" |
  "specialDropsScale" |
  "specialDropsQuantity" |
  "petalRenderQualityThreshold" |
  "craftAnimationLength" |
  "petalLockShakeIntensity" |
  "minimapNumberOfMobs" |
  "flowrscriptLoadWaitTime";

/**
 * Settings keys for settings that take a colour hex code value.
 */
export type ColourSettingsKey =
  "gardenBackground" |
  "desertBackground" |
  "oceanBackground" |
  "savannaBackground" |
  "swampBackground" |
  "zooBackground" |
  "deepZooBackground";

/**
 * Settings keys for settings that take a Rarity value.
 */
export type RaritySettingsKey =
  "specialDropsRarity" |
  "minimapAlwaysShowRarity";

/**
 * Settings keys for settings that take a keybind value.
 */
export type KeybindSettingsKey =
  "keybindStatsBox" |
  "keybindInvertAttack" |
  "keybindInvertDefend" |
  "keybindLockSlot" |
  "keybindMinimap" |
  "keybindToggleMouseMovement";

/**
 * The settings key for the setting that opens the chat hotkeys editor.
 */
export type HotkeysEditorSettingsKey = "chatHotkeys";

type CinderSettings =
  Record<BooleanSettingsKey, boolean> &
  Record<NumberSettingsKey, number> &
  Record<ColourSettingsKey, string> &
  Record<RaritySettingsKey, Rarity> &
  Record<KeybindSettingsKey, string> &
  Record<HotkeysEditorSettingsKey, ChatHotkeys>;

export type SettingsKey = keyof CinderSettings;

let defaultSettings: CinderSettings;

/**
 * A function to be run when the user edits a specific setting.
 */
type SettingsListener<T> = (option: T) => void;

type ListenersMap = Record<SettingsKey, SettingsListener<any>[]>;

export class SettingsManager {
  /**
   * A list of saved settings. This is also saved to local storage every time
   * the user edits any of the settings.
   */
  savedSettings: CinderSettings;

  /**
   * A list of listeners to listen to the user selecting options in the
   * settings menu.
   */
  listeners: ListenersMap;

  constructor() {
    this.savedSettings = {...defaultSettings};

    const loadedSettings = JSON.parse(
      localStorage.getItem("cinderSettings") ?? "{}"
    ) as CinderSettings;

    this.savedSettings = {...defaultSettings, ...loadedSettings};

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
      disablePetalStars: [],
      disablePetalAnimations: [],
      allowLockSlotsOneToFive: [],
      hideSettingsDuringRuns: [],
      minimapAlwaysShowBosses: [],
      minimapAlwaysShowRareMobs: [],
      minimapRareMobAura: [],
      disableWelcomeMessage: [],
      useChatHotkeys: [],
      autoUnequipGrace: [],
      missileStatsInStatsBoxes: [],
      baseReciprocalOfFOV: [],
      playerHpBarScale: [],
      specialDropsScale: [],
      specialDropsQuantity: [],
      petalRenderQualityThreshold: [],
      craftAnimationLength: [],
      petalLockShakeIntensity: [],
      minimapNumberOfMobs: [],
      flowrscriptLoadWaitTime: [],
      gardenBackground: [],
      desertBackground: [],
      oceanBackground: [],
      savannaBackground: [],
      swampBackground: [],
      zooBackground: [],
      deepZooBackground: [],
      specialDropsRarity: [],
      minimapAlwaysShowRarity: [],
      keybindStatsBox: [],
      keybindInvertAttack: [],
      keybindInvertDefend: [],
      keybindLockSlot: [],
      keybindMinimap: [],
      keybindToggleMouseMovement: [],
      chatHotkeys: [],
    };
  }

  /**
   * @param key The {@linkcode SettingsKey} being retrieved from.
   * @returns The user's setting for this key.
   */
  get<K extends SettingsKey>(key: K): CinderSettings[K] {
    return this.savedSettings[key];
  }

  /**
   * @param key The {@linkcode SettingsKey} being retrieved from.
   * @returns The default setting for this key.
   */
  getDefault<K extends SettingsKey>(key: K): CinderSettings[K] {
    return defaultSettings[key];
  }

  /**
   * @param key The {@linkcode SettingsKey} being written to.
   * @param value The settings value to write.
   */
  set<K extends SettingsKey>(key: K, value: CinderSettings[K]): void {
    // Note: The "<K extends SettingsKey>" is mandatory, or else
    // `this.savedSettings[key]` has type `never`. I have no idea why.
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
  addListener<K extends SettingsKey>(
    key: K, listener: (option: CinderSettings[K]) => void
  ) {
    this.listeners[key].push(listener);
  }
}

export let settings: SettingsManager;

/**
 * A helper function to initialize {@linkcode settings}, to prevent certain
 * side effects from its constructor running during importing.
 */
export function initSettingsManager(): void {
  defaultSettings = Object.freeze({
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
    minimapAlwaysShowBosses: true,
    minimapAlwaysShowRareMobs: true,
    minimapRareMobAura: true,
    disableWelcomeMessage: false,
    useChatHotkeys: false,
    autoUnequipGrace: true,
    missileStatsInStatsBoxes: true,
    baseReciprocalOfFOV: 3,
    playerHpBarScale: 2.5,
    specialDropsScale: 2.5,
    specialDropsQuantity: 1,
    petalRenderQualityThreshold: 400,
    craftAnimationLength: 0,
    petalLockShakeIntensity: 2,
    minimapNumberOfMobs: 5,
    flowrscriptLoadWaitTime: 1,
    gardenBackground: Colors.biomes.garden.background,
    desertBackground: Colors.biomes.desert.background,
    oceanBackground: Colors.biomes.ocean.background,
    savannaBackground: Colors.biomes.savanna.background,
    swampBackground: Colors.biomes.swamp.background,
    zooBackground: Colors.biomes.zoo.background,
    deepZooBackground: Colors.biomes.deepzoo.background,
    specialDropsRarity: Rarity.GALACTIC,
    minimapAlwaysShowRarity: Rarity.COMMON,
    keybindStatsBox: "KeyG",
    keybindInvertAttack: "Comma",
    keybindInvertDefend: "Period",
    keybindLockSlot: "KeyL",
    keybindMinimap: "KeyM",
    keybindToggleMouseMovement: "KeyK",
    chatHotkeys: [{
      chatMsg: "Remember to enable the setting \"Use Chat Hotkeys\"!",
      keybind: KEYBIND_DELETED,
    }],
  });
  settings = new SettingsManager();
}