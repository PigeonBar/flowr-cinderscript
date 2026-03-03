import { addScreenshotMode } from "./dev/addScreenshotMode";
import { displayMissilesAboveEnemies } from "./features/displayMissilesAboveEnemies";
import { enlargeZoomedOutItems } from "./features/enlargeZoomedOutItems";
import { modifyBaseFOV } from "./features/modifyBaseFov";
import { addPetalCraftPreview } from "./features/petalCraftPreview";
import { addRandomizedSquadCodes } from "./features/randomizedSquadCode";
import { initTheoryCraft, refreezeObjects, unfreezeObjects } from "./inits";

// #region Inits
unfreezeObjects();
initTheoryCraft();

// #region Features
addPetalCraftPreview();
addRandomizedSquadCodes();
displayMissilesAboveEnemies();
modifyBaseFOV();
enlargeZoomedOutItems();

// #region Dev tools
addScreenshotMode();

// #region Ending
refreezeObjects();