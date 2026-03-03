import { addScreenshotMode } from "./dev/addScreenshotMode";
import { displayMissilesAboveEnemies } from "./features/displayMissilesAboveEnemies";
import { modifyBaseFOV } from "./features/modifyBaseFov";
import { addPetalCraftPreview } from "./features/petalCraftPreview";
import { addRandomizedSquadCodes } from "./features/randomizedSquadCode";
import { initTheoryCraft } from "./inits";

// #region Inits
initTheoryCraft();

// #region Features
addPetalCraftPreview();
addRandomizedSquadCodes();
displayMissilesAboveEnemies();
modifyBaseFOV();

// #region Dev tools
addScreenshotMode();