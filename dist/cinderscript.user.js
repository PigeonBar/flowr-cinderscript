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
  const LIGHT_CINDER_COLOUR = "#ffaf60";
  const CINDER_COLOUR = "#fc9547";
  const CINDER_BORDER_COLOUR = "#cc7b3d";
  const MAX_PETAL_RARITY = Rarity.CHAOS;
  const SETTINGS_OPTION_HEIGHT = 50;
  const SETTINGS_BUTTON_SIZE = 28;
  const EDIT_ICON_SIZE = 20;
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
  function rarityToIndex(rarity) {
    return Rarity[rarity.toUpperCase()];
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
  let invertAttackToggle;
  let invertDefendToggle;
  function initInvertToggles(atkToggle, defToggle) {
    invertAttackToggle = atkToggle;
    invertDefendToggle = defToggle;
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
    }
    get(key) {
      return this.savedSettings[key];
    }
    set(key, value) {
      this.savedSettings[key] = value;
      localStorage.setItem("cinderSettings", JSON.stringify(this.savedSettings));
      if (key === "invertAttack") {
        invertAttackToggle.state = value;
      } else if (key === "invertDefend") {
        invertDefendToggle.state = value;
      }
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
      send({ defend: false });
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
      const mouseX = mouse.canvasX;
      const mouseY = mouse.canvasY;
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
  const editIcon = new Image();
  editIcon.src = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB3aWR0aD0iMTAwLjAwMDA1bW0iCiAgIGhlaWdodD0iMTAwLjAwMDA2bW0iCiAgIHZpZXdCb3g9IjAgMCAxMDAuMDAwMDUgMTAwLjAwMDA2IgogICB2ZXJzaW9uPSIxLjEiCiAgIGlkPSJzdmcxIgogICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxkZWZzCiAgICAgaWQ9ImRlZnMxIiAvPgogIDxnCiAgICAgaWQ9ImxheWVyMSIKICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtODkuNTI0OTc3LC0zNS42MzI2MDUpIj4KICAgIDxyZWN0CiAgICAgICBzdHlsZT0iZmlsbDojZmZmZmZmO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTojZmZmZmZmO3N0cm9rZS13aWR0aDowLjI4MjEzNztzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSIKICAgICAgIGlkPSJyZWN0MS04IgogICAgICAgd2lkdGg9IjMxLjEyMTQyOSIKICAgICAgIGhlaWdodD0iMTguNTYwMDA3IgogICAgICAgeD0iLTE3NC43NzIyMyIKICAgICAgIHk9Ijc0LjQxNzAyMyIKICAgICAgIHRyYW5zZm9ybT0ibWF0cml4KC0wLjcwNzEwMDA4LC0wLjcwNzExMzQ5LDAuNzA3MTAwMDgsLTAuNzA3MTEzNDksMCwwKSIgLz4KICAgIDxyZWN0CiAgICAgICBzdHlsZT0iZmlsbDojZmZmZmZmO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTojZmZmZmZmO3N0cm9rZS13aWR0aDowLjUxNDk0NTtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSIKICAgICAgIGlkPSJyZWN0MS04LTEiCiAgICAgICB3aWR0aD0iMzAuODg4NjI4IgogICAgICAgaGVpZ2h0PSI2Mi4yOTIxOTQiCiAgICAgICB4PSItMTc0LjY1NTg3IgogICAgICAgeT0iNS40NDUxNTA0IgogICAgICAgdHJhbnNmb3JtPSJtYXRyaXgoLTAuNzA3MTAwMDgsLTAuNzA3MTEzNDksMC43MDcxMDAwOCwtMC43MDcxMTM0OSwwLDApIiAvPgogICAgPHBhdGgKICAgICAgIHN0eWxlPSJmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOiNmZmZmZmY7c3Ryb2tlLXdpZHRoOjAuMDE7c3Ryb2tlLWxpbmVjYXA6c3F1YXJlO3N0cm9rZS1taXRlcmxpbWl0OjA7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjE7cGFpbnQtb3JkZXI6bWFya2VycyBzdHJva2UgZmlsbCIKICAgICAgIGlkPSJwYXRoNCIKICAgICAgIGQ9Im0gNzQuMzU4OTk5LDEzMy44ODE1OSAtMS4yNzY3NzUsMCAwLjYzODM4OCwtMS4xMDU3MiB6IgogICAgICAgdHJhbnNmb3JtPSJtYXRyaXgoLTE3LjI0NDI0MiwtMTcuMjQ0NTcsMTkuODY3Mjg2LC0xOS44Njc2NjMsLTEyNzYuOTkwOCw0MDQ0LjczNDgpIiAvPgogIDwvZz4KPC9zdmc+Cg==";
  class SettingsOption {
    name;
    state;
    changeTime;
    screenPosition;
    /**
     * A legacy field that is used for the settings menu to handle
     * {@linkcode BooleanOption BooleanOptions}.
     */
    toggleFn;
    constructor(name) {
      this.name = name;
      this.changeTime = 0;
      this.screenPosition = { x: 0, y: 0, w: 0, h: 0 };
      this.state = void 0;
      this.toggleFn = () => {
      };
    }
    /**
     * @returns `true` iff this is a {@linkcode SettingsSectionHeading}.
     */
    isSectionHeading() {
      return false;
    }
    /**
     * @returns `true` iff this is a {@linkcode BooleanOption}.
     */
    isBooleanOption() {
      return false;
    }
    /**
     * @returns `true` iff this is a {@linkcode DisplayValueOption}.
     */
    isDisplayValueOption() {
      return false;
    }
    /**
     * @returns `true` iff this is a {@linkcode RarityOption}.
     */
    isRarityOption() {
      return false;
    }
    /**
     * Determines whether or not the given mouse coordinates are inside this
     * option's button.
     */
    mouseInButton(e) {
      return mouseInBox(e, this.screenPosition);
    }
  }
  class BooleanOption extends SettingsOption {
    state;
    constructor(name, settingsKey) {
      super(name);
      this.state = settings.get(settingsKey);
      this.toggleFn = (state) => {
        settings.set(settingsKey, state);
      };
    }
    isBooleanOption() {
      return true;
    }
  }
  class DisplayValueOption extends SettingsOption {
    isDisplayValueOption() {
      return true;
    }
    /**
     * Determines the colour that the value should be displayed in.
     */
    getValueFillStyle() {
      if (this.changeTime > 0 && time - this.changeTime < 1500) {
        const ratio = (time - this.changeTime) / 1500;
        return blendColor("#ffffff", "#3fff3f", ratio);
      } else {
        return "#3fff3f";
      }
    }
    /**
     * Determines the displayed value, with formatting if necessary.
     */
    getDisplayedValue() {
      return "" + this.state;
    }
    /**
     * Draws this option inside the given settings menu.
     * 
     * Large amounts of this code is adapted from Flowr's base code.
     */
    draw(menu) {
      this.screenPosition = {
        x: 15 + menu.x,
        y: menu.currentHeight + SETTINGS_OPTION_HEIGHT / 2 - SETTINGS_BUTTON_SIZE / 2 + menu.y,
        w: SETTINGS_BUTTON_SIZE,
        h: SETTINGS_BUTTON_SIZE
      };
      ctx.fillStyle = "#9f9f9f";
      ctx.strokeStyle = "#5f5f5f";
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.rect(
        this.screenPosition.x - menu.x,
        this.screenPosition.y - menu.y,
        this.screenPosition.w,
        this.screenPosition.h
      );
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
      ctx.drawImage(
        editIcon,
        15 + SETTINGS_BUTTON_SIZE / 2 - EDIT_ICON_SIZE / 2,
        menu.currentHeight + SETTINGS_OPTION_HEIGHT / 2 - EDIT_ICON_SIZE / 2,
        EDIT_ICON_SIZE,
        EDIT_ICON_SIZE
      );
      ctx.font = "900 17px Ubuntu";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillStyle = this.isRarityOption() ? "#cfcfcf" : "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.strokeText(
        this.name + ": ",
        15 + SETTINGS_BUTTON_SIZE + 13,
        menu.currentHeight + SETTINGS_OPTION_HEIGHT / 2
      );
      ctx.fillText(
        this.name + ": ",
        15 + SETTINGS_BUTTON_SIZE + 13,
        menu.currentHeight + SETTINGS_OPTION_HEIGHT / 2
      );
      ctx.fillStyle = this.getValueFillStyle();
      const prevTextWidth = ctx.measureText(this.name + ": ").width;
      ctx.strokeText(
        this.getDisplayedValue(),
        15 + SETTINGS_BUTTON_SIZE + 13 + prevTextWidth,
        menu.currentHeight + SETTINGS_OPTION_HEIGHT / 2
      );
      ctx.fillText(
        this.getDisplayedValue(),
        15 + SETTINGS_BUTTON_SIZE + 13 + prevTextWidth,
        menu.currentHeight + SETTINGS_OPTION_HEIGHT / 2
      );
      menu.currentHeight += SETTINGS_OPTION_HEIGHT;
    }
  }
  class NumberOption extends DisplayValueOption {
    state;
    settingsKey;
    minValue;
    maxValue;
    /**
     * The number of decimal digits that this setting's value is rounded to.
     */
    decimalDigits;
    constructor(name, settingsKey, minValue, maxValue, decimalDigits) {
      super(name);
      this.minValue = minValue;
      this.maxValue = maxValue;
      this.decimalDigits = decimalDigits;
      this.state = settings.get(settingsKey);
      this.settingsKey = settingsKey;
    }
    onClick() {
      const rawValue = parseFloat(prompt(
        `You are editing the setting "${this.name}".

Please enter a number between ${this.minValue} and ${this.maxValue}.`
      ) ?? "");
      if (rawValue >= this.minValue && rawValue <= this.maxValue) {
        const value = parseFloat(rawValue.toFixed(this.decimalDigits));
        this.changeTime = performance.now();
        this.state = value;
        settings.set(this.settingsKey, value);
      } else {
        alert(
          `Error: ${rawValue} is not a number between ${this.minValue} and ${this.maxValue}!`
        );
      }
    }
  }
  class RarityOption extends DisplayValueOption {
    state;
    settingsKey;
    constructor(name, settingsKey) {
      super(name);
      this.state = settings.get(settingsKey);
      this.settingsKey = settingsKey;
    }
    isRarityOption() {
      return true;
    }
    getValueFillStyle() {
      if (this.changeTime > 0 && time - this.changeTime < 1500) {
        const ratio = (time - this.changeTime) / 1500;
        return blendColor("#ffffff", Colors.rarities[this.state].color, ratio);
      } else {
        return Colors.rarities[this.state].color;
      }
    }
    getDisplayedValue() {
      return Colors.rarities[this.state].name;
    }
    onClick() {
      const response = prompt(
        `You are editing the setting "${this.name}".

Please enter a Rarity.`
      ) ?? "";
      const rarity = rarityToIndex(response);
      if (!isNil(rarity)) {
        this.changeTime = performance.now();
        this.state = rarity;
        settings.set(this.settingsKey, rarity);
      } else {
        alert(
          `Error: "${response}" is not a valid rarity!`
        );
      }
    }
  }
  class KeybindOption extends DisplayValueOption {
    state;
    settingsKey;
    /**
     * Whether or not the player is currently editing this setting.
     */
    editingState;
    /**
     * A timeout for cancelling an edit for this setting.
     */
    editingStateTimeout;
    constructor(name, settingsKey) {
      super(name);
      this.state = settings.get(settingsKey);
      this.settingsKey = settingsKey;
      this.editingState = false;
    }
    getValueFillStyle() {
      return this.editingState ? CINDER_COLOUR : super.getValueFillStyle();
    }
    getDisplayedValue() {
      return this.editingState ? "Editing..." : this.state;
    }
    onClick() {
      cinderSettingsMenu.setCurrentKeybindOption(this);
      this.editingState = true;
      this.editingStateTimeout = setTimeout(() => {
        cinderSettingsMenu.setCurrentKeybindOption(void 0);
      }, 3e3);
    }
    /**
     * Ends this option's editing state, and sets the setting to the new keybind
     * if given.
     */
    finishEdit(newKeybind) {
      clearTimeout(this.editingStateTimeout);
      this.editingState = false;
      this.editingStateTimeout = void 0;
      if (!isNil(newKeybind)) {
        this.changeTime = performance.now();
        this.state = newKeybind;
        settings.set(this.settingsKey, newKeybind);
      }
    }
  }
  class SettingsSectionHeading {
    text;
    constructor(text) {
      this.text = text;
    }
    /**
     * @returns `true` iff this is a {@linkcode SettingsSectionHeading}.
     */
    isSectionHeading() {
      return true;
    }
    /**
     * Draws this header inside the given settings menu.
     * 
     * This code is adapted from the Flowr changelog's horizontal dividers.
     */
    draw(menu) {
      ctx.font = "900 17px Ubuntu";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.strokeText(
        this.text,
        menu.w / 2,
        menu.currentHeight + SETTINGS_OPTION_HEIGHT / 2
      );
      ctx.fillText(
        this.text,
        menu.w / 2,
        menu.currentHeight + SETTINGS_OPTION_HEIGHT / 2
      );
      const halfTextWidth = ctx.measureText(this.text).width / 2;
      ctx.strokeStyle = "#7f7f7f";
      ctx.lineWidth = 8;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(
        20,
        menu.currentHeight + SETTINGS_OPTION_HEIGHT / 2
      );
      ctx.lineTo(
        menu.w / 2 - halfTextWidth - 20,
        menu.currentHeight + SETTINGS_OPTION_HEIGHT / 2
      );
      ctx.stroke();
      ctx.closePath();
      ctx.beginPath();
      ctx.moveTo(
        menu.w / 2 + halfTextWidth + 20,
        menu.currentHeight + SETTINGS_OPTION_HEIGHT / 2
      );
      ctx.lineTo(
        menu.w - 20 - 16,
        menu.currentHeight + SETTINGS_OPTION_HEIGHT / 2
      );
      ctx.stroke();
      ctx.closePath();
      menu.currentHeight += SETTINGS_OPTION_HEIGHT;
    }
  }
  class CinderSettingsMenu extends SettingsMenu {
    /**
     * The {@linkcode KeybindOption} currently being edited, if applicable.
     */
    currentKeybindOption;
    constructor() {
      super();
      initInvertToggles(
        new BooleanOption("Invert Attack", "invertAttack"),
        new BooleanOption("Invert Defend", "invertDefend")
      );
      this.w = 480;
      this.options = Object.freeze([
        invertAttackToggle,
        invertDefendToggle,
        new BooleanOption("Petal Craft Preview", "petalCraftPreview"),
        new BooleanOption("Auto Copy Squad Codes", "autoCopyCodes"),
        new NumberOption("Base FOV", "baseReciprocalOfFOV", 0.33, 5, 2),
        new NumberOption("Player HP Bar Scale", "playerHpBarScale", 0.5, 5, 2),
        new NumberOption("Special Drops Scale", "specialDropsScale", 1, 5, 2),
        new RarityOption("Special Drops Threshold Rarity", "specialDropsRarity"),
        new NumberOption(
          "Special Drops Threshold Amount",
          "specialDropsQuantity",
          0.1,
          999,
          1
        ),
        new BooleanOption("Missile Rendering Priority", "missileDrawPriority"),
        new SettingsSectionHeading("Keybinds"),
        new KeybindOption("Quick Stats Box", "keybindStatsBox"),
        new KeybindOption("Invert Attack", "keybindInvertAttack"),
        new KeybindOption("Invert Defend", "keybindInvertDefend")
      ]);
      const originalOnMouseDown = _unsafeWindow.onmousedown;
      _unsafeWindow.onmousedown = (e) => {
        originalOnMouseDown?.apply(_unsafeWindow, [e]);
        if (_unsafeWindow.connected === true) {
          this.mouseDown({ x: mouse.canvasX, y: mouse.canvasY });
        }
      };
      const originalDraw = settingsMenu.draw;
      settingsMenu.draw = function() {
        originalDraw.apply(this);
        cinderSettingsMenu.draw();
      };
    }
    /**
     * Renders the given {@linkcode SettingsOption}. Each type of option is
     * rendered differently.
     */
    renderOption(option) {
      if (option.isSectionHeading()) {
        option.draw(this);
      } else if (option.isBooleanOption()) {
        this.renderToggle(option);
      } else if (option.isDisplayValueOption()) {
        option.draw(this);
      }
    }
    /**
     * Processes the user clicking on the settings menu. Each type of option is
     * processed differently. This code is adapted from Flowr's client code.
     */
    mouseDown(e) {
      if (!this.active) {
        return;
      }
      for (let option of this.options) {
        if (!option.isSectionHeading()) {
          if (option.mouseInButton(e)) {
            if (option.isBooleanOption()) {
              this.processToggle(option, e);
            } else if (option.isDisplayValueOption()) {
              option.onClick();
            }
          }
        }
      }
    }
    toggle() {
      super.toggle();
      if (!this.active) {
        this.setCurrentKeybindOption(void 0);
      }
    }
    /**
     * Sets a {@linkcode KeybindOption} to be edited, and cancel the previous
     * keybind option if applicable.
     */
    setCurrentKeybindOption(option) {
      if (!isNil(this.currentKeybindOption)) {
        this.currentKeybindOption.finishEdit();
      }
      this.currentKeybindOption = option;
    }
  }
  const cinderSettingsMenu = new CinderSettingsMenu();
  function allowEditingKeybinds() {
    const originalHandleKey = inputHandler.handleKey;
    inputHandler.handleKey = function(e) {
      if (_unsafeWindow.state === "menu" && e.type === "keydown" && !e.repeat && !isNil(cinderSettingsMenu.currentKeybindOption)) {
        cinderSettingsMenu.currentKeybindOption.finishEdit(e.code);
        cinderSettingsMenu.setCurrentKeybindOption(void 0);
        return;
      }
      originalHandleKey.apply(inputHandler, [e]);
    };
  }
  function addNewMenuButtons() {
    const menuSeparatorLine = document.createElement("div");
    menuSeparatorLine.id = "menuSeparatorLine";
    const buttonList = changelogButton.parentElement;
    buttonList?.appendChild(menuSeparatorLine);
    const settingsImage = new Image(35, 35);
    settingsImage.src = `gfx/gear.png?v=${ver}`;
    settingsImage.draggable = false;
    const cinderSettingsButton = document.createElement("div");
    cinderSettingsButton.id = "cinderSettingsButton";
    cinderSettingsButton.appendChild(settingsImage);
    cinderSettingsButton.onclick = () => {
      cinderSettingsMenu.toggle();
    };
    buttonList?.appendChild(cinderSettingsButton);
    const styles = `
    #menuSeparatorLine {
      background-color: ${CINDER_BORDER_COLOUR};
      margin-left: 10px;
      margin-top: 10px;
      width: 41px;
      height: 5px;
      border-radius: 3px;
    }

    #cinderSettingsButton {
      border-color: ${CINDER_BORDER_COLOUR};
      border-style: solid;
      border-width: 3px;
      background-color: ${CINDER_COLOUR};
      border-radius: 8px;
      margin-left: 10px;
      margin-top: 10px;
      width: 35px;
      height: 35px;
      transition: background-color 0.1s;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    #cinderSettingsButton:hover {
      cursor: pointer;
      background-color: ${LIGHT_CINDER_COLOUR};
    }
    
    #changelogButton:hover {
      cursor: pointer;  /* I think the Flowr devs forgot to add this */
    }
  `;
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
  }
  const cinderChangelog = new Changelog();
  const menuList = Object.freeze([
    settingsMenu,
    changelog,
    cinderSettingsMenu,
    cinderChangelog,
    globalInventory,
    craftingMenu,
    mobGallery
  ]);
  function preventMenuOverlap() {
    for (let menu of menuList) {
      if (isTopMenu(menu)) {
        const originalToggle = menu.toggle;
        menu.toggle = function() {
          if (!menu.active) {
            closeAllMenus();
          }
          originalToggle.apply(menu);
        };
      } else {
        const originalToggle = menu.toggleMenu;
        menu.toggleMenu = function() {
          if (!menu.menuActive) {
            closeAllMenus();
          }
          originalToggle.apply(menu);
        };
      }
    }
  }
  function closeAllMenus() {
    for (let menu of menuList) {
      if (isTopMenu(menu)) {
        if (menu.active) {
          menu.toggle();
        }
      } else {
        if (menu.menuActive) {
          menu.toggleMenu();
        }
      }
    }
  }
  function isTopMenu(menu) {
    return Object.hasOwn(menu, "active");
  }
  unfreezeObjects();
  initTheoryCraft();
  allowWsDataProcessing();
  preventMenuOverlap();
  allowEditingKeybinds();
  addNewMenuButtons();
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