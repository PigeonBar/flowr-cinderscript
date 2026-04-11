import { unsafeWindow } from "$";
import { TEXT_LIGHT_BLUE, TEXT_LIGHT_RED } from "../constants/constants";
import type { Rarity } from "../enums";
import { settings } from "../settings/settingsManager";
import { isNil } from "../utils";

/**
 * This feature makes the mob gallery track how many times the player has
 * spawned/killed mobs of each type and rarity.
 * 
 * This is stored separately per account and per device.
 */
export function addMobGalleryKillCounter(): void {
  mobGallery.setCountMode = function(value: string) {
    this.countMode = value;

    // Also update the gallery's stats when changing the stat being tracked
    for (let type in this.rows) {
      for (let rarity = 0; rarity < this.rows[type].length; rarity++) {
        this.updateStat(type, rarity);
      }
    }
    cachedImages.statBoxes.enemies = {};
  }

  mobGallery.getStatCounter = function() {
    // Select the mob counter corresponding to the chosen stat to display
    switch (this.countMode.toLowerCase()) {
      case "kills":
        return killCounter;
      case "spawns":
        return spawnCounter;
      case "kills+":
        return killPlusCounter;
      case "spawns+":
        return spawnPlusCounter;
      default:
        return undefined;
    }
  }

  mobGallery.getStatTextColour = function() {
    if (["kills", "kills+"].includes(this.countMode.toLowerCase())) {
      return TEXT_LIGHT_RED;
    } else if (["spawns", "spawns+"].includes(this.countMode.toLowerCase())) {
      return TEXT_LIGHT_BLUE;
    } else {
      return "white";
    }
  }

  mobGallery.updateStat = function(type: EnemyType, rarity: Rarity) {
    // If enemy type is not lootable, return a default stat of 1
    if (isNonLootableEnemyType(type)) {
      return 1;
    }

    // If no stats are currently being tracked, return a default stat of 1
    const stat = this.getStatCounter()?.getStat(type, rarity) ?? 1;

    // Update the gallery entry's amount
    const mobContainer = mobGallery.rows[type]?.[rarity];
    if (typeof mobContainer === "object") {
      mobContainer.amount = stat;
      mobContainer.lastAmountChangedTime = time;
    }
    cachedImages.statBoxes.enemies[`${type}${rarity}`] = undefined;

    return stat;
  }

  // For now, the mob gallery tracks kills
  mobGallery.setCountMode(
    settings.get("mobGalleryKillCounter") ? "Kills" : "None"
  );

  // Track whether each killed mob is a "real kill" by checking whether or not
  // it dropped loot.
  let nextMobDroppedLoot = false;

  const originalAddPetal = processGameMessageMap.newPetalContainer;
  processGameMessageMap.newPetalContainer = function(
    data: any, _me?: any, _advanced?: any,
  ) {
    originalAddPetal(data, _me, _advanced);

    // If the player is just spectating, do not count any stats.
    if (unsafeWindow.spectating) {
      return;
    }

    nextMobDroppedLoot = true;
  }

  const originalRemoveEnemy = processGameMessageMap.removeEnemy;
  processGameMessageMap.removeEnemy = function(
    data: any, _me?: any, _advanced?: any
  ) {
    const enemy = room.enemies[data.removeEnemy];

    originalRemoveEnemy(data, _me, _advanced);

    // If the player is just spectating, do not count any stats.
    if (unsafeWindow.spectating) {
      return;
    }

    if (localStorage.getItem("cinderDevMobCounterWarnings")) {
      let usingHorn = false;
      for (let petal of Object.values(inventory.topPetalContainers)) {
        if (petal?.type === "Horn") {
          usingHorn = true;
        }
      }
      if (nextMobDroppedLoot && enemy.lootMultiplier === 0 && !enemy.isBoss) {
        console.warn("Unexpected loot!", time);
        console.warn(enemy);
      } else if (!nextMobDroppedLoot && enemy.lootMultiplier > 0 && !usingHorn) {
        console.warn("No loot!", time);
        console.warn(enemy);
      }
    }

    if (nextMobDroppedLoot && !enemy.isBoss && enemy.lootMultiplier > 0) {
      // Increment stats
      killCounter.incrementStat(enemy.type, enemy.rarity, 1);
      killPlusCounter.incrementStat(
        enemy.type, enemy.rarity, enemy.lootMultiplier
      );
    }

    nextMobDroppedLoot = false;
  }

  const originalAddEnemy = processGameMessageMap.newEnemy;
  processGameMessageMap.newEnemy = function(
    data: any, _me?: any, _advanced?: any
  ) {
    originalAddEnemy(data, _me, _advanced);

    // If the player is just spectating, do not count any stats.
    if (unsafeWindow.spectating) {
      return;
    }

    // Keep track of each enemy's loot multiplier based on wave luckiness
    const enemy = room.enemies[data.id];
    enemy.lootMultiplier = 1 + (room.shinyWave ?? 0);

    // If the enemy is expected to not drop loot, set the multiplier to 0
    if (expectNoLoot(enemy)) {
      enemy.lootMultiplier = 0;
    }

    if (enemy.lootMultiplier > 0 && !enemy.isBoss) {
      // Increment stats
      spawnCounter.incrementStat(enemy.type, enemy.rarity, 1);
      spawnPlusCounter.incrementStat(
        enemy.type, enemy.rarity, enemy.lootMultiplier
      );
    }
  }

  const originalGenerate = mobGallery.generateEnemyPc;
  mobGallery.generateEnemyPc = function(
    type: EnemyType, rarity: Rarity, dimensions: number
  ) {
    const container = originalGenerate.apply(this, [type, rarity, dimensions]);

    if (!isNonLootableEnemyType(type)) {
      // Initialize the container's stats
      container.amount = mobGallery.updateStat(type, rarity);
    }

    return container;
  }

  // Let gallery entries display their amounts
  const originalDraw = PetalContainer.prototype.draw;
  PetalContainer.prototype.draw = function(inGame?: boolean, number?: number) {
    originalDraw.apply(this, [inGame, number]);

    // Check if this container is a gallery entry
    if (this === mobGallery.rows[this.type]?.[this.rarity]
       && !isNonLootableEnemyType(this.type)
       && !isNil(mobGallery.getStatCounter())
    ) {
      this.drawAmount(mobGallery.getStatTextColour());
    }
  }

  // Let gallery entries' stats boxes display their amounts.
  // This code is adapted from Flowr's base code for displaying amounts on
  // stat boxes for petals.
  const originalGenEcBox = StatsBox.prototype.genEcBox;
  StatsBox.prototype.genEcBox = function() {
    const canvas = originalGenEcBox.apply(this);

    const statsBoxCtx = canvas.getContext("2d");

    if (this.isGallery 
        && !isNonLootableEnemyType(this.name)
        && !isNil(mobGallery.getStatCounter())
        && !isNil(statsBoxCtx)
    ) {
      statsBoxCtx.resetTransform();
      statsBoxCtx.letterSpacing = "0px";

      // Draw the amount counter to the right of the mob's name
      statsBoxCtx.font = `900 ${1.2 * 22.5}px Ubuntu`;
      const x = 10 + 7.5 + statsBoxCtx.measureText(this.name).width;
      const y = 10 + 4 + 4;

      statsBoxCtx.font = `900 ${0.75 * 22.5}px Ubuntu`;
      statsBoxCtx.lineWidth = 0.75 * 3.25;
      statsBoxCtx.fillStyle = mobGallery.getStatTextColour();
      statsBoxCtx.strokeStyle = "black";
      statsBoxCtx.textAlign = "left";
      statsBoxCtx.textBaseline = "top";

      statsBoxCtx.strokeText('x' + this.amount.toLocaleString(), x, y);
      statsBoxCtx.fillText('x' + this.amount.toLocaleString(), x, y);
    }

    return canvas;
  }

  const originalDrawStatsBox = Enemy.prototype.drawStatsBox;
  Enemy.prototype.drawStatsBox = function(
    drawBelow?: boolean, rarityOverride?: boolean
  ) {
    let isGallery = false;
    const galleryEntry = mobGallery.rows[this.type]?.[this.rarity];
    if (typeof galleryEntry === "object" && this === galleryEntry.petals[0]) {
      isGallery = true;
    }	
    
    // If switching from gallery to non-gallery or vice versa, do not use the
    // old cache entry.
    let cache = cachedImages.statBoxes.enemies[`${this.type}${this.rarity}`];
		if (isGallery !== cache?.isGallery) {
			cachedImages.statBoxes.enemies[`${this.type}${this.rarity}`] = undefined;
		}

    originalDrawStatsBox.apply(this, [drawBelow, rarityOverride]);

    // If needed, update the new cache entry to draw the gallery's stat.
    cache = cachedImages.statBoxes.enemies[`${this.type}${this.rarity}`];
    if (isGallery
        && !isNil(cache)
        && !cache.isGallery
        && typeof galleryEntry === "object"
    ) {
      cache.amount = galleryEntry.amount;

      // In case its image has already been generated, regenerate it.
      if (!isNil(cache.image)) {
        cache.image = cache.genEcBox();
      }
    }
    if (!isNil(cache)) {
      cache.isGallery = isGallery;
    }

    return canvas;
  }
}


/**
 * A helper function to detect mob types that can never drop loot and therefore
 * should never be tracked in mob counters. Right now, this list includes:
 * - Missiles/projectiles
 * - Eggs laid by Queen Ants and such
 */
function isNonLootableEnemyType(type: EnemyType): boolean {
  return type.includes("Missile") || type.includes("Egg");
}


/**
 * A helper function to detect mobs that are not expected to drop loot when
 * killed. Right now, this list includes:
 * - Missiles/projectiles
 * - Eggs laid by Queen Ants and such
 * - Non-head leech segments, since the head already drops loot
 * - Minions spawned by bosses
 */
function expectNoLoot(enemy: Enemy): boolean {
  return isNonLootableEnemyType(enemy.type)
    || (enemy.type.includes("Eel") && !enemy.isHead)
    || (enemy.type.includes("Leech") && !enemy.isHead)
    || bosses.length > 0;
}


/**
 * A class for tracking stats by mob type and mob rarity. Stats for different
 * accounts are stored separately.
 */
class MobCounter {
  /**
   * The local storage key to store the tracked stats in.
   */
  storageKey: string;
  
  /**
   * The stats being tracked by this tracker. The format is:
   * `savedStats[playerName][enemyType][enemyRarity]`.
   */
  savedStats: Partial<Record<string,
    Partial<Record<EnemyType,
    Partial<Record<Rarity, number>>
  >>>>;

  /**
   * Constructs a new tracker using stats saved at the given storage key.
   */
  constructor(storageKey: string) {
    this.storageKey = storageKey;
    this.savedStats = JSON.parse(
      localStorage.getItem(storageKey) ?? "{}"
    );
  }

  /**
   * Retrieves the tracked stat for the given mob of the given rarity. If the
   * given mob does not have a tracked stat yet, return `0` instead.
   */
  getStat(type: EnemyType, rarity: Rarity): number {
    return this.savedStats[username]?.[type]?.[rarity] ?? 0;
  }

  /**
   * Increment the tracked stat for the given mob of the given rarity.
   */
  incrementStat(type: EnemyType, rarity: Rarity, amount: number) {
    // Initialize stat to 0 if it does not exist yet
    if (isNil(this.savedStats[username])) {
      this.savedStats[username] = {};
    }
    if (isNil(this.savedStats[username][type])) {
      this.savedStats[username][type] = {};
    }
    if (isNil(this.savedStats[username][type][rarity])) {
      this.savedStats[username][type][rarity] = 0;
    }

    this.savedStats[username][type][rarity] += amount;
    localStorage.setItem(this.storageKey, JSON.stringify(this.savedStats));

    // Immediately update the gallery with the mob's new stat
    if (this === mobGallery.getStatCounter()) {
      mobGallery.updateStat(type, rarity);
    }
  }
}

const killCounter = new MobCounter("cinderKillCounter");

const killPlusCounter = new MobCounter("cinderKillPlusCounter");

const spawnCounter = new MobCounter("cinderSpawnCounter");

const spawnPlusCounter = new MobCounter("cinderSpawnPlusCounter");

export type { MobCounter };