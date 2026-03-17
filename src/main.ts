import { addScreenshotMode } from "./dev/addScreenshotMode";
import { displayMissilesAboveEnemies } from "./features/displayMissilesAboveEnemies";
import { enlargeZoomedOutItems } from "./features/enlargeZoomedOutItems";
import { fixNegativeRadiusFreeze } from "./features/fixNegativeRadiusFreeze";
import { enableInvertAttackAndDefend } from "./features/invertAttackDefend";
import { modifyBaseFOV } from "./features/modifyBaseFov";
import { addPetalCraftPreview } from "./features/petalCraftPreview";
import { addQuickStatsBoxHotkey } from "./features/quickStatsBoxHotkey";
import { addRandomizedSquadCodes } from "./features/randomizedSquadCode";
import { refreezeObjects, unfreezeObjects } from "./inits/unfreezeObjects";
import { allowWsDataEditing } from "./inits/wsDataEditing";
import { initTheoryCraft } from "./inits/initTheoryCraft";
import { allowEditingKeybinds } from "./inits/allowEditingKeybinds";
import { initKeybindHandling } from "./inits/keybindHandling";
import { addNewMenuButtons } from "./inits/newMenuButtons";
import { preventMenuOverlap } from "./inits/preventMenuOverlap";

// #region Inits
unfreezeObjects();
initTheoryCraft();
allowWsDataEditing();
preventMenuOverlap();
allowEditingKeybinds();
initKeybindHandling();
addNewMenuButtons();

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