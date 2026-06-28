import { unsafeWindow } from "$";
import { addScreenshotMode } from "./dev/addScreenshotMode";
import { addScriptVersionToDebugInfo } from "./dev/displayScriptVersion";
import { displayMobGalleryOutsideMenu } from "./dev/mobGalleryOutsideMenu";
import { addMinimap } from "./features/addMinimap";
import { autoReducePetalQuality } from "./features/autoReducePetalQuality";
import { autoUnequipGrace } from "./features/autoUnequipGrace";
import { handleBackgroundColourSettings } from "./features/backgroundColour";
import { fadeCraftingMenuFadingPetals } from "./features/craftingMenuFadingPetals";
import { addCraftingSearchBar } from "./features/craftingSearchBar";
import { displayMissilesAboveEnemies } from "./features/displayMissilesAboveEnemies";
import { prioritizeRenderingDragPetal } from "./features/draggingPetalRenderingPriority";
import { enlargeZoomedOutItems } from "./features/enlargeZoomedOutItems";
import { addInventoryMenuExpansion } from "./features/expandInventoryMenu";
import { allowFastCrafting } from "./features/fastCrafting";
import { fixDraggingPetalsOutOfBounds } from "./features/fixDraggingOutOfBounds";
import { fixSpecificRenderingFreezes } from "./features/fixRenderingFreezes";
import { addGalleryCounterDropdownMenu } from "./features/galleryCounterDropdownMenu";
import { enableInvertAttackAndDefend } from "./features/invertAttackDefend";
import { addMissileStatsToStatsBoxes } from "./features/missileStatsInStatsBoxes";
import { addMobGalleryKillCounter } from "./features/mobGalleryKillCounter";
import { modifyBaseFOV } from "./features/modifyBaseFov";
import { allowTogglingMouseMovement } from "./features/mouseMovementToggling";
import { optimizeHighQualityRenders } from "./features/optimizeHqp";
import { patchFlowrscriptPrototypes } from "./features/patchFlowrscriptPrototypes";
import { addPetalCraftPreview } from "./features/petalCraftPreview";
import { addPetalSlotLocking } from "./features/petalSlotLocking";
import { addQuickStatsBoxHotkey } from "./features/quickStatsBoxHotkey";
import { addRandomizedSquadCodes } from "./features/randomizedSquadCode";
import { prioritizeRenderingStatsBoxes } from "./features/statsBoxRenderingPriority";
import { displayWelcomeMessage } from "./features/welcomeMessage";
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
import { blockFovChangeFromSettingsScroll } from "./inits/settingsScrollBlockFovChange";
import { refreezeObjects, unfreezeObjects } from "./inits/unfreezeObjects";
import { allowWsDataEditing } from "./inits/wsDataEditing";
import { initSettingsManager, settings } from "./settings/settingsManager";
import { isNil } from "./utils";

const mainScriptPromise = new Promise<void>(async (resolve) => {
  // If some main game features are missing, we assume that the page is doing
  // Cloudflare stuff instead, and we abort running the script.
  if (isNil(settingsMenu) && isNil(craftingMenu)) {
    return;
  }

  // We must init the settings individually here, since the next step (waiting
  // for Flowrscript) relies on one of the settings.
  initSettingsManager();

  // In case the player is also using Flowrscript, we need to wait for
  // Flowrscript's async loading to finish first, or else it will overwrite
  // some of Cinderscript's code.
  await new Promise<void>(resolve => {
    // Condition 1: Stop waiting once Flowrscript has finished loading,
    // signalled by its petal gallery being populated.
    const interval = setInterval(() => {
      const petals = unsafeWindow?.flowrMod?.petalGallery?.petalContainers;
      if (!isNil(petals) && Object.keys(petals).length > 0) {
        clearInterval(interval);
        resolve();
      }
    }, 50);

    // Condition 2: Stop waiting once the script has waited long enough, as
    // configured in the settings.
    setTimeout(() => {
      clearInterval(interval);
      resolve();
    }, 1000 * settings.get("flowrscriptLoadWaitTime"));
  });
  initFlowrscriptPointer();

  // #region Inits
  // Note: `allowEditingKeybinds` must be run after `initKeybindHandling` so
  // that keybinds don't accidentally activate when the user is just trying to
  // edit a keybind.
  initExportedObjects();
  unfreezeObjects();
  initTheoryCraft();
  allowWsDataEditing();
  preventMenuOverlap();
  initKeybindHandling();
  allowEditingKeybinds();
  addNewMenuButtons();
  handleMenuTranslations();
  initPetalDrawingUtils();
  blockFovChangeFromSettingsScroll();

  // #region Features
  addPetalCraftPreview();
  addCraftingSearchBar();
  addRandomizedSquadCodes();
  displayMissilesAboveEnemies();
  modifyBaseFOV();
  enlargeZoomedOutItems();
  fixSpecificRenderingFreezes();
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
  addQuickStatsBoxHotkey();
  handleBackgroundColourSettings();
  addMinimap();
  fadeCraftingMenuFadingPetals();
  autoUnequipGrace();
  allowTogglingMouseMovement();
  addMissileStatsToStatsBoxes();

  // #region Dev tools
  addScreenshotMode();
  addScriptVersionToDebugInfo();
  displayMobGalleryOutsideMenu();

  // #region Ending
  displayWelcomeMessage();
  prioritizeRenderingDragPetal();
  patchFlowrscriptPrototypes();
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