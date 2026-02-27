// Disclaimer: All usage of scripts is at your own risk. (Though if you find
// any severe bugs, do feel free to let me know.)

// ==UserScript==
// @name         Flowr - Cinderscript
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  A free, publicly available collection of QoL features for flowr.fun players.
// @author       PigeonBar (original creator)
// @match        https://flowr.fun
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @downloadURL  https://raw.githubusercontent.com/PigeonBar/flowr-cinderscript/refs/heads/main/cinderscript.js
// @updateURL    https://raw.githubusercontent.com/PigeonBar/flowr-cinderscript/refs/heads/main/cinderscript.js
// @grant        none
// ==/UserScript==


"use strict";


// #region Settings (lots TBD)

window.cinderSettings = JSON.parse(localStorage.getItem("cinderSettings"));

// Defaults
const defaultSettings = {
  petalCraftPreview: true,
};

window.cinderSettings ??= {};

for (let key in defaultSettings) {
  window.cinderSettings[key] ??= defaultSettings[key];
}

// #region Utils

window.cinderObj = {};

window.cinderObj.statsBoxQueue = [];

/**
 * Queues a stats box to be drawn at some point in the future.
 * Useful for making sure that stats boxes are drawn above other objects.
 * @param {*} container The `PetalContainer` that the stats box belongs to.
 * @param {*} args The args that got passed into `PetalContainer.drawStatsBox`.
 */
function queueDrawStatsBox(container, args) {
  window.cinderObj.statsBoxQueue.push({container, args});
}

/**
 * Draws all of the queued stats boxes, then removes them from the queue.
 */
function drawQueuedStatsBoxes() {
  while (window.cinderObj.statsBoxQueue.length > 0) {
    const {container, args} = window.cinderObj.statsBoxQueue.shift();
    container.drawStatsBox(...args);
  }
}


// #region Feature: Petal craft preview (4Yud's idea)

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
  if (window.cinderSettings.petalCraftPreview !== true) {
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