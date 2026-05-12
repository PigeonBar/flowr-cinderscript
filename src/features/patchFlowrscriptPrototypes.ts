import { flowrMod } from "../inits/initFlowrscriptPointer";
import { isNil } from "../utils";

/**
 * This function patches various objects' prototypes and other functions that
 * may have been overwritten by Flowrscript.
 * 
 * The list of patched items here is not fully complete, and more items will be
 * added as we discover that they need to be patched.
 */
export function patchFlowrscriptPrototypes(): void {
  if (!isNil(flowrMod)) {
    // Patch the currently equipped petals UI
    const OldInventory = inventory.constructor;
    OldInventory.prototype.swapPetals = Inventory.prototype.swapPetals;
  }
}