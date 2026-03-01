// ==UserScript==
// @name         Flowr - Cinderscript
// @namespace    npm/vite-plugin-monkey
// @version      1.0.0
// @author       PigeonBar (original creator)
// @description  A free, publicly available collection of QoL features for flowr.fun players.
// @icon         https://www.google.com/s2/favicons?sz=64&domain=flowr.fun
// @downloadURL  https://raw.githubusercontent.com/PigeonBar/flowr-cinderscript/refs/heads/main/dist/cinderscript.user.js
// @updateURL    https://raw.githubusercontent.com/PigeonBar/flowr-cinderscript/refs/heads/main/dist/cinderscript.user.js
// @match        https://flowr.fun/
// ==/UserScript==

(function () {
  'use strict';

  const settingsKeys = Object.freeze([
    "petalCraftPreview",
    "autoCopyCodes",
    "missileDrawPriority"
  ]);
  const defaultSettings = Object.freeze({
    petalCraftPreview: true,
    autoCopyCodes: true,
    missileDrawPriority: true
  });
  class SettingsManager {
    petalCraftPreview = true;
    autoCopyCodes = true;
    missileDrawPriority = true;
    savedSettings = { ...defaultSettings };
    constructor() {
      const loadedSettings = JSON.parse(
        localStorage.getItem("cinderSettings") ?? "{}"
      );
      for (let key of settingsKeys) {
        this[key] = loadedSettings[key] ?? defaultSettings[key];
        this.savedSettings[key] = loadedSettings[key] ?? defaultSettings[key];
      }
      globalThis.cinderSetting = (key, value) => {
        this.setSetting(key, value);
      };
    }
    setSetting(key, value) {
      this[key] = value;
      this.savedSettings[key] = value;
      localStorage.setItem("cinderSettings", JSON.stringify(this.savedSettings));
    }
  }
  const settings = new SettingsManager();
  function displayMissilesAboveEnemies() {
    const oldRenderGame = renderGame;
    renderGame = (dt) => {
      if (!settings.missileDrawPriority) {
        oldRenderGame(dt);
        return;
      }
      const queuedMissiles = [];
      const maxId = Math.max(...Object.keys(room.enemies).map((k) => Number(k)));
      for (let id in room.enemies) {
        const enemy = room.enemies[id];
        if (enemy.type.includes("Missile")) {
          enemy.draw = function() {
            queuedMissiles.push(this);
          };
        }
        if (Number(id) === maxId) {
          enemy.draw = function() {
            Enemy.prototype.draw.apply(this);
            for (let missile of queuedMissiles) {
              Enemy.prototype.draw.apply(missile);
            }
          };
        }
      }
      oldRenderGame(dt);
      for (let enemy of Object.values(room.enemies)) {
        enemy.draw = Enemy.prototype.draw;
      }
    };
  }
  const statsBoxQueue = [];
  const CINDER_COLOUR = "#fc9547";
  function isNil(arg) {
    return arg === void 0 || arg === null;
  }
  function queueDrawStatsBox(container, args) {
    statsBoxQueue.push({ container, args });
  }
  function drawQueuedStatsBoxes() {
    let queueEmpty = false;
    while (!queueEmpty) {
      const item = statsBoxQueue.shift();
      if (isNil(item)) {
        queueEmpty = true;
      } else {
        const { container, args } = item;
        container.drawStatsBox(...args);
      }
    }
  }
  function chatAnnounce(msg, color = CINDER_COLOUR) {
    chatDiv.classList.remove("hidden");
    appendChatAnnouncement("[Cinder]: " + msg, color);
  }
  function addPetalCraftPreview() {
    craftingMenu.previewPetalSlot = {
      x: craftingMenu.w * 0.83,
      y: craftingMenu.h * 0.167,
      w: 65,
      h: 65
    };
    const oldDrawCrafting = craftingMenu.drawInventory;
    craftingMenu.drawInventory = function(alpha = 1) {
      if (settings.petalCraftPreview !== true) {
        oldDrawCrafting.apply(this, [alpha]);
        return;
      }
      const oldDrawStatsBox = PetalContainer.prototype.drawStatsBox;
      PetalContainer.prototype.drawStatsBox = function(...args) {
        queueDrawStatsBox(this, args);
      };
      oldDrawCrafting.apply(this, [alpha]);
      let translation = 0;
      if (time - this.lastCloseTime < 160) {
        translation += this.h * easeOutCubic((time - this.lastCloseTime) / 160);
      }
      if (time - this.lastOpenTime < 160) {
        translation += this.h + 40 - (this.h + 40) * easeOutCubic((time - this.lastOpenTime) / 160);
      }
      if (translation !== 0) {
        ctx.translate(0, translation);
      }
      ctx.translate(130, canvas.h - this.h - 20);
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
      ctx.fillStyle = "#f0f0f0";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 3.75;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "900 16px Ubuntu";
      ctx.strokeText("Preview", slot.x, slot.y - 55);
      ctx.fillText("Preview", slot.x, slot.y - 55);
      const mouseX = mouse.x * canvas.w / window.innerWidth;
      const mouseY = mouse.y * canvas.h / window.innerHeight;
      const container = this.previewPetalContainer;
      if (container !== void 0) {
        container.draw();
        if (mouseInBox(
          { x: mouseX, y: mouseY },
          {
            x: container.render.x - container.w / 2 + 130,
            y: container.render.y - container.h / 2 + canvas.h - this.h - 20,
            w: container.w,
            h: container.h
          }
        )) {
          container.isHovered = true;
        }
        container.drawStatsBox(
          false,
          false,
          130 + container.render.x,
          canvas.h - this.h - 20 + container.render.y
        );
      }
      ctx.translate(-130, -(canvas.h - this.h - 20));
      if (translation !== 0) {
        ctx.translate(0, -translation);
      }
      PetalContainer.prototype.drawStatsBox = oldDrawStatsBox;
      drawQueuedStatsBoxes();
    };
    const oldAddPetal = craftingMenu.addCraftingPetalContainers;
    craftingMenu.addCraftingPetalContainers = function(type, rarity, amount, attempt) {
      oldAddPetal.apply(this, [type, rarity, amount, attempt]);
      const currentPetal = this.craftingPetalContainers[0];
      if (currentPetal !== void 0 && (this.previewPetalContainer?.type !== currentPetal.type || this.previewPetalContainer?.rarity !== currentPetal.rarity + 1)) {
        const slot = this.previewPetalSlot;
        this.previewPetalContainer = new PetalContainer(
          [new Petal({ type: currentPetal.type, rarity: currentPetal.rarity + 1 })],
          { x: slot.x, y: slot.y, w: 65, h: 65, toOscillate: false },
          Math.random(),
          1
        );
      }
    };
    const oldRemovePetal = craftingMenu.removeCraftingPetalContainers;
    craftingMenu.removeCraftingPetalContainers = function() {
      oldRemovePetal.apply(this);
      this.previewPetalContainer = void 0;
    };
    const oldEnterGame = craftingMenu.enterGame;
    craftingMenu.enterGame = function() {
      oldEnterGame.apply(this);
      this.previewPetalContainer = void 0;
    };
  }
  function addRandomizedSquadCodes() {
    const oldSendRoomRequest = sendRoomRequest;
    sendRoomRequest = function(msg) {
      if (msg.findPrivate === true && msg.squadCode === "") {
        const newCode = randomSquadCode();
        msg.squadCode = newCode;
        if (settings.autoCopyCodes) {
          navigator.clipboard.writeText(newCode);
          chatAnnounce("Code copied to clipboard! (" + newCode + ")");
        } else {
          chatAnnounce("Random code generated! (" + newCode + ")");
        }
      }
      oldSendRoomRequest(msg);
    };
    const oldPrompt = prompt;
    globalThis.prompt = function(msg, _default) {
      if (msg === "Enter Private Squad Code") {
        msg = "Enter private squad code (leave empty to generate a random code):";
      }
      return oldPrompt(msg, _default);
    };
  }
  function randomSquadCode() {
    let squadCode = "";
    let hasLetter = false;
    for (let i = 0; i < 6; i++) {
      const roll = Math.floor(Math.random() * 16);
      if (roll < 10) {
        squadCode += String.fromCharCode("0".charCodeAt(0) + roll);
      } else {
        squadCode += String.fromCharCode("a".charCodeAt(0) + roll - 10);
        hasLetter = true;
      }
    }
    return hasLetter ? squadCode : randomSquadCode();
  }
  addPetalCraftPreview();
  addRandomizedSquadCodes();
  displayMissilesAboveEnemies();

})();