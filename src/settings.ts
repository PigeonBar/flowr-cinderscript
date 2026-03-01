// Lots TBD. This file is currently just a bare-bones list of what settings I
// want to be available later.

type BooleanSettingsKey = 
  "petalCraftPreview" |
  "autoCopyCodes" |
  "missileDrawPriority";

type NumberSettingsKey =
  "baseFOV"; // Between 0.2 and 3. Base game default is 1.

type CinderSettings = Record<BooleanSettingsKey, boolean> &
  Record<NumberSettingsKey, number>;

type SettingsKey = keyof CinderSettings;

const defaultSettings = Object.freeze({
  petalCraftPreview: true,
  autoCopyCodes: true,
  missileDrawPriority: true,
  baseFOV: 0.33,
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
  get(key: SettingsKey): any {
    return this.savedSettings[key];
  }

  /**
   * @param key The {@linkcode SettingsKey} being written to.
   * @param value The settings value to write.
   */
  set(key: BooleanSettingsKey, value: boolean): void;
  set(key: NumberSettingsKey, value: number): void;
  set<K extends SettingsKey>(key: K, value: any): void {
    // Note: The "<K extends SettingsKey>" is mandatory, or else
    // `this.savedSettings[key]` has type `never`. I have no idea why.
    this.savedSettings[key] = value;
    localStorage.setItem("cinderSettings", JSON.stringify(this.savedSettings));
  }
}

export const settings = new SettingsManager();