import { queueDrawStatsBox, drawQueuedStatsBoxes } from "./utils";
import { settings } from "./settings";

/**
 * This feature adds a preview of the petal that you are attempting to craft in
 * the crafting menu. I also fixed a previous bug where this petal preview
 * would cover up the stats boxes of other petals.
 *
 * Please note that the stats of the previewed petal are subject to change by
 * flowr's devs, especially if nobody in the entire game has obtained that
 * petal yet.
 * 
 * Thank you to 4Yud for coming up with this idea!
 */
export function addPetalCraftPreview() {
  // Set position for the crafting preview above the craft button
  craftingMenu.previewPetalSlot = {
    x: craftingMenu.w * .83,
    y: craftingMenu.h * .167,
    w: 65,
    h: 65,
  };

  const oldDrawCrafting = craftingMenu.drawInventory;
  craftingMenu.drawInventory = function(alpha = 1) {
    // If feature is turned off in settings, just draw the crafting menu as usual
    if (settings.petalCraftPreview !== true) {
      oldDrawCrafting.apply(this, [alpha]);
      return;
    }

    // Make sure stats boxes get queued instead of drawn immediately,
    // so that they are not covered up by the craft preview.
    const oldDrawStatsBox = PetalContainer.prototype.drawStatsBox;
    PetalContainer.prototype.drawStatsBox = function(...args) {
      queueDrawStatsBox(this, args);
    }

    oldDrawCrafting.apply(this, [alpha]); // Draw everything else as usual

    // Redo translation
    let translation = 0;
    if (time - this.lastCloseTime < 160) {
      translation += this.h * easeOutCubic((time - this.lastCloseTime) / 160);
    }
    if (time - this.lastOpenTime < 160) {
      translation += (this.h + 40) - (this.h + 40) * easeOutCubic((time - this.lastOpenTime) / 160);
    }
    if (translation !== 0) {
      ctx.translate(0, translation);
    }
    ctx.translate(130, canvas.h - this.h - 20);

    // Display the petal slot for the preview
    const slot = this.previewPetalSlot;
    ctx.fillStyle = this.getSlotColor();
    ctx.beginPath();
    ctx.roundRect(
      slot.x - this.petalContainerSize / 2,
      slot.y - this.petalContainerSize / 2,
      this.petalContainerSize,
      this.petalContainerSize,
      8
    );
    ctx.fill();
    ctx.closePath();

    // Display the "Preview" text above the slot
    ctx.fillStyle = "#f0f0f0";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3.75;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "900 16px Ubuntu";
    ctx.strokeText("Preview", slot.x, slot.y - 55);
    ctx.fillText("Preview", slot.x, slot.y - 55);

    // Draw the petal being previewed and queue its stats box, if applicable
    const mouseX = mouse.x * canvas.w / window.innerWidth;
    const mouseY = mouse.y * canvas.h / window.innerHeight;
    const container = this.previewPetalContainer;
    if (container !== undefined) {
      container.draw();

      // Check if player is hovering over the preview container
      if (mouseInBox(
        { x: mouseX, y: mouseY },
        {
          x: container.render.x - container.w / 2 + 130,
          y: container.render.y - container.h / 2 + canvas.h - this.h - 20,
          w: container.w,
          h: container.h,
        }
      )) {
        container.isHovered = true;
      }

      container.drawStatsBox(
        false,
        false,
        130 + container.render.x,
        (canvas.h - this.h - 20) + container.render.y
      );
    }

    // Undo translation
    ctx.translate(-130, -(canvas.h - this.h - 20));
    if (translation !== 0) {
      ctx.translate(0, -translation);
    }
    
    // Draw all queued stats boxes.
    // For some reason, this can only be done after undoing the translation.
    PetalContainer.prototype.drawStatsBox = oldDrawStatsBox;
    drawQueuedStatsBoxes();
  }

  const oldAddPetal = craftingMenu.addCraftingPetalContainers;
  craftingMenu.addCraftingPetalContainers = function(type, rarity, amount, attempt) {
    oldAddPetal.apply(this, [type, rarity, amount, attempt]);

    // When the player adds *new* petals to the crafting slots, also add a new preview.
    const currentPetal = this.craftingPetalContainers[0];
    if (currentPetal !== undefined && (
      this.previewPetalContainer?.type !== currentPetal.type ||
      this.previewPetalContainer?.rarity !== currentPetal.rarity + 1
    )) {
      const slot = this.previewPetalSlot;
      this.previewPetalContainer = new PetalContainer(
        [new Petal({type: currentPetal.type, rarity: currentPetal.rarity + 1})],
        {x: slot.x, y: slot.y, w: 65, h: 65, toOscillate: false},
        Math.random(),
        1,
      );
    }
  }

  const oldRemovePetal = craftingMenu.removeCraftingPetalContainers;
  craftingMenu.removeCraftingPetalContainers = function() {
    // When the player removes petals from the crafting slots, also remove the preview.
    oldRemovePetal.apply(this);
    this.previewPetalContainer = undefined;
  }

  const oldEnterGame = craftingMenu.enterGame;
  craftingMenu.enterGame = function() {
    // When the player starts a run, also remove the preview.
    oldEnterGame.apply(this);
    this.previewPetalContainer = undefined;
  }
}