import { unsafeWindow } from "$";
import { Rarity } from "../enums";
import { addKeybindInstruction } from "../inits/keybindHandling";

/**
 * This feature lets the script developer continue displaying the mob gallery
 * after leaving the menu screen, in order to test how in-game mobs affect the
 * mob gallery.
 */
export function displayMobGalleryOutsideMenu() {
  // Check for user toggling mob gallery outside the menu screen
  mobGallery.activeOutsideMenu = false;
  addKeybindInstruction({
    type: "localStorage",
    storageKey: "cinderDevGalleryOutsideMenu",
    fn: toggleMobGalleryOutsideMenu,
  });

  // Display mob gallery outside the menu screen if it is toggled active
  const originalRenderGame = renderGame;
  renderGame = function(dt: number) {
    originalRenderGame(dt);

    if (mobGallery.activeOutsideMenu && mobGallery.menuActive) {
      mobGallery.draw();
    }
  }
  
  // Optimization: Do not draw off-screen gallery entries
  const originalDraw = PetalContainer.prototype.draw;
  PetalContainer.prototype.draw = function(inGame?: boolean, number?: number) {
    const scrolledPos = {
      x: mobGallery.inventorySpace.x
        + mobGallery.scrollExcess.x * mobGallery.scroll.render.x,
      y: mobGallery.renderY + mobGallery.inventorySpace.y - mobGallery.y
        + mobGallery.scrollExcess.y * mobGallery.scroll.render.y,
    };
    const petalPos = {
      x: this.render.x - this.render.w / 2,
      y: this.render.y - this.render.w / 2,
    };

    if (this === mobGallery.rows[this.type]?.[this.rarity] && (
        petalPos.x > scrolledPos.x + mobGallery.inventorySpace.w
        || petalPos.x + this.render.w < scrolledPos.x
        || petalPos.y > scrolledPos.y + mobGallery.inventorySpace.h
        || petalPos.y + this.render.w < scrolledPos.y
    )) {
      this.updateInterpolate();
      return;
    }

    originalDraw.apply(this, [inGame, number]);
  }

  // Optimization: Only run the code for discovering a new enemy and
  // regenerating the entire gallery if the enemy is not already discovered.
  const originalDiscoverEnemy = addDiscoveredEnemy;
  addDiscoveredEnemy = function(
    type: EnemyType = "Ladybug", rarity: Rarity = Rarity.COMMON,
  ) {
    if (!discoveredEnemies[type]?.[rarity]) {
      originalDiscoverEnemy(type, rarity);
    }
  }
}

/**
 * A helper function to toggle the mob gallery outside of the menu screen.
 */
function toggleMobGalleryOutsideMenu() {
  if (unsafeWindow.state !== "game") {
    return;
  }

  if (mobGallery.menuActive && mobGallery.activeOutsideMenu) {
    mobGallery.activeOutsideMenu = false;
  } else {
    mobGallery.activeOutsideMenu = true;
  }

  // Sync `menuActive` with `activeOutsideMenu`
  if (mobGallery.menuActive !== mobGallery.activeOutsideMenu) {
    mobGallery.toggleMenu();
  }
}