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
// @grant        unsafeWindow
// ==/UserScript==

(function () {
  'use strict';

  var Rarity = /* @__PURE__ */ ((Rarity2) => {
    Rarity2[Rarity2["COMMON"] = 0] = "COMMON";
    Rarity2[Rarity2["UNUSUAL"] = 1] = "UNUSUAL";
    Rarity2[Rarity2["RARE"] = 2] = "RARE";
    Rarity2[Rarity2["EPIC"] = 3] = "EPIC";
    Rarity2[Rarity2["LEGENDARY"] = 4] = "LEGENDARY";
    Rarity2[Rarity2["MYTHIC"] = 5] = "MYTHIC";
    Rarity2[Rarity2["ULTRA"] = 6] = "ULTRA";
    Rarity2[Rarity2["SUPER"] = 7] = "SUPER";
    Rarity2[Rarity2["OMEGA"] = 8] = "OMEGA";
    Rarity2[Rarity2["FABLED"] = 9] = "FABLED";
    Rarity2[Rarity2["DIVINE"] = 10] = "DIVINE";
    Rarity2[Rarity2["SUPREME"] = 11] = "SUPREME";
    Rarity2[Rarity2["OMNIPOTENT"] = 12] = "OMNIPOTENT";
    Rarity2[Rarity2["ASTRAL"] = 13] = "ASTRAL";
    Rarity2[Rarity2["CELESTIAL"] = 14] = "CELESTIAL";
    Rarity2[Rarity2["SERAPHIC"] = 15] = "SERAPHIC";
    Rarity2[Rarity2["TRANSCENDENT"] = 16] = "TRANSCENDENT";
    Rarity2[Rarity2["ETHEREAL"] = 17] = "ETHEREAL";
    Rarity2[Rarity2["GALACTIC"] = 18] = "GALACTIC";
    Rarity2[Rarity2["ETERNAL"] = 19] = "ETERNAL";
    Rarity2[Rarity2["APOTHEOTIC"] = 20] = "APOTHEOTIC";
    Rarity2[Rarity2["VOIDBOUND"] = 21] = "VOIDBOUND";
    Rarity2[Rarity2["EXALTED"] = 22] = "EXALTED";
    Rarity2[Rarity2["CHAOS"] = 23] = "CHAOS";
    Rarity2[Rarity2["CATACLYSMIC"] = 24] = "CATACLYSMIC";
    Rarity2[Rarity2["NULLBORNE"] = 25] = "NULLBORNE";
    Rarity2[Rarity2["ECLIPSED"] = 26] = "ECLIPSED";
    Rarity2[Rarity2["RADIANT"] = 27] = "RADIANT";
    Rarity2[Rarity2["FORSAKEN"] = 28] = "FORSAKEN";
    Rarity2[Rarity2["CHROMATIC"] = 29] = "CHROMATIC";
    Rarity2[Rarity2["PRISMATIC"] = 30] = "PRISMATIC";
    Rarity2[Rarity2["ARCANE"] = 31] = "ARCANE";
    Rarity2[Rarity2["ESOTERIC"] = 32] = "ESOTERIC";
    Rarity2[Rarity2["METAPHYSICAL"] = 33] = "METAPHYSICAL";
    Rarity2[Rarity2["PRIMORDIAL"] = 34] = "PRIMORDIAL";
    return Rarity2;
  })(Rarity || {});
  const CINDER_COLOUR = "#fc9547";
  const MAX_PETAL_RARITY = Rarity.APOTHEOTIC;
  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  const statsBoxQueue = [];
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
  const theoryCraft = [];
  function convertPetalValue(amount, oldRarity, newRarity) {
    if (oldRarity > MAX_PETAL_RARITY) {
      return Infinity;
    }
    if (newRarity > MAX_PETAL_RARITY) {
      return 0;
    }
    while (oldRarity < newRarity) {
      amount /= theoryCraft[oldRarity];
      oldRarity++;
    }
    while (oldRarity > newRarity) {
      amount *= theoryCraft[oldRarity - 1];
      oldRarity--;
    }
    return amount;
  }
  function isInGameInput(e) {
    if (e.repeat) {
      e.preventDefault();
    }
    return _unsafeWindow.state === "game" && !inputHandler.chatOpen && !e.repeat;
  }
  function deepCopy(obj, depth = 5) {
    if (depth === 0) {
      return obj;
    }
    if (obj === null) {
      return obj;
    }
    if (typeof obj === "object") {
      try {
        if (Array.isArray(obj)) {
          return obj.map((item) => deepCopy(item, depth - 1));
        } else {
          const ret = Object.create(Object.getPrototypeOf(obj));
          for (let key in obj) {
            ret[key] = deepCopy(obj[key], depth - 1);
          }
          return ret;
        }
      } catch (e) {
        console.warn("Failed to copy:", obj);
        return obj;
      }
    } else {
      return obj;
    }
  }
  function addScreenshotMode() {
    const originalRenderGame = renderGame;
    const originalOnMessage = ws.onmessage;
    const originalDeadMenuDraw = deadMenu.draw;
    const queuedMessages = [];
    let screenshotMode = false;
    let screenshotRoom;
    let runningRoom;
    function toggleScreenshotMode() {
      screenshotMode = !screenshotMode;
      if (screenshotMode) {
        deadMenu.draw = () => {
        };
        screenshotRoom = deepCopy(room);
        runningRoom = room;
        renderGame = (dt) => {
          ws.onmessage = (data2) => {
            queuedMessages.push(data2);
          };
          chatDiv.classList.add("hidden");
          room = screenshotRoom;
          originalRenderGame(dt);
          ctx.save();
          ctx.lineWidth = 6;
          ctx.font = "900 32px 'Ubuntu'";
          ctx.textAlign = "right";
          ctx.textBaseline = "top";
          ctx.fillStyle = CINDER_COLOUR;
          ctx.strokeStyle = "black";
          const text = "Screenshot Mode";
          ctx.strokeText(text, canvas.w - 30, 30);
          ctx.fillText(text, canvas.w - 30, 30);
          ctx.restore();
          room = runningRoom;
          let data = queuedMessages.shift();
          while (!isNil(data)) {
            originalOnMessage?.apply(ws, [data]);
            data = queuedMessages.shift();
          }
          ws.onmessage = originalOnMessage;
        };
      } else {
        room = runningRoom;
        chatDiv.classList.remove("hidden");
        deadMenu.draw = originalDeadMenuDraw;
        renderGame = originalRenderGame;
        let data = queuedMessages.shift();
        while (!isNil(data)) {
          originalOnMessage?.apply(ws, [data]);
          data = queuedMessages.shift();
        }
        ws.onmessage = originalOnMessage;
      }
    }
    const originalHandleKey = inputHandler.handleKey;
    inputHandler.handleKey = function(e) {
      originalHandleKey.apply(inputHandler, [e]);
      if (!isInGameInput(e)) {
        return;
      }
      if (e.code === localStorage.getItem("cinderDevScreenshotMode") && e.code.length > 0 && e.type === "keydown") {
        toggleScreenshotMode();
      }
    };
  }
  const defaultSettings = Object.freeze({
    petalCraftPreview: true,
    autoCopyCodes: true,
    missileDrawPriority: true,
    invertAttack: false,
    invertDefend: false,
    baseReciprocalOfFOV: 3,
    playerHpBarScale: 2.5,
    specialDropsScale: 2.5,
    specialDropsQuantity: 1,
    specialDropsRarity: Rarity.TRANSCENDENT,
    keybindStatsBox: "KeyG",
    keybindInvertAttack: "Comma",
    keybindInvertDefend: "Period"
  });
  class SettingsManager {
    savedSettings = { ...defaultSettings };
    constructor() {
      const loadedSettings = JSON.parse(
        localStorage.getItem("cinderSettings") ?? "{}"
      );
      this.savedSettings = { ...this.savedSettings, ...loadedSettings };
      settingsMenu.cinderSetting = (key, value) => {
        this.set(key, value);
      };
    }
    get(key) {
      return this.savedSettings[key];
    }
    set(key, value) {
      this.savedSettings[key] = value;
      localStorage.setItem("cinderSettings", JSON.stringify(this.savedSettings));
    }
  }
  const settings = new SettingsManager();
  function displayMissilesAboveEnemies() {
    const originalRenderGame = renderGame;
    renderGame = (dt) => {
      if (!settings.get("missileDrawPriority")) {
        originalRenderGame(dt);
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
      originalRenderGame(dt);
      for (let enemy of Object.values(room.enemies)) {
        enemy.draw = Enemy.prototype.draw;
      }
    };
  }
  function enlargeZoomedOutItems() {
    const originalRenderHpBar = renderHpBar;
    renderHpBar = function(data, entity) {
      if (data.flowerName !== void 0 && entity?.id === _unsafeWindow.selfId) {
        const scale = settings.get("playerHpBarScale");
        const rScale = scale ** (1 / 1.2);
        data.y -= (scale - 1) * data.radius;
        data.radius *= rScale;
      }
      originalRenderHpBar(data, entity);
    };
    const originalNewPetalContainer = processGameMessageMap.newPetalContainer;
    processGameMessageMap.newPetalContainer = function(data, _me, _advanced) {
      const scale = settings.get("specialDropsScale");
      const desiredRarity = settings.get("specialDropsRarity");
      const desiredQuantity = settings.get("specialDropsQuantity");
      const effectiveQuantity = convertPetalValue(
        data.amount ?? 1,
        data.rarity,
        desiredRarity
      );
      if (effectiveQuantity >= desiredQuantity) {
        const originalSize = data.w;
        data.w *= scale;
        data.h *= scale;
        const dx = data.x - data.originalX;
        const dy = data.y - data.originalY;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d > 0) {
          data.x = data.originalX + dx * (d + originalSize * (scale - 1)) / d;
          data.y = data.originalY + dy * (d + originalSize * (scale - 1)) / d;
        }
      }
      originalNewPetalContainer(data, _me, _advanced);
    };
  }
  function fixNegativeRadiusFreeze() {
    const originalArc = ctx.arc;
    ctx.arc = function(...args) {
      if (args[2] > 0) {
        originalArc.apply(this, args);
      }
    };
  }
  const wsDataProcessing = [];
  function initTheoryCraft() {
    if (theoryCraft.length > 0) {
      console.warn("theoryCraft already initialized!");
      return;
    }
    for (let rarity = 0; rarity <= MAX_PETAL_RARITY; rarity++) {
      theoryCraft.push(5);
      let probFailedSoFar = 1;
      let attempt = 0;
      while (probFailedSoFar > 0) {
        probFailedSoFar *= 1 - calculateChance(attempt, rarity) / 100;
        theoryCraft[rarity] += probFailedSoFar * 2.5;
        attempt++;
      }
    }
  }
  function allowWsDataProcessing() {
    function injectWsSend() {
      const originalSend = ws.send;
      ws.send = function(data) {
        const rawData = msgpackr.unpack(data);
        for (let fn of wsDataProcessing) {
          fn(rawData);
        }
        originalSend.apply(ws, [msgpackr.pack(rawData)]);
      };
    }
    const originalInitWS = initWS;
    initWS = function() {
      originalInitWS();
      injectWsSend();
    };
    if (!isNil(ws)) {
      injectWsSend();
    }
  }
  function addWsDataProcessing(fn) {
    wsDataProcessing.push(fn);
  }
  function unfreezeObjects() {
    processGameMessageMap = { ...processGameMessageMap };
  }
  function refreezeObjects() {
    processGameMessageMap = Object.freeze(processGameMessageMap);
  }
  function enableInvertAttackAndDefend() {
    let rawAttacking = false;
    let rawDefending = false;
    function updateClientAttack() {
      const newAttacking = rawAttacking !== settings.get("invertAttack");
      if (!isNil(_unsafeWindow.selfId)) {
        const player = room.flowers[_unsafeWindow.selfId];
        if (!isNil(player)) {
          player.attacking = newAttacking;
        }
      }
      return newAttacking;
    }
    function updateClientDefend() {
      const newDefending = rawDefending !== settings.get("invertDefend");
      if (!isNil(_unsafeWindow.selfId)) {
        const player = room.flowers[_unsafeWindow.selfId];
        if (!isNil(player)) {
          player.defending = newDefending;
        }
      }
      return newDefending;
    }
    addWsDataProcessing((data) => {
      if (!isNil(data.attack)) {
        rawAttacking = data.attack;
        data.attack = updateClientAttack();
      } else if (data[0] === "a") {
        rawAttacking = data[1];
        data[1] = updateClientAttack();
      } else if (!isNil(data.defend)) {
        rawDefending = data.defend;
        data.defend = updateClientDefend();
      } else if (data[0] === "d") {
        rawDefending = data[1];
        data[1] = updateClientDefend();
      }
    });
    const originalHandleKey = inputHandler.handleKey;
    inputHandler.handleKey = function(e) {
      originalHandleKey.apply(this, [e]);
      if (!isInGameInput(e)) {
        return;
      }
      if (e.type === "keydown") {
        if (e.code === settings.get("keybindInvertAttack")) {
          const newInvertAttack = !settings.get("invertAttack");
          settings.set("invertAttack", newInvertAttack);
          chatAnnounce(
            "Invert Attack set to " + (newInvertAttack ? "ON" : "OFF") + "!",
            "#ffbfbf"
            // Pink
          );
          send({ attack: rawAttacking });
        }
        if (e.code === settings.get("keybindInvertDefend")) {
          const newInvertDefend = !settings.get("invertDefend");
          settings.set("invertDefend", newInvertDefend);
          chatAnnounce(
            "Invert Defend set to " + (newInvertDefend ? "ON" : "OFF") + "!",
            "#bfbfff"
            // Light blue
          );
          send({ defend: rawDefending });
        }
      }
    };
    const originalEnterGame = enterGame;
    enterGame = function() {
      originalEnterGame();
      send({ attack: false });
      send({ attack: false });
    };
  }
  function modifyBaseFOV() {
    const originalHandleKey = inputHandler.handleKey;
    inputHandler.handleKey = function(e) {
      originalHandleKey.apply(inputHandler, [e]);
      if (!isInGameInput(e)) {
        return;
      }
      if (e.code === "BracketLeft" && e.type === "keydown") {
        fov = 1 / settings.get("baseReciprocalOfFOV");
      }
    };
    const originalEnterGame = enterGame;
    enterGame = function() {
      originalEnterGame();
      fov = 1 / settings.get("baseReciprocalOfFOV");
    };
  }
  function addPetalCraftPreview() {
    craftingMenu.previewPetalSlot = {
      x: craftingMenu.w * 0.83,
      y: craftingMenu.h * 0.167,
      w: 65,
      h: 65
    };
    const originalDrawCrafting = craftingMenu.drawInventory;
    craftingMenu.drawInventory = function(alpha = 1) {
      if (!settings.get("petalCraftPreview")) {
        originalDrawCrafting.apply(this, [alpha]);
        return;
      }
      const originalDrawStatsBox = PetalContainer.prototype.drawStatsBox;
      PetalContainer.prototype.drawStatsBox = function(...args) {
        queueDrawStatsBox(this, args);
      };
      originalDrawCrafting.apply(this, [alpha]);
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
      PetalContainer.prototype.drawStatsBox = originalDrawStatsBox;
      drawQueuedStatsBoxes();
    };
    const originalAddPetal = craftingMenu.addCraftingPetalContainers;
    craftingMenu.addCraftingPetalContainers = function(type, rarity, amount, attempt) {
      originalAddPetal.apply(this, [type, rarity, amount, attempt]);
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
    const originalRemovePetal = craftingMenu.removeCraftingPetalContainers;
    craftingMenu.removeCraftingPetalContainers = function() {
      originalRemovePetal.apply(this);
      this.previewPetalContainer = void 0;
    };
    const originalEnterGame = craftingMenu.enterGame;
    craftingMenu.enterGame = function() {
      originalEnterGame.apply(this);
      this.previewPetalContainer = void 0;
    };
  }
  function addQuickStatsBoxHotkey() {
    let showQuickStatsBox = false;
    const originalHandleKey = inputHandler.handleKey;
    inputHandler.handleKey = function(e) {
      originalHandleKey.apply(inputHandler, [e]);
      if (!isInGameInput(e)) {
        return;
      }
      if (e.code === settings.get("keybindStatsBox") && e.type === "keydown") {
        showQuickStatsBox = !showQuickStatsBox;
      }
    };
    const originalRenderGame = renderGame;
    const originalDrawStatsBox = PetalContainer.prototype.drawStatsBox;
    renderGame = (dt) => {
      if (showQuickStatsBox) {
        PetalContainer.prototype.drawStatsBox = function() {
          if (this.petals[0]?.constructor === Petal) {
            originalDrawStatsBox.apply(this);
          }
        };
      }
      originalRenderGame(dt);
      PetalContainer.prototype.drawStatsBox = originalDrawStatsBox;
      if (showQuickStatsBox) {
        const totalCount = {};
        for (let enemyBox of Object.values(room.enemyBoxes)) {
          totalCount[enemyBox.type] ??= 0;
          totalCount[enemyBox.type] += enemyBox.amount;
        }
        let highestBox = void 0;
        for (let enemyBox of Object.values(room.enemyBoxes)) {
          if (isNil(highestBox) || enemyBox.rarity > highestBox.rarity || enemyBox.rarity === highestBox.rarity && totalCount[enemyBox.type] <= totalCount[highestBox.type]) {
            if (!enemyBox.isBoss) {
              highestBox = enemyBox;
            }
          }
        }
        if (!isNil(highestBox)) {
          if (isNil(highestBox.ec)) {
            highestBox.ec = mobGallery.generateEnemyPc(
              highestBox.type,
              highestBox.rarity,
              1
            );
          }
          if (!Stats.enemies[highestBox.type]) {
            calculateStats();
          } else {
            highestBox.ec.isHovered = true;
            highestBox.ec.drawStatsBox(
              true,
              true,
              canvas.w / 2 + highestBox.x,
              highestBox.y + highestBox.w / 2 + 3 * highestBox.w / 5
            );
          }
        }
      }
    };
  }
  function addRandomizedSquadCodes() {
    const originalSendRoomRequest = sendRoomRequest;
    sendRoomRequest = function(msg) {
      if (msg.findPrivate === true && msg.squadCode === "") {
        const newCode = randomSquadCode();
        msg.squadCode = newCode;
        if (settings.get("autoCopyCodes")) {
          navigator.clipboard.writeText(newCode);
          chatAnnounce("Code copied to clipboard! (" + newCode + ")");
        } else {
          chatAnnounce("Random code generated! (" + newCode + ")");
        }
      }
      originalSendRoomRequest(msg);
    };
    const originalPrompt = prompt;
    _unsafeWindow.prompt = function(msg, _def) {
      if (msg === "Enter Private Squad Code") {
        msg = "Enter private squad code (leave empty to generate a random code):";
      }
      return originalPrompt(msg, _def);
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
  unfreezeObjects();
  initTheoryCraft();
  allowWsDataProcessing();
  addPetalCraftPreview();
  addRandomizedSquadCodes();
  displayMissilesAboveEnemies();
  modifyBaseFOV();
  enlargeZoomedOutItems();
  fixNegativeRadiusFreeze();
  addQuickStatsBoxHotkey();
  enableInvertAttackAndDefend();
  addScreenshotMode();
  refreezeObjects();

})();