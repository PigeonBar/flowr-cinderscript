import { unsafeWindow } from "$";
import { addScreenshotMode } from "./dev/addScreenshotMode";
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
import { initFlowrscriptPointer } from "./inits/initFlowrscriptPointer";
import { initTheoryCraft } from "./inits/initTheoryCraft";
import { initKeybindHandling } from "./inits/keybindHandling";
import { addNewMenuButtons } from "./inits/newMenuButtons";
import { initPetalDrawingUtils } from "./inits/petalDrawingUtils";
import { preventClickingBehindMenus } from "./inits/preventClickingBehindMenus";
import { preventMenuOverlap } from "./inits/preventMenuOverlap";
import { refreezeObjects, unfreezeObjects } from "./inits/unfreezeObjects";
import { allowWsDataEditing } from "./inits/wsDataEditing";

const mainScriptPromise = new Promise<void>(async (resolve) => {
  // In case the player is also using Flowrscript, we need to wait for
  // Flowrscript's async loading to finish first, or else it will overwrite
  // some of Cinderscript's code. Based on some testing, 1000ms should be
  // enough, but this could very well be subject to change.
  await new Promise(resolve => setTimeout(resolve, 1000));
  initFlowrscriptPointer();

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

  resolve();
});

// Do not let the "Loading..." screen disappear until all of the above script
// functions have finished
const originalOnLoad = unsafeWindow.onload;
unsafeWindow.onload = function(ev: Event) {
  mainScriptPromise.then(() => {
    originalOnLoad?.apply(unsafeWindow, [ev]);}
  );
}