import { addScreenshotMode } from "./dev/addScreenshotMode";
import { displayMissilesAboveEnemies } from "./features/displayMissilesAboveEnemies";
import { enlargeZoomedOutItems } from "./features/enlargeZoomedOutItems";
import { fixNegativeRadiusFreeze } from "./features/fixNegativeRadiusFreeze";
import { enableInvertAttackAndDefend } from "./features/invertAttackDefend";
import { modifyBaseFOV } from "./features/modifyBaseFov";
import { addPetalCraftPreview } from "./features/petalCraftPreview";
import { addQuickStatsBoxHotkey } from "./features/quickStatsBoxHotkey";
import { addRandomizedSquadCodes } from "./features/randomizedSquadCode";
import { allowWsDataProcessing, initTheoryCraft, refreezeObjects, unfreezeObjects } from "./inits";

// #region Inits
unfreezeObjects();
initTheoryCraft();
allowWsDataProcessing();

// #region Features
addPetalCraftPreview();
addRandomizedSquadCodes();
displayMissilesAboveEnemies();
modifyBaseFOV();
enlargeZoomedOutItems();
fixNegativeRadiusFreeze();
addQuickStatsBoxHotkey();
enableInvertAttackAndDefend();

// #region Dev tools
addScreenshotMode();

// #region Ending
refreezeObjects();