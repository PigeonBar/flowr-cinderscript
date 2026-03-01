// Lots TBD. This file is currently just a bare-bones list of what settings I
// want to be available later.

type CinderSettings = {
  petalCraftPreview: boolean
  autoCopyCodes: boolean
  missileDrawPriority: boolean
};
type SettingsKey = keyof CinderSettings;

const settingsKeys = Object.freeze([
  "petalCraftPreview",
  "autoCopyCodes",
  "missileDrawPriority",
]) as SettingsKey[];

const defaultSettings = Object.freeze({
  petalCraftPreview: true,
  autoCopyCodes: true,
  missileDrawPriority: true,
}) as CinderSettings;

class SettingsManager {
  petalCraftPreview: boolean = true;
  autoCopyCodes: boolean = true;
  missileDrawPriority: boolean = true;
  savedSettings: CinderSettings = {...defaultSettings};

  constructor() {
    const loadedSettings = JSON.parse(
      localStorage.getItem("cinderSettings") ?? "{}"
    ) as CinderSettings;
    
    for (let key of settingsKeys) {
      this[key] = loadedSettings[key] ?? defaultSettings[key];
      this.savedSettings[key] = loadedSettings[key] ?? defaultSettings[key];
    }

    // A temporary dev backdoor before a proper settings menu is created.
    globalThis.cinderSetting = (key: SettingsKey, value: any) => {
      this.setSetting(key, value);
    }
  }

  setSetting(key: SettingsKey, value: any): void {
    this[key] = value;
    this.savedSettings[key] = value;
    localStorage.setItem("cinderSettings", JSON.stringify(this.savedSettings));
  }
}

export const settings = new SettingsManager();