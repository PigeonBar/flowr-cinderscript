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
    Rarity2[Rarity2["VANGUARD"] = 35] = "VANGUARD";
    Rarity2[Rarity2["LUMINOUS"] = 36] = "LUMINOUS";
    Rarity2[Rarity2["FRACTURED"] = 37] = "FRACTURED";
    Rarity2[Rarity2["ELOQUENT"] = 38] = "ELOQUENT";
    Rarity2[Rarity2["TESSELATED"] = 39] = "TESSELATED";
    Rarity2[Rarity2["VANQUISHED"] = 40] = "VANQUISHED";
    Rarity2[Rarity2["COALESCENT"] = 41] = "COALESCENT";
    Rarity2[Rarity2["SPECTRAL"] = 42] = "SPECTRAL";
    Rarity2[Rarity2["UNFATHOMABLE"] = 43] = "UNFATHOMABLE";
    Rarity2[Rarity2["PARAMOUNT"] = 44] = "PARAMOUNT";
    Rarity2[Rarity2["EVANESCENT"] = 45] = "EVANESCENT";
    Rarity2[Rarity2["STARFORGED"] = 46] = "STARFORGED";
    Rarity2[Rarity2["TIMELIT"] = 47] = "TIMELIT";
    Rarity2[Rarity2["AEONIC"] = 48] = "AEONIC";
    Rarity2[Rarity2["UNREAL"] = 49] = "UNREAL";
    return Rarity2;
  })(Rarity || {});
  const LIGHT_CINDER_COLOUR = "#ffaf60";
  const CINDER_COLOUR = "#fc9547";
  const CINDER_BORDER_COLOUR = "#cc7b3d";
  const SETTINGS_GREEN = "#3fff3f";
  const TOOLTIP_BLUE = "#7f7fff";
  const TOOLTIP_BORDER_BLUE = "#3f3fff";
  const MAX_PETAL_RARITY = Rarity.CHAOS;
  const SETTINGS_OPTION_HEIGHT = 50;
  const SETTINGS_BUTTON_SIZE = 28;
  const SETTINGS_BUTTON_PADDING = 13;
  const EDIT_ICON_SIZE = 20;
  const TOOLTIP_ICON_SIZE = 20;
  const TOOLTIP_WIDTH_CAP = 400;
  const SCROLLBAR_LENGTH = 200;
  const SETTINGS_SCROLLBAR_MIN_POS = 120;
  const TOOLTIP_TEXT_HEIGHT = 22.5;
  const KEYBIND_DELETED = "<None>";
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
    if (e.code === KEYBIND_DELETED) {
      console.warn(`Keypress code somehow equal to ${KEYBIND_DELETED}!`);
      console.warn(e);
      return false;
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
        renderGame = (dt2) => {
          ws.onmessage = (data2) => {
            queuedMessages.push(data2);
          };
          chatDiv.classList.add("hidden");
          room = screenshotRoom;
          originalRenderGame(dt2);
          ctx.save();
          ctx.lineWidth = 6;
          ctx.font = "900 32px Ubuntu";
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
  let settingsMap;
  function initOptions(options) {
    settingsMap = Object.freeze(options);
  }
  const defaultSettings = Object.freeze({
    petalCraftPreview: true,
    autoCopyCodes: true,
    missileDrawPriority: true,
    invertAttack: false,
    invertDefend: false,
    settingsTooltips: true,
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
        settingsMap.invertAttack.state = value;
      } else if (key === "invertDefend") {
        settingsMap.invertDefend.state = value;
      }
      if (key === "specialDropsQuantity" || key === "specialDropsRarity") {
        settingsMap.specialDropsScale.updateTooltip();
      }
    }
  }
  const settings = new SettingsManager();
  function displayMissilesAboveEnemies() {
    const originalRenderGame = renderGame;
    renderGame = (dt2) => {
      if (!settings.get("missileDrawPriority")) {
        originalRenderGame(dt2);
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
      originalRenderGame(dt2);
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
  const keybinds = [];
  function initKeybindHandling() {
    const originalHandleKey = inputHandler.handleKey;
    inputHandler.handleKey = function(e) {
      originalHandleKey.apply(inputHandler, [e]);
      if (!isInGameInput(e) || e.type !== "keydown") {
        return;
      }
      for (let keybind of keybinds) {
        if (keybind.type === "settings") {
          if (e.code === settings.get(keybind.key)) {
            keybind.fn();
          }
        } else if (keybind.type === "rawValue") {
          if (e.code === keybind.value) {
            keybind.fn();
          }
        }
      }
    };
  }
  function addKeybindInstruction(keybind) {
    keybinds.push(keybind);
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
    addKeybindInstruction(
      { type: "settings", key: "keybindInvertAttack", fn: () => {
        const newInvertAttack = !settings.get("invertAttack");
        settings.set("invertAttack", newInvertAttack);
        chatAnnounce(
          "Invert Attack set to " + (newInvertAttack ? "ON" : "OFF") + "!",
          "#ffbfbf"
          // Pink
        );
        send({ attack: rawAttacking });
      } }
    );
    addKeybindInstruction(
      { type: "settings", key: "keybindInvertDefend", fn: () => {
        const newInvertDefend = !settings.get("invertDefend");
        settings.set("invertDefend", newInvertDefend);
        chatAnnounce(
          "Invert Defend set to " + (newInvertDefend ? "ON" : "OFF") + "!",
          "#bfbfff"
          // Light blue
        );
        send({ defend: rawDefending });
      } }
    );
    const originalEnterGame = enterGame;
    enterGame = function() {
      originalEnterGame();
      send({ attack: false });
      send({ defend: false });
    };
  }
  function modifyBaseFOV() {
    addKeybindInstruction({ type: "rawValue", value: "BracketLeft", fn: () => {
      fov = 1 / settings.get("baseReciprocalOfFOV");
    } });
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
    addKeybindInstruction({ type: "settings", key: "keybindStatsBox", fn: () => {
      showQuickStatsBox = !showQuickStatsBox;
    } });
    const originalRenderGame = renderGame;
    const originalDrawStatsBox = PetalContainer.prototype.drawStatsBox;
    renderGame = (dt2) => {
      if (showQuickStatsBox) {
        PetalContainer.prototype.drawStatsBox = function() {
          if (this.petals[0]?.constructor === Petal) {
            originalDrawStatsBox.apply(this);
          }
        };
      }
      originalRenderGame(dt2);
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
  class TooltipBox {
    w;
    h;
    text;
    /**
     * The alpha-value (i.e., opacity) of the drawn tooltip box.
     */
    alpha;
    /**
     * The full text for this tooltip is split into an array of lines, and each
     * line is split further into an array of words/tokens.
     */
    lines;
    constructor(text) {
      this.w = 20;
      this.h = 20 - (TOOLTIP_TEXT_HEIGHT - 15);
      this.alpha = 0;
      this.lines = [];
      this.text = text;
      this.generateDesc();
    }
    /**
     * Draws this tooltip at the given location.
     * @param x The horizontal position for the *middle* of this tooltip box.
     * @param y The vertical position for the *top* of this tooltip box.
     * @param isHovered Whether or not the mouse is hovering over this setting's
     * tooltip icon.
     */
    draw(x, y, isHovered) {
      if (!isHovered && this.alpha < 0.1) {
        return;
      }
      if (isHovered) {
        this.alpha += dt / 150;
        if (this.alpha > 1) {
          this.alpha = 1;
        }
      } else {
        this.alpha -= dt / 150;
        if (this.alpha < 0) {
          this.alpha = 0;
        }
      }
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.globalAlpha *= 0.8;
      ctx.fillStyle = TOOLTIP_BLUE;
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.rect(x - this.w / 2, y, this.w, this.h);
      ctx.fill();
      ctx.closePath();
      ctx.globalAlpha /= 0.8;
      ctx.font = "900 15px Ubuntu";
      ctx.lineWidth = 2;
      ctx.strokeStyle = "black";
      ctx.fillStyle = "white";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      let currentHeight = y + 10;
      for (let line of this.lines) {
        let currentX = x - this.w / 2 + 10;
        for (let token of line) {
          if (token[0] === "$") {
            if (token[1] === "c") {
              ctx.fillStyle = token.substring(2).trim();
            }
          } else {
            ctx.strokeText(token, currentX, currentHeight);
            ctx.fillText(token, currentX, currentHeight);
            currentX += ctx.measureText(token).width;
          }
        }
        currentHeight += TOOLTIP_TEXT_HEIGHT;
      }
      ctx.restore();
    }
    /**
     * Regenerates this tooltip's entire description. Also updates this box's
     * dimensions based on the dimensions of the text.
     */
    generateDesc() {
      this.w = 20;
      this.h = 20 - (TOOLTIP_TEXT_HEIGHT - 15);
      this.alpha = 0;
      ctx.font = "900 15px Ubuntu";
      const text = typeof this.text === "string" ? this.text : this.text();
      const splitText = text.split(" ").map((token) => token + " ");
      this.lines = [];
      let currentLine = [];
      let currentWidth = 0;
      const addLine = () => {
        this.lines.push(currentLine);
        this.w = Math.max(this.w, currentWidth + 20);
        this.h += TOOLTIP_TEXT_HEIGHT;
        currentLine = [];
        currentWidth = 0;
      };
      for (let i = 0; i < splitText.length; i++) {
        const newText = splitText[i];
        if (newText.trim() === "$n") {
          addLine();
          continue;
        }
        const newWidth = newText[0] === "$" ? 0 : ctx.measureText(newText).width;
        if (currentWidth + newWidth > TOOLTIP_WIDTH_CAP) {
          addLine();
        }
        currentLine.push(newText);
        currentWidth += newWidth;
      }
      addLine();
    }
  }
  const editIcon = new Image();
  editIcon.src = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB3aWR0aD0iMTAwLjAwMDA1bW0iCiAgIGhlaWdodD0iMTAwLjAwMDA2bW0iCiAgIHZpZXdCb3g9IjAgMCAxMDAuMDAwMDUgMTAwLjAwMDA2IgogICB2ZXJzaW9uPSIxLjEiCiAgIGlkPSJzdmcxIgogICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxkZWZzCiAgICAgaWQ9ImRlZnMxIiAvPgogIDxnCiAgICAgaWQ9ImxheWVyMSIKICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtODkuNTI0OTc3LC0zNS42MzI2MDUpIj4KICAgIDxyZWN0CiAgICAgICBzdHlsZT0iZmlsbDojZmZmZmZmO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTojZmZmZmZmO3N0cm9rZS13aWR0aDowLjI4MjEzNztzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSIKICAgICAgIGlkPSJyZWN0MS04IgogICAgICAgd2lkdGg9IjMxLjEyMTQyOSIKICAgICAgIGhlaWdodD0iMTguNTYwMDA3IgogICAgICAgeD0iLTE3NC43NzIyMyIKICAgICAgIHk9Ijc0LjQxNzAyMyIKICAgICAgIHRyYW5zZm9ybT0ibWF0cml4KC0wLjcwNzEwMDA4LC0wLjcwNzExMzQ5LDAuNzA3MTAwMDgsLTAuNzA3MTEzNDksMCwwKSIgLz4KICAgIDxyZWN0CiAgICAgICBzdHlsZT0iZmlsbDojZmZmZmZmO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTojZmZmZmZmO3N0cm9rZS13aWR0aDowLjUxNDk0NTtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSIKICAgICAgIGlkPSJyZWN0MS04LTEiCiAgICAgICB3aWR0aD0iMzAuODg4NjI4IgogICAgICAgaGVpZ2h0PSI2Mi4yOTIxOTQiCiAgICAgICB4PSItMTc0LjY1NTg3IgogICAgICAgeT0iNS40NDUxNTA0IgogICAgICAgdHJhbnNmb3JtPSJtYXRyaXgoLTAuNzA3MTAwMDgsLTAuNzA3MTEzNDksMC43MDcxMDAwOCwtMC43MDcxMTM0OSwwLDApIiAvPgogICAgPHBhdGgKICAgICAgIHN0eWxlPSJmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOiNmZmZmZmY7c3Ryb2tlLXdpZHRoOjAuMDE7c3Ryb2tlLWxpbmVjYXA6c3F1YXJlO3N0cm9rZS1taXRlcmxpbWl0OjA7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjE7cGFpbnQtb3JkZXI6bWFya2VycyBzdHJva2UgZmlsbCIKICAgICAgIGlkPSJwYXRoNCIKICAgICAgIGQ9Im0gNzQuMzU4OTk5LDEzMy44ODE1OSAtMS4yNzY3NzUsMCAwLjYzODM4OCwtMS4xMDU3MiB6IgogICAgICAgdHJhbnNmb3JtPSJtYXRyaXgoLTE3LjI0NDI0MiwtMTcuMjQ0NTcsMTkuODY3Mjg2LC0xOS44Njc2NjMsLTEyNzYuOTkwOCw0MDQ0LjczNDgpIiAvPgogIDwvZz4KPC9zdmc+Cg==";
  class SettingsOption {
    name;
    state;
    changeTime;
    screenPosition;
    _tooltipBox;
    /**
     * A legacy field that is used for the settings menu to handle
     * {@linkcode BooleanOption BooleanOptions}.
     */
    toggleFn;
    constructor(name, tooltip) {
      this.name = name;
      if (!isNil(tooltip)) {
        this._tooltipBox = new TooltipBox(tooltip);
      }
      this.changeTime = 0;
      this.screenPosition = { x: 0, y: 0, w: 0, h: 0 };
      this.state = void 0;
      this.toggleFn = () => {
      };
    }
    get tooltipBox() {
      return settings.get("settingsTooltips") ? this._tooltipBox : void 0;
    }
    /**
     * The position of the centre of the ? tooltip icon for this option.
     */
    get tooltipPos() {
      ctx.font = "900 17px Ubuntu";
      return {
        x: this.screenPosition.x + SETTINGS_BUTTON_SIZE + SETTINGS_BUTTON_PADDING * 2 + ctx.measureText(this.name).width + TOOLTIP_ICON_SIZE / 2,
        y: this.screenPosition.y + SETTINGS_BUTTON_SIZE / 2
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
    /**
     * Draws this option's tooltip icon.
     */
    drawTooltipIcon() {
      if (!isNil(this.tooltipBox)) {
        drawTooltipIcon(this.tooltipPos);
      }
    }
    /**
     * Draws this option's tooltip box.
     */
    drawTooltipBox(e) {
      if (!isNil(this.tooltipBox)) {
        drawTooltipBox(this.tooltipPos, this.tooltipBox, e);
      }
    }
    /**
     * Updates the text for this setting's tooltip.
     */
    updateTooltip() {
      this._tooltipBox?.generateDesc();
    }
  }
  class BooleanOption extends SettingsOption {
    state;
    constructor(name, settingsKey, tooltip) {
      super(name, tooltip);
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
    constructor(name, tooltip) {
      super(name + ": ", tooltip);
    }
    get tooltipPos() {
      let { x, y } = super.tooltipPos;
      for (let text of this.getDisplayedValues()) {
        x += ctx.measureText(text).width;
      }
      return { x, y };
    }
    /**
     * Returns this setting's name without any ": " formatting.
     */
    get simpleName() {
      return this.name.replaceAll(": ", "");
    }
    isDisplayValueOption() {
      return true;
    }
    /**
     * Processes `originalColour` to make it flash white if the user has edited
     * this setting within the past 1.5s.
     */
    getFlashColour(originalColour) {
      if (this.changeTime > 0 && time - this.changeTime < 1500) {
        const ratio = (time - this.changeTime) / 1500;
        return blendColor("#ffffff", originalColour, ratio);
      } else {
        return originalColour;
      }
    }
    /**
     * Determines the colours that the values should be displayed in.
     */
    getValueFillStyles() {
      return [this.getFlashColour(SETTINGS_GREEN)];
    }
    /**
     * Determines the displayed values, with formatting if necessary.
     */
    getDisplayedValues() {
      return ["" + this.state];
    }
    /**
     * Draws this option inside the given settings menu.
     * 
     * This code is largely adapted from Flowr's base code.
     */
    draw(menu) {
      this.screenPosition = {
        x: 15 + menu.x,
        y: menu.midHeight - SETTINGS_BUTTON_SIZE / 2 + menu.y,
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
        menu.midHeight - EDIT_ICON_SIZE / 2,
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
        this.name,
        15 + SETTINGS_BUTTON_SIZE + SETTINGS_BUTTON_PADDING,
        menu.midHeight
      );
      ctx.fillText(
        this.name,
        15 + SETTINGS_BUTTON_SIZE + SETTINGS_BUTTON_PADDING,
        menu.midHeight
      );
      const prevTextWidth = ctx.measureText(this.name).width;
      let currentX = 15 + SETTINGS_BUTTON_SIZE + SETTINGS_BUTTON_PADDING + prevTextWidth;
      for (let i = 0; i < this.getDisplayedValues().length; i++) {
        const text = this.getDisplayedValues()[i];
        ctx.fillStyle = this.getValueFillStyles()[i];
        ctx.strokeText(text, currentX, menu.midHeight);
        ctx.fillText(text, currentX, menu.midHeight);
        currentX += ctx.measureText(text).width;
      }
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
    constructor(name, settingsKey, minValue, maxValue, decimalDigits, tooltip) {
      super(name, tooltip);
      this.minValue = minValue;
      this.maxValue = maxValue;
      this.decimalDigits = decimalDigits;
      this.state = settings.get(settingsKey);
      this.settingsKey = settingsKey;
    }
    onClick() {
      const rawValue = parseFloat(prompt(
        `You are editing the setting "${this.simpleName}".

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
    constructor(name, settingsKey, tooltip) {
      super(name, tooltip);
      this.state = settings.get(settingsKey);
      this.settingsKey = settingsKey;
    }
    isRarityOption() {
      return true;
    }
    getValueFillStyles() {
      return [this.getFlashColour(Colors.rarities[this.state].color)];
    }
    getDisplayedValues() {
      return [Colors.rarities[this.state].name];
    }
    onClick() {
      const response = prompt(
        `You are editing the setting "${this.simpleName}".

Please enter a Rarity.`
      ) ?? "";
      const rarity = rarityToIndex(response);
      if (!isNil(rarity)) {
        this.changeTime = performance.now();
        this.state = rarity;
        settings.set(this.settingsKey, rarity);
      } else {
        alert(
          `Error: "${response}" is not a valid Rarity!`
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
    constructor(name, settingsKey, tooltip) {
      super(name, tooltip);
      this.state = settings.get(settingsKey);
      this.settingsKey = settingsKey;
      this.editingState = false;
    }
    getDisplayedValues() {
      if (this.editingState) {
        return [this.state, " (Editing...)"];
      } else {
        return [this.state];
      }
    }
    getValueFillStyles() {
      const colour1 = this.getFlashColour(
        this.state === KEYBIND_DELETED ? "#afafaf" : SETTINGS_GREEN
      );
      if (this.editingState) {
        return [colour1, CINDER_COLOUR];
      } else {
        return [colour1];
      }
    }
    onClick(menu) {
      if (!this.editingState) {
        menu.setCurrentKeybindOption(this);
        this.editingState = true;
        this.editingStateTimeout = setTimeout(() => {
          menu.cancelKeybind();
        }, 3e3);
      } else {
        menu.cancelKeybind();
      }
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
    tooltipPos;
    _tooltipBox;
    constructor(text, tooltip) {
      this.text = text;
      if (!isNil(tooltip)) {
        this._tooltipBox = new TooltipBox(tooltip);
      }
      this.tooltipPos = { x: 0, y: 0 };
    }
    get tooltipBox() {
      return settings.get("settingsTooltips") ? this._tooltipBox : void 0;
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
      const textWidth = ctx.measureText(this.text).width;
      let textLeftPos = menu.w / 2 - textWidth / 2;
      let textRightPos = menu.w / 2 + textWidth / 2;
      if (!isNil(this.tooltipBox)) {
        const extraSpace = TOOLTIP_ICON_SIZE + SETTINGS_BUTTON_PADDING;
        textLeftPos -= extraSpace / 2;
        textRightPos += extraSpace / 2;
        this.tooltipPos = {
          x: menu.x + textRightPos - TOOLTIP_ICON_SIZE / 2,
          y: menu.y + menu.midHeight
        };
      }
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.strokeText(this.text, textLeftPos, menu.midHeight);
      ctx.fillText(this.text, textLeftPos, menu.midHeight);
      ctx.strokeStyle = "#7f7f7f";
      ctx.lineWidth = 8;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(SETTINGS_BUTTON_PADDING, menu.midHeight);
      ctx.lineTo(textLeftPos - SETTINGS_BUTTON_PADDING, menu.midHeight);
      ctx.stroke();
      ctx.closePath();
      ctx.beginPath();
      ctx.moveTo(textRightPos + SETTINGS_BUTTON_PADDING, menu.midHeight);
      ctx.lineTo(menu.w - SETTINGS_BUTTON_PADDING - 16, menu.midHeight);
      ctx.stroke();
      ctx.closePath();
      menu.currentHeight += SETTINGS_OPTION_HEIGHT;
    }
    /**
     * Draws this section's tooltip icon.
     */
    drawTooltipIcon() {
      if (!isNil(this.tooltipBox)) {
        drawTooltipIcon(this.tooltipPos);
      }
    }
    /**
     * Draws this section's tooltip box.
     */
    drawTooltipBox(e) {
      if (!isNil(this.tooltipBox)) {
        drawTooltipBox(this.tooltipPos, this.tooltipBox, e);
      }
    }
  }
  function drawTooltipIcon(pos) {
    const { x, y } = pos;
    ctx.strokeStyle = TOOLTIP_BORDER_BLUE;
    ctx.fillStyle = TOOLTIP_BLUE;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(x, y, TOOLTIP_ICON_SIZE / 2, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
    ctx.font = "900 17px Ubuntu";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.strokeText("?", x, y + 1);
    ctx.fillText("?", x, y + 1);
  }
  function drawTooltipBox(pos, tooltipBox, e) {
    const { x, y } = pos;
    const isHovered = mouseInBox(
      e,
      // We intentionally make the tooltip icon's "hitbox" larger
      {
        x: x - SETTINGS_BUTTON_SIZE / 2,
        y: y - SETTINGS_BUTTON_SIZE / 2,
        w: SETTINGS_BUTTON_SIZE,
        h: SETTINGS_BUTTON_SIZE
      }
    );
    tooltipBox.draw(x, y + TOOLTIP_ICON_SIZE / 2 + 10, isHovered);
  }
  class CinderSettingsMenu extends SettingsMenu {
    /**
     * The {@linkcode KeybindOption} currently being edited, if applicable.
     */
    currentKeybindOption;
    _scroll;
    /**
     * The vertical offset of the mouse from the scrollbar's centre if the user
     * is currently dragging the scrollbar, or `undefined` if the user is not
     * dragging the scrollbar.
     */
    draggingScrollbarOffset;
    /**
     * The total height of this menu's contents, equal to
     * {@linkcode SETTINGS_OPTION_HEIGHT} times `this.options.length`.
     */
    totalHeight;
    constructor() {
      super();
      this._scroll = 0;
      this.draggingScrollbarOffset = void 0;
      initOptions({
        "invertAttack": new BooleanOption("Invert Attack", "invertAttack"),
        "invertDefend": new BooleanOption("Invert Defend", "invertDefend"),
        "autoCopyCodes": new BooleanOption(
          "Auto Copy Squad Codes",
          "autoCopyCodes",
          "If this is turned on and you generate a random squad code, it automatically copies the squad code to your clipboard."
        ),
        "settingsTooltips": new BooleanOption(
          "Settings Tooltips",
          "settingsTooltips"
        ),
        "petalCraftPreview": new BooleanOption(
          "Petal Craft Preview",
          "petalCraftPreview"
        ),
        "missileDrawPriority": new BooleanOption(
          "Missile Rendering Priority",
          "missileDrawPriority",
          "If turned on, all enemy missiles will be rendered above all actual enemies."
        ),
        "baseReciprocalOfFOV": new NumberOption(
          "Base Zoom Out",
          "baseReciprocalOfFOV",
          0.33,
          5,
          2
        ),
        "playerHpBarScale": new NumberOption(
          "Player HP Bar Scale",
          "playerHpBarScale",
          0.5,
          5,
          2
        ),
        "specialDropsScale": new NumberOption(
          "Special Drops Scale",
          "specialDropsScale",
          1,
          5,
          2,
          () => `For this setting, a drop is considered 'Special' if it is worth at least $c${SETTINGS_GREEN} ${settings.get("specialDropsQuantity")} $c${Colors.rarities[settings.get("specialDropsRarity")].color} ${Colors.rarities[settings.get("specialDropsRarity")].name} $cwhite ${settings.get("specialDropsQuantity") === 1 ? "petal" : "petals"}, as configured below.`
        ),
        "specialDropsRarity": new RarityOption(
          "Special Drops Threshold Rarity",
          "specialDropsRarity"
        ),
        "specialDropsQuantity": new NumberOption(
          "Special Drops Threshold Amount",
          "specialDropsQuantity",
          0.1,
          999,
          1
        ),
        "keybindInvertAttack": new KeybindOption(
          "Invert Attack",
          "keybindInvertAttack"
        ),
        "keybindInvertDefend": new KeybindOption(
          "Invert Defend",
          "keybindInvertDefend"
        ),
        "keybindStatsBox": new KeybindOption(
          "Quick Stats Box",
          "keybindStatsBox",
          "This hotkey toggles the stats box of the highest-rarity mob currently alive in your room."
        )
      });
      this.h = 11.7 * SETTINGS_OPTION_HEIGHT;
      this.w = 480;
      this.options = Object.freeze([
        new SettingsSectionHeading("General Gameplay"),
        settingsMap.invertAttack,
        settingsMap.invertDefend,
        settingsMap.autoCopyCodes,
        new SettingsSectionHeading("General Display"),
        settingsMap.settingsTooltips,
        settingsMap.petalCraftPreview,
        settingsMap.missileDrawPriority,
        new SettingsSectionHeading("Zoom Settings"),
        settingsMap.baseReciprocalOfFOV,
        settingsMap.playerHpBarScale,
        settingsMap.specialDropsScale,
        settingsMap.specialDropsRarity,
        settingsMap.specialDropsQuantity,
        new SettingsSectionHeading(
          "Keybinds",
          "To edit a keybind, click its 'Edit' button and then enter a new key to bind it to. You can also delete a keybind by pressing the 'Delete' key on your keyboard. $n $n Caution: If you set multiple keybinds to the same key, all of your keybinds will still remain active!"
        ),
        settingsMap.keybindInvertAttack,
        settingsMap.keybindInvertDefend,
        settingsMap.keybindStatsBox
      ]);
      this.totalHeight = SETTINGS_OPTION_HEIGHT * this.options.length;
      const originalOnMouseDown = _unsafeWindow.onmousedown;
      _unsafeWindow.onmousedown = (e) => {
        originalOnMouseDown?.apply(_unsafeWindow, [e]);
        if (_unsafeWindow.connected === true) {
          this.mouseDown({ x: mouse.canvasX, y: mouse.canvasY });
        }
      };
      const originalOnMouseUp = _unsafeWindow.onmouseup;
      _unsafeWindow.onmouseup = (e) => {
        originalOnMouseUp?.apply(_unsafeWindow, [e]);
        if (_unsafeWindow.connected === true) {
          this.mouseUp();
        }
      };
      const originalDraw = settingsMenu.draw;
      settingsMenu.draw = function() {
        originalDraw.apply(this);
        cinderSettingsMenu.draw();
      };
      document.addEventListener("wheel", (e) => {
        this.updateScroll(e);
      });
    }
    /**
     * The y-position at the midpoint of the option currently being rendered.
     */
    get midHeight() {
      return this.currentHeight + SETTINGS_OPTION_HEIGHT / 2;
    }
    /**
     * How much the menu's contents are currently shifted due to scrolling. This
     * is directly controlled by user inputs.
     * 
     * I originally planned to have a separate "renderScroll" value that
     * interpolates towards this value, just like most other Flowr UI elements,
     * but I scrapped it because it was causing too much spaghetti code for
     * little benefit.
     */
    get scroll() {
      return this._scroll;
    }
    set scroll(val) {
      this._scroll = Math.min(Math.max(val, 0), this.totalHeight + 10 - this.h);
    }
    /**
     * The ratio of scrollbar movement to actual content movement.
     */
    get scrollbarRatio() {
      return (this.h - 2 * SETTINGS_SCROLLBAR_MIN_POS) / (this.totalHeight + 10 - this.h);
    }
    /**
     * The vertical position of the centre of this menu's scrollbar.
     */
    get scrollbarPos() {
      return this.scroll * this.scrollbarRatio + SETTINGS_SCROLLBAR_MIN_POS;
    }
    set scrollbarPos(pos) {
      if (!isNil(this.draggingScrollbarOffset)) {
        this.scroll = (pos - SETTINGS_SCROLLBAR_MIN_POS - this.y - this.offset) / this.scrollbarRatio;
      }
    }
    // TODO: Make the scroll translation code less spaghetti
    draw() {
      this.offset = interpolate(this.offset, this.targetOffset, 0.3);
      if (!isNil(this.draggingScrollbarOffset)) {
        this.scrollbarPos = mouse.canvasY - this.draggingScrollbarOffset;
      }
      ctx.save();
      ctx.translate(this.x, this.y + this.offset);
      ctx.beginPath();
      ctx.roundRect(0, 0, this.w, this.h, 3);
      ctx.clip();
      ctx.closePath();
      ctx.fillStyle = "#aaaaaa";
      ctx.beginPath();
      ctx.roundRect(0, 0, this.w, this.h, 3);
      ctx.fill();
      ctx.closePath();
      ctx.strokeStyle = "#7f7f7f";
      ctx.lineWidth = 8;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(this.w - 16, this.scrollbarPos - SCROLLBAR_LENGTH / 2);
      ctx.lineTo(this.w - 16, this.scrollbarPos + SCROLLBAR_LENGTH / 2);
      ctx.stroke();
      ctx.closePath();
      if (this.active && (this.mouseOnScrollbar() || !isNil(this.draggingScrollbarOffset))) {
        setCursor("pointer");
      }
      ctx.beginPath();
      ctx.roundRect(0, 0, this.w, this.h, 3);
      ctx.clip();
      ctx.closePath();
      ctx.translate(0, -this.scroll);
      const e = { x: mouse.canvasX, y: mouse.canvasY + this.scroll };
      if (!this.active || !this.mouseInMenu()) {
        e.x = e.y = -Infinity;
      }
      this.currentHeight = 5;
      for (let option of this.options) {
        this.renderOption(option);
      }
      ctx.translate(-this.x, -this.y);
      for (let option of this.options) {
        option.drawTooltipIcon();
      }
      if (this.active && this.mouseInMenu()) {
        for (let option of this.options) {
          if (!option.isSectionHeading()) {
            if (option.mouseInButton(e)) {
              setCursor("pointer");
            }
          }
        }
      }
      ctx.restore();
      ctx.strokeStyle = "#8a8a8a";
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.roundRect(
        this.x,
        this.y + this.offset,
        this.w,
        this.h,
        3
      );
      ctx.stroke();
      ctx.closePath();
      ctx.translate(0, -this.scroll);
      for (let option of this.options) {
        option.drawTooltipBox(e);
      }
      ctx.translate(0, this.scroll);
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
      if (!this.mouseInMenu()) {
        return;
      }
      if (this.mouseOnScrollbar()) {
        this.draggingScrollbarOffset = mouse.canvasY - (this.y + this.offset + this.scrollbarPos);
      }
      e.y += this.scroll;
      for (let option of this.options) {
        if (!option.isSectionHeading()) {
          if (option.mouseInButton(e)) {
            if (option.isBooleanOption()) {
              this.processToggle(option, e);
            } else if (option.isDisplayValueOption()) {
              option.onClick(this);
            }
          }
        }
      }
    }
    /**
     * Precesses the user releasing a mouse click.
     */
    mouseUp() {
      this.draggingScrollbarOffset = void 0;
    }
    /**
     * Scrolls this menu up/down in response to a mouse wheel input.
     */
    updateScroll(e) {
      if (this.active && this.mouseInMenu()) {
        this.scroll += e.deltaY / 2;
      }
    }
    toggle() {
      super.toggle();
      if (!this.active) {
        this.cancelKeybind();
        this.mouseUp();
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
    /**
     * Cancels editing the current keybind option.
     */
    cancelKeybind() {
      this.setCurrentKeybindOption(void 0);
    }
    /**
     * Checks whether the mouse is inside this menu, excluding its borders.
     */
    mouseInMenu() {
      return mouseInBox(
        { x: mouse.canvasX, y: mouse.canvasY },
        { x: this.x + 4, y: this.y + 4, w: this.w - 8, h: this.h - 8 }
      );
    }
    /**
     * Checks whether the mouse is hovering over this menu's scrollbar.
     */
    mouseOnScrollbar() {
      return mouseInBox(
        { x: mouse.canvasX, y: mouse.canvasY },
        {
          x: this.x + this.w - 24,
          y: this.y + this.offset + this.scrollbarPos - SCROLLBAR_LENGTH / 2,
          w: 16,
          h: SCROLLBAR_LENGTH
        }
      );
    }
  }
  const cinderSettingsMenu = new CinderSettingsMenu();
  function allowEditingKeybinds() {
    const originalHandleKey = inputHandler.handleKey;
    inputHandler.handleKey = function(e) {
      if (_unsafeWindow.state === "menu" && e.type === "keydown" && !e.repeat && !isNil(cinderSettingsMenu.currentKeybindOption)) {
        if (e.code === "Delete") {
          cinderSettingsMenu.currentKeybindOption.finishEdit(KEYBIND_DELETED);
        } else {
          cinderSettingsMenu.currentKeybindOption.finishEdit(e.code);
        }
        cinderSettingsMenu.cancelKeybind();
        return;
      }
      originalHandleKey.apply(inputHandler, [e]);
    };
  }
  const cinderChangelogList = [
    {
      text: `Cinderscript's official release! Here are its initial features:
- Invert Attack/Defend hotkeys (Default: Comma/Period) (PR #10)
- Hotkey to display stats box of the highest-rarity mob alive in your room (Default: "G") (PR #9)
- Fix a client freeze bug from displaying mobs with negative size (PR #8)
- The player's HP bar and high-rarity petal drops are now rendered larger (PR #7)
- When entering a new game, the game is now zoomed out by default (PR #5)
- Enemy missiles will no longer be hidden below enemy mobs (PR #4)
- Players can generate a random squad code by entering an empty private code (PR #3)
- Petal craft preview added to the crafting menu (PR #1)
- These features are configurable in the settings menu!`,
      date: "Version 1.0.0"
    }
  ];
  class CinderChangelog extends Changelog {
    /**
     * Whether or not this changelog has generated its entries.
     */
    generatedEntries;
    constructor() {
      super();
      this.generatedEntries = false;
      const originalOnMouseDown = _unsafeWindow.onmousedown;
      _unsafeWindow.onmousedown = (e) => {
        originalOnMouseDown?.apply(_unsafeWindow, [e]);
        if (_unsafeWindow.connected === true && this.active) {
          this.mouseDown({ mouseX: mouse.canvasX, mouseY: mouse.canvasY });
        }
      };
      const originalOnMouseUp = _unsafeWindow.onmouseup;
      _unsafeWindow.onmouseup = (e) => {
        originalOnMouseUp?.apply(_unsafeWindow, [e]);
        if (_unsafeWindow.connected === true) {
          this.mouseUp({ mouseX: mouse.canvasX, mouseY: mouse.canvasY });
        }
      };
      const originalHandleMouse = inputHandler.handleMouse;
      inputHandler.handleMouse = (e) => {
        originalHandleMouse.apply(inputHandler, [e]);
        this.mouseMove({ mouseX: mouse.canvasX, mouseY: mouse.canvasY });
      };
      document.addEventListener("wheel", (e) => {
        this.updateScroll(
          { x: e.deltaX, y: e.deltaY },
          { mouseX: mouse.canvasX, mouseY: mouse.canvasY }
        );
      });
      const originalDraw = changelog.draw;
      changelog.draw = () => {
        originalDraw.apply(changelog);
        this.draw();
      };
    }
    toggle() {
      super.toggle();
      if (!this.active) {
        this.mouseUp({ mouseX: mouse.canvasX, mouseY: mouse.canvasY });
      }
    }
    draw() {
      super.draw();
      ctx.translate(this.x, this.y + this.offset);
      ctx.fillStyle = "#9bb56b";
      ctx.beginPath();
      ctx.roundRect(5, 5, this.w - 50, 75);
      ctx.fill();
      ctx.closePath();
      ctx.font = "900 30px Ubuntu";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 4;
      ctx.strokeText("Cinderscript Changelog", this.w / 2, 40);
      ctx.fillText("Cinderscript Changelog", this.w / 2, 40);
      ctx.translate(-this.x, -this.y - this.offset);
    }
    mouseDown(e) {
      super.mouseDown(e);
      if (this.hoveringOverX) {
        this.toggle();
      }
    }
    /**
     * Generates this changelog's entries if they are not already generated.
     * 
     * To try to maximize modularity/compatibility, we reuse the superclass's
     * `generateEntries` function. That function is hardcoded to retrieve entries
     * from {@linkcode changeloglist}, so we need to temporarily overwrite
     * `changeloglist`. This is a bit inefficient, but fortunately, we only need
     * to do this once per page load.
     */
    generateEntries() {
      if (this.generatedEntries) {
        return;
      }
      this.generatedEntries = true;
      const vanillaChangelogList = [...changeloglist];
      changeloglist.splice(0, changeloglist.length);
      changeloglist.push(...cinderChangelogList);
      super.generateEntries();
      changeloglist.splice(0, changeloglist.length);
      changeloglist.push(...vanillaChangelogList);
    }
  }
  const cinderChangelog = new CinderChangelog();
  function addNewMenuButtons() {
    const menuSeparatorLine = document.createElement("div");
    menuSeparatorLine.id = "menuSeparatorLine";
    const buttonList = changelogButton.parentElement;
    buttonList?.appendChild(menuSeparatorLine);
    const settingsImage = new Image(35, 35);
    settingsImage.src = `gfx/gear.png?v=${ver}`;
    settingsImage.draggable = false;
    const cinderSettingsButton = document.createElement("div");
    cinderSettingsButton.className = "cinderMenuButton";
    cinderSettingsButton.appendChild(settingsImage);
    cinderSettingsButton.onclick = () => {
      cinderSettingsMenu.toggle();
    };
    buttonList?.appendChild(cinderSettingsButton);
    const githubIcon = new Image(35, 35);
    githubIcon.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik01Ni43OTM3IDg0Ljk2ODhDNDQuNDE4NyA4My40Njg4IDM1LjcgNzQuNTYyNSAzNS43IDYzLjAzMTNDMzUuNyA1OC4zNDM4IDM3LjM4NzUgNTMuMjgxMyA0MC4yIDQ5LjkwNjNDMzguOTgxMiA0Ni44MTI1IDM5LjE2ODcgNDAuMjUgNDAuNTc1IDM3LjUzMTNDNDQuMzI1IDM3LjA2MjUgNDkuMzg3NSAzOS4wMzEzIDUyLjM4NzUgNDEuNzVDNTUuOTUgNDAuNjI1IDU5LjcgNDAuMDYyNSA2NC4yOTM3IDQwLjA2MjVDNjguODg3NSA0MC4wNjI1IDcyLjYzNzUgNDAuNjI1IDc2LjAxMjUgNDEuNjU2M0M3OC45MTg3IDM5LjAzMTMgODQuMDc1IDM3LjA2MjUgODcuODI1IDM3LjUzMTNDODkuMTM3NSA0MC4wNjI1IDg5LjMyNSA0Ni42MjUgODguMTA2MiA0OS44MTI1QzkxLjEwNjIgNTMuMzc1IDkyLjcgNTguMTU2MyA5Mi43IDYzLjAzMTNDOTIuNyA3NC41NjI1IDgzLjk4MTIgODMuMjgxMyA3MS40MTg3IDg0Ljg3NUM3NC42MDYyIDg2LjkzNzUgNzYuNzYyNSA5MS40Mzc1IDc2Ljc2MjUgOTYuNTkzOEw3Ni43NjI1IDEwNi4zNDRDNzYuNzYyNSAxMDkuMTU2IDc5LjEwNjIgMTEwLjc1IDgxLjkxODcgMTA5LjYyNUM5OC44ODc1IDEwMy4xNTYgMTEyLjIgODYuMTg3NSAxMTIuMiA2NS4xODc1QzExMi4yIDM4LjY1NjMgOTAuNjM3NSAxNyA2NC4xMDYyIDE3QzM3LjU3NSAxNyAxNi4yIDM4LjY1NjIgMTYuMiA2NS4xODc1QzE2LjIgODYgMjkuNDE4NyAxMDMuMjUgNDcuMjMxMiAxMDkuNzE5QzQ5Ljc2MjUgMTEwLjY1NiA1Mi4yIDEwOC45NjkgNTIuMiAxMDYuNDM4TDUyLjIgOTguOTM3NUM1MC44ODc1IDk5LjUgNDkuMiA5OS44NzUgNDcuNyA5OS44NzVDNDEuNTEyNSA5OS44NzUgMzcuODU2MiA5Ni41IDM1LjIzMTIgOTAuMjE4OEMzNC4yIDg3LjY4NzUgMzMuMDc1IDg2LjE4NzUgMzAuOTE4NyA4NS45MDYzQzI5Ljc5MzcgODUuODEyNSAyOS40MTg3IDg1LjM0MzggMjkuNDE4NyA4NC43ODEzQzI5LjQxODcgODMuNjU2MyAzMS4yOTM3IDgyLjgxMjUgMzMuMTY4NyA4Mi44MTI1QzM1Ljg4NzUgODIuODEyNSAzOC4yMzEyIDg0LjUgNDAuNjY4NyA4Ny45Njg4QzQyLjU0MzcgOTAuNjg3NSA0NC41MTI1IDkxLjkwNjMgNDYuODU2MiA5MS45MDYzQzQ5LjIgOTEuOTA2MyA1MC43IDkxLjA2MjUgNTIuODU2MiA4OC45MDYzQzU0LjQ1IDg3LjMxMjUgNTUuNjY4NyA4NS45MDYzIDU2Ljc5MzcgODQuOTY4OFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=";
    githubIcon.id = "githubIcon";
    githubIcon.draggable = false;
    const githubButton = document.createElement("div");
    githubButton.className = "cinderMenuButton";
    const githubLink = document.createElement("a");
    githubLink.href = "https://github.com/PigeonBar/flowr-cinderscript";
    githubLink.target = "_blank";
    githubLink.title = "Check out Cinderscript on GitHub!";
    githubLink.appendChild(githubIcon);
    githubButton.appendChild(githubLink);
    buttonList?.appendChild(githubButton);
    const changelogImage = new Image(24, 24);
    changelogImage.src = `gfx/scroll.png?v=${ver}`;
    changelogImage.draggable = false;
    const cinderChangelogButton = document.createElement("div");
    cinderChangelogButton.className = "cinderMenuButton";
    cinderChangelogButton.appendChild(changelogImage);
    cinderChangelogButton.onclick = () => {
      cinderChangelog.toggle();
    };
    buttonList?.appendChild(cinderChangelogButton);
    const styles = `
    #menuSeparatorLine {
      background-color: ${CINDER_BORDER_COLOUR};
      margin-left: 10px;
      margin-top: 10px;
      width: 41px;
      height: 5px;
      border-radius: 3px;
    }

    #githubIcon {
      margin-top: 3px;
    }

    .cinderMenuButton {
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
    
    .cinderMenuButton:hover {
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
  initKeybindHandling();
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