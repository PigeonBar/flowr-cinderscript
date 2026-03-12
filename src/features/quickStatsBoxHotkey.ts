import { addKeybindInstruction } from "../inits/keybindHandling";
import { isNil } from "../utils";

/**
 * This feature adds a hotkey to toggle displaying the stats box of the highest
 * rarity mob in the room, without needing to mouse over its icon box.
 */
export function addQuickStatsBoxHotkey() {
  // The stats box is always off by default when reloading the page
  let showQuickStatsBox = false;

  addKeybindInstruction({type: "settings", key: "keybindStatsBox", fn: () => {
    showQuickStatsBox = !showQuickStatsBox;
  }});

  const originalRenderGame = renderGame;
  const originalDrawStatsBox = PetalContainer.prototype.drawStatsBox;
  renderGame = (dt) => {
    if (showQuickStatsBox) {
      // Hide all other enemy stat boxes for now
      PetalContainer.prototype.drawStatsBox = function() {
        if (this.petals[0]?.constructor === Petal) {
          originalDrawStatsBox.apply(this);
        }
      }
    }

    originalRenderGame(dt); // First, render everything else as usual

    // Restore the ability to draw enemy stats boxes
    PetalContainer.prototype.drawStatsBox = originalDrawStatsBox;

    if (showQuickStatsBox) {
      // For breaking ties, count total number of mobs of each type.
      // Then, mobs appearing less frequently are considered higher-rarity.
      const totalCount: Record<EnemyType, number> = {};
      for (let enemyBox of Object.values(room.enemyBoxes)) {
        totalCount[enemyBox.type] ??= 0;
        totalCount[enemyBox.type] += enemyBox.amount;
      }

      // Find the highest-rarity box belonging to a non-boss enemy.
      // TODO: Optimize this. It seems wasteful to linear search for the
      // highest-rarity box every frame that we render the game.
      let highestBox: enemyBox | undefined = undefined;
      for (let enemyBox of Object.values(room.enemyBoxes)) {
        if (
          isNil(highestBox) ||
          enemyBox.rarity > highestBox.rarity || (
            enemyBox.rarity === highestBox.rarity &&
            totalCount[enemyBox.type] <= totalCount[highestBox.type]
        )) {
          if (!enemyBox.isBoss) {
            highestBox = enemyBox;
          }
        }
      }

      // Display its stats box (code copied from flowr.fun client code)
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
            (highestBox.y + highestBox.w / 2) + 3 * highestBox.w / 5
          );
        }
      }
    }
  }
}