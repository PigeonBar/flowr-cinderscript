import { settings } from "../settings/settingsManager";

/**
 * This feature shortens the crafting animation based on the chosen settings.
 * 
 * Note that if the animation length is set to be very short, it will still
 * wait for the server to finish processing the craft request before the
 * animation can finish.
 */
export function allowFastCrafting() {
  // Use a getter function to enforce the new animation countdown
  craftingMenu._finishedCraft = false;
  craftingMenu.craftAnimationCountdown = 0;
  Object.defineProperty(craftingMenu, "finishedCraft", {
    get: function(this: CraftingMenu) {
      return this._finishedCraft && this.craftAnimationCountdown < 0;
    },
    set: function(this: CraftingMenu, v: boolean) {
      this._finishedCraft = v;
    },
  });

  const originalStartAnimation = craftingMenu.startCraftingAnimation;
  craftingMenu.startCraftingAnimation = function() {
    originalStartAnimation.apply(this);

    // Multiply by 1000 to convert seconds -> ms
    this.craftAnimationCountdown = 1000 * settings.get("craftAnimationLength");
    this.finishedCraft = false;

    // Overwrite `craftingAnimationTimer`, since it is replaced by
    // `craftAnimationCountdown`. We make it a large multiple of 600 * pi so
    // that the petals move as expected during the animation.
    this.craftingAnimationTimer = Math.PI * 36288000;
  }

  const originalRunAnimation = craftingMenu.runCraftingAnimation;
  craftingMenu.runCraftingAnimation = function() {
    // Decrement the countdown
    this.craftAnimationCountdown -= dt;

    originalRunAnimation.apply(this);
  }
}