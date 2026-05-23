import { settings } from "../settings/settingsManager";

/**
 * This feature handles setting background colours based on chosen settings.
 */
export function handleBackgroundColourSettings(): void {
  // Set initial colours
  Colors.biomes.garden.background = settings.get("gardenBackground");
  Colors.biomes.desert.background = settings.get("desertBackground");
  Colors.biomes.ocean.background = settings.get("oceanBackground");
  Colors.biomes.savanna.background = settings.get("savannaBackground");
  Colors.biomes.swamp.background = settings.get("swampBackground");
  Colors.biomes.zoo.background = settings.get("zooBackground");
  Colors.biomes.deepzoo.background = settings.get("deepZooBackground");

  // Also add listeners to respond to future settings changes
  settings.addListener("gardenBackground", (option: string) => {
    Colors.biomes.garden.background = option;
  });
  settings.addListener("desertBackground", (option: string) => {
    Colors.biomes.desert.background = option;
  });
  settings.addListener("oceanBackground", (option: string) => {
    Colors.biomes.ocean.background = option;
  });
  settings.addListener("savannaBackground", (option: string) => {
    Colors.biomes.savanna.background = option;
  });
  settings.addListener("swampBackground", (option: string) => {
    Colors.biomes.swamp.background = option;
  });
  settings.addListener("zooBackground", (option: string) => {
    Colors.biomes.zoo.background = option;
  });
  settings.addListener("deepZooBackground", (option: string) => {
    Colors.biomes.deepzoo.background = option;
  });
}