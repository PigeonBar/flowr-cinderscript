import { addScreenshotMode } from "./dev/addScreenshotMode";
import { detectLateFlowrscriptLoading } from "./dev/detectLateFlowrscriptLoading";
import { addScriptVersionToDebugInfo } from "./dev/displayScriptVersion";
import { displayMobGalleryOutsideMenu } from "./dev/mobGalleryOutsideMenu";
import { autoReducePetalQuality } from "./features/autoReducePetalQuality";
import { addCraftingSearchBar } from "./features/craftingSearchBar";
import { displayMissilesAboveEnemies } from "./features/displayMissilesAboveEnemies";
import { prioritizeRenderingDragPetal } from "./features/draggingPetalRenderingPriority";
import { enlargeZoomedOutItems } from "./features/enlargeZoomedOutItems";
import { addInventoryMenuExpansion } from "./features/expandInventoryMenu";
import { allowFastCrafting } from "./features/fastCrafting";
import { fixDraggingPetalsOutOfBounds } from "./features/fixDraggingOutOfBounds";
import { fixNegativeRadiusFreeze } from "./features/fixNegativeRadiusFreeze";
import { addGalleryCounterDropdownMenu } from "./features/galleryCounterDropdownMenu";
import { enableInvertAttackAndDefend } from "./features/invertAttackDefend";
import { addMobGalleryKillCounter } from "./features/mobGalleryKillCounter";
import { modifyBaseFOV } from "./features/modifyBaseFov";
import { optimizeHighQualityRenders } from "./features/optimizeHqp";
import { addPetalCraftPreview } from "./features/petalCraftPreview";
import { addPetalSlotLocking } from "./features/petalSlotLocking";
import { addQuickStatsBoxHotkey } from "./features/quickStatsBoxHotkey";
import { addRandomizedSquadCodes } from "./features/randomizedSquadCode";
import { prioritizeRenderingStatsBoxes } from "./features/statsBoxRenderingPriority";
import { widerMobStatsBoxes } from "./features/widerMobStatsBoxes";
import { allowEditingKeybinds } from "./inits/allowEditingKeybinds";
import { handleMenuTranslations } from "./inits/handleMenuTranslations";
import { initExportedObjects } from "./inits/initExportedObjects";
import { initTheoryCraft } from "./inits/initTheoryCraft";
import { initKeybindHandling } from "./inits/keybindHandling";
import { addNewMenuButtons } from "./inits/newMenuButtons";
import { initPetalDrawingUtils } from "./inits/petalDrawingUtils";
import { preventClickingBehindMenus } from "./inits/preventClickingBehindMenus";
import { preventMenuOverlap } from "./inits/preventMenuOverlap";
import { refreezeObjects, unfreezeObjects } from "./inits/unfreezeObjects";
import { allowWsDataEditing } from "./inits/wsDataEditing";

// In case the player is also using Flowrscript, we need to wait for
// Flowrscript's async loading to finish first, or else it will overwrite some
// of Cinderscript's code. Based on some testing, 200ms should be enough, but
// this could very well be subject to change.
await new Promise(resolve => setTimeout(resolve, 200));
detectLateFlowrscriptLoading();

// #region Inits
initExportedObjects();
unfreezeObjects();
initTheoryCraft();
allowWsDataEditing();
preventMenuOverlap();
allowEditingKeybinds();
initKeybindHandling();
addNewMenuButtons();
handleMenuTranslations();
initPetalDrawingUtils();

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
prioritizeRenderingStatsBoxes();
preventClickingBehindMenus();
fixDraggingPetalsOutOfBounds();
addInventoryMenuExpansion();
autoReducePetalQuality();
allowFastCrafting();
optimizeHighQualityRenders();
addPetalSlotLocking();
addMobGalleryKillCounter();
widerMobStatsBoxes();
addGalleryCounterDropdownMenu();

// #region Dev tools
addScreenshotMode();
addScriptVersionToDebugInfo();
displayMobGalleryOutsideMenu();

// #region Ending
prioritizeRenderingDragPetal();
refreezeObjects();