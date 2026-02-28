// Lots TBD. This file is currently just a bare-bones list of what settings I
// want to be available later.

type CinderSettings = {
  petalCraftPreview: boolean
};
type SettingsKey = keyof CinderSettings;

const settingsKeys = [
  "petalCraftPreview",
] as SettingsKey[];

const defaultSettings = {
  petalCraftPreview: true,
} as CinderSettings;

class SettingsManager {
  petalCraftPreview: boolean = true;
  savedSettings: CinderSettings = defaultSettings;

  constructor() {
    const loadedSettings = JSON.parse(
      localStorage.getItem("cinderSettings") ?? "{}"
    ) as CinderSettings;
    
    for (let key of settingsKeys) {
      this[key] = loadedSettings[key] ?? defaultSettings[key];
      this.savedSettings[key] = loadedSettings[key] ?? defaultSettings[key];
    }

    // A temporary dev backdoor before a proper settings menu is created.
    // @ts-ignore
    window.cinderSetting = (key: SettingsKey, value: any) => {
      this.setSetting(key, value);
    }
  }

  setSetting(key: SettingsKey, value: any) {
    this[key] = value;
    this.savedSettings[key] = value;
    localStorage.setItem("cinderSettings", JSON.stringify(this.savedSettings));
  }
}

export const settings = new SettingsManager();