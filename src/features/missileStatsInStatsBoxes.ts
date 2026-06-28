import { MOB_MISSILES } from "../constants/constants";
import { settings } from "../settings/settingsManager";
import { isNil } from "../utils";

/**
 * A line printed in some mobs' stat boxes to separate the mob's stats from
 * its missiles' stats.
 */
const MISSILE_STATS_DIVIDER = "======= MISSILE STATS =======";


/**
 * For mobs which shoot missiles at the player, this feature improves their
 * stats boxes by including their missiles' stats as well.
 * 
 * Note that this feature does not include missile speeds, since the missile
 * speeds shown on stats boxes are most likely inaccurate.
 * 
 * Thank you to Slayer for suggesting this feature!
 */
export function addMissileStatsToStatsBoxes(): void {
  // Tell the `generateData` function to also generate missile data
  const originalGenerateData = StatsBox.prototype.generateData;
  StatsBox.prototype.generateData = function(mode, type, stats) {
    originalGenerateData.apply(this, [mode, type, stats]);

    if (!settings.get("missileStatsInStatsBoxes")) {
      return;
    }

    // Retrieve data for the missile that this mob shoots, if applicable
    const missileType = MOB_MISSILES[this.type];
    if (mode === "enemies" && !isNil(missileType)) {
      const missileStats = cachedStats.enemies[missileType][this.rarity];

      // We will place the missile data right before the droprates data
      let dropsIndex = this.bottomstats.findIndex(stat => stat.key === "drops")
        ?? this.bottomstats.length;

      this.bottomstats.splice(dropsIndex, 0, {
        key: MISSILE_STATS_DIVIDER,
        // Must be `"\0"` instead of an empty string, or else this stat gets
        // ignored when drawing this stats box.
        value: "\0",
        color: "white",
      });
      dropsIndex++;

      this.bottomstats.splice(dropsIndex, 0, {
        key: "missileHealth",
        value: missileStats.health,
        color: statColors.health,
      });
      dropsIndex++;

      this.bottomstats.splice(dropsIndex, 0, {
        key: "missileDamage",
        value: missileStats.damage,
        color: statColors.damage,
      });
      dropsIndex++;

      if (missileStats.poison) {
        const totalPoison = formatAmountHighPrecision(missileStats.poison[0]);
        const poisonDps = formatAmountHighPrecision(missileStats.poison[1]);
        const poisonTime = Math.round(
          missileStats.poison[0] / missileStats.poison[1] * 100
        ) / 100;
        const text = `${totalPoison} (${poisonDps}/s, total ${poisonTime}s)`
        this.bottomstats.splice(dropsIndex, 0, {
          key: "missilePoison",
          value: text,
          color: statColors.poison,
        });
        dropsIndex++;
      }

      this.bottomstats.splice(dropsIndex, 0, {
        key: "missileMass",
        value: missileStats.mass,
        color: statColors.mass,
      });
      dropsIndex++;
    }
  }

  // Also override the `formatName` function so it doesn't mess up our
  // `MISSILE_STATS_DIVIDER`.
  const originalFormatName = StatsBox.prototype.formatName;
  StatsBox.prototype.formatName = function(name) {
    if (name === MISSILE_STATS_DIVIDER) {
      return MISSILE_STATS_DIVIDER;
    } else {
      return originalFormatName.apply(this, [name]);
    }
  }

  // Delete cached stats boxes if the [Missile Stats in Stat Boxes] setting
  // gets changed, so that the new setting can be re-applied.
  settings.addListener("missileStatsInStatsBoxes", () => {
    cachedImages.statBoxes.enemies = {};
  });
}