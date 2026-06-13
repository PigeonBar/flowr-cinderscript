import { isNil } from "../utils";

/**
 * This feature makes sure that the crafting menu properly clears its
 * `fadingPetalContainers` after some time.
 */
export function fadeCraftingMenuFadingPetals(): void {
  const originalDraw = craftingMenu.drawInventory;
  craftingMenu.drawInventory = function(alpha?: number) {
    originalDraw.apply(this, [alpha]);

    // Advance the removal timers of each fading petal container
    for (let petal of this.fadingPetalContainers) {
      if (isNil(petal.removeTimer)) {
        // It's hard to tell the intended length of the fading animation by the
        // base game's devs, so we set a high value of 3000ms to be safe.
        petal.removeTimer = 3000;
      }

      petal.removeTimer -= dt;
      if (petal.removeTimer <= 0) {
        petal.toRemove = true;
      }
    }

    // Remove petals whose removal timers have reached 0
    this.fadingPetalContainers = this.fadingPetalContainers.filter(
      petal => !petal.toRemove
    );
  }
}