import { addScreenshotMode } from "./dev/addScreenshotMode";
import { addScriptVersionToDebugInfo } from "./dev/displayScriptVersion";
import { autoReducePetalQuality } from "./features/autoReducePetalQuality";
import { addCraftingSearchBar } from "./features/craftingSearchBar";
import { displayMissilesAboveEnemies } from "./features/displayMissilesAboveEnemies";
import { prioritizeRenderingDragPetal } from "./features/draggingPetalRenderingPriority";
import { enlargeZoomedOutItems } from "./features/enlargeZoomedOutItems";
import { addInventoryMenuExpansion } from "./features/expandInventoryMenu";
import { fixDraggingPetalsOutOfBounds } from "./features/fixDraggingOutOfBounds";
import { fixNegativeRadiusFreeze } from "./features/fixNegativeRadiusFreeze";
import { enableInvertAttackAndDefend } from "./features/invertAttackDefend";
import { modifyBaseFOV } from "./features/modifyBaseFov";
import { addPetalCraftPreview } from "./features/petalCraftPreview";
import { addQuickStatsBoxHotkey } from "./features/quickStatsBoxHotkey";
import { addRandomizedSquadCodes } from "./features/randomizedSquadCode";
import { prioritizeRenderingStatsBoxes } from "./features/statsBoxRenderingPriority";
import { allowEditingKeybinds } from "./inits/allowEditingKeybinds";
import { handleMenuTranslations } from "./inits/handleMenuTranslations";
import { initTheoryCraft } from "./inits/initTheoryCraft";
import { initKeybindHandling } from "./inits/keybindHandling";
import { addNewMenuButtons } from "./inits/newMenuButtons";
import { preventClickingBehindMenus } from "./inits/preventClickingBehindMenus";
import { preventMenuOverlap } from "./inits/preventMenuOverlap";
import { refreezeObjects, unfreezeObjects } from "./inits/unfreezeObjects";
import { allowWsDataEditing } from "./inits/wsDataEditing";

// #region Inits
unfreezeObjects();
initTheoryCraft();
allowWsDataEditing();
preventMenuOverlap();
allowEditingKeybinds();
initKeybindHandling();
addNewMenuButtons();
handleMenuTranslations();

// #region Features
addPetalCraftPreview();
addCraftingSearchBar();
addRandomizedSquadCodes();
displayMissilesAboveEnemies();
modifyBaseFOV();
enlargeZoomedOutItems();
fixNegativeRadiusFreeze();
addQuickStatsBoxHotkey();
enableInvertAttackAndDefend();
prioritizeRenderingDragPetal();
prioritizeRenderingStatsBoxes();
preventClickingBehindMenus();
fixDraggingPetalsOutOfBounds();
addInventoryMenuExpansion();
autoReducePetalQuality();

// #region Dev tools
addScreenshotMode();
addScriptVersionToDebugInfo();

// #region Ending
refreezeObjects();