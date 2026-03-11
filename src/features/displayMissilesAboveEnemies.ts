import { settings } from "../settings/settingsManager";

/**
 * This script ensures that enemy missiles are always drawn above the enemies
 * themselves, which makes enemy missiles easier to see and dodge.
 * 
 * Some important background info: According to
 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in this documentation},
 * the `for` loop in `renderGame()` is deterministic and will always traverse
 * through the list of enemies in increasing order of ID.
 */
export function displayMissilesAboveEnemies() {
  const originalRenderGame = renderGame;

  renderGame = (dt: number) => {
    if (!settings.get("missileDrawPriority")) {
      originalRenderGame(dt);
      return;
    }

    const queuedMissiles: Enemy[] = [];

    const maxId = Math.max(...Object.keys(room.enemies).map(k => Number(k)));
    for (let id in room.enemies) {
      const enemy = room.enemies[id];

      // On the first round, queue missiles instead of drawing them.
      if (enemy.type.includes("Missile")) {
        enemy.draw = function() {
          queuedMissiles.push(this);
        }
      }

      // After drawing the final enemy, then draw the missiles.
      if (Number(id) === maxId) {
        enemy.draw = function() {
          Enemy.prototype.draw.apply(this);
          for (let missile of queuedMissiles) {
            Enemy.prototype.draw.apply(missile);
          }
        };
      }
    }

    originalRenderGame(dt); // Now render everything as usual.

    // Restore all draw functions
    for (let enemy of Object.values(room.enemies)) {
      enemy.draw = Enemy.prototype.draw;
    }
  }
}