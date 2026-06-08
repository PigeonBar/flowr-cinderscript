import { unsafeWindow } from "$";
import { MINIMAP_GREEN, MINIMAP_RED, MINIMAP_YELLOW, LOW_SPEED_MOBS, RARE_MOBS } from "../constants/constants";
import { addKeybindInstruction } from "../inits/keybindHandling";
import { settings } from "../settings/settingsManager";
import { TooltipIcon } from "../settings/tooltips";
import { isNil } from "../utils";

/**
 * This feature adds a minimap that can be toggled using a keybind. This
 * minimap shows the players and top-rarity mobs currently alive in the room.
 */
export function addMinimap() {
  const minimap = new Minimap();

  // Add keybind instruction for toggling the minimap
  addKeybindInstruction({
    type: "settings",
    settingsKey: "keybindMinimap",
    fn: () => {
      minimap.toggle();
    }
  });

  // Move the collected menu off-screen if the minimap is on-screen
  const originalDraw = CollectedMenu.prototype.draw;
  CollectedMenu.prototype.draw = function(mini?: boolean) {
    const fullOffset = canvas.w + 20 - (this.dimensions?.x ?? canvas.w);
    const offset = fullOffset * minimap.openRatio;
    ctx.translate(offset, 0);

    originalDraw.apply(this, [mini]);

    ctx.translate(-offset, 0);
  }

  const originalRenderGame = renderGame;
  renderGame = function(dt: number) {
    originalRenderGame(dt);

    // Draw the minimap after drawing everything else
    minimap.draw();
  }

  // Make the minimap fully closed by default when entering a new game
  const originalEnterGame = enterGame;
  enterGame = function() {
    originalEnterGame();

    minimap.active = false;
    minimap.openRatio = 0;
  }
}

/**
 * A toggleable minimap UI that shows the players and top-rarity mobs
 * currently alive in the room.
 */
class Minimap {
  /**
   * The x-position of this minimap on the canvas.
   */
  x: number;
  
  /**
   * The y-position of this minimap on the canvas.
   */
  y: number;

  /**
   * The width of this minimap.
   */
  w: number;

  /**
   * The height of this minimap.
   */
  h: number;

  /**
   * The radius of the room drawn onto the minimap.
   */
  roomRadius: number;

  /**
   * The x-position of the user inside the game's room.
   */
  playerX: number;

  /**
   * The y-position of the user inside the game's room.
   */
  playerY: number;

  /**
   * Whether or not the player has toggled open this minimap.
   */
  active: boolean;

  /**
   * A number from 0 (fully closed) to 1 (fully open) that controls this
   * minimap's position. This number smoothly moves towards 0 or 1 based on
   * whether the minimap is currently opening or closing.
   * 
   * This also controls the {@linkcode CollectedMenu}'s position, so that it
   * does not overlap with this minimap.
   */
  openRatio: number;
  
  /**
   * A tooltip icon, displayed in the bottom-left corner of this UI.
   */
  tooltipIcon: TooltipIcon;

  /**
   * The coordinates for the tooltip icon.
   */
  tooltipPos: { x: number, y: number };

  constructor() {
    this.w = 320;
    this.h = 320;
    this.x = canvas.w - this.w - 20;
    this.y = 20;
    this.roomRadius = this.w / 2 - 20;

    this.playerX = 0;
    this.playerY = 0;

    this.active = false;
    this.openRatio = 0;

    this.tooltipIcon = new TooltipIcon(
      `Minimap legend: $n ` +
      `$c${MINIMAP_GREEN} Green $cwhite circle: Your position $n ` +
      `$c${MINIMAP_YELLOW} Yellow $cwhite circles: Squadmates $n ` +
      `$c${MINIMAP_RED} Red $cwhite X: Your death position $n ` +
      `Triangles: Regular enemies $n ` +
      `Stars: Boss enemies $n $n ` +
      `In the settings, you can configure the number of enemies displayed. ` +
      `This minimap shows the highest-rarity mobs in the room, with ties ` +
      `broken by each mob's distance from your character.`
    );
    this.tooltipPos = { x: 0, y: 0 };
  }

  /**
   * Toggles this minimap to be open/closed.
   */
  toggle(): void {
    this.active = !this.active;
  }

  /**
   * The main function for drawing this minimap.
   */
  draw(): void {
    // Move this minimap towards the required opened/closed position
    if (this.active) {
      this.openRatio = interpolate(this.openRatio, 1, 0.3);
    } else {
      this.openRatio = interpolate(this.openRatio, 0, 0.3);
    }

    const offset = (this.openRatio - 1) * (this.y + this.h + 20);

    // Recalculate this menu's x-position in case the window got resized
    this.x = canvas.w - this.w - 20;

    // Translate the ctx to the centre of the minimap's circle
    ctx.save();
    ctx.translate(this.x + this.w / 2, this.y + offset + this.w / 2);

    // Draw the translucent background around this minimap's circle
    ctx.save();
    ctx.beginPath();
    ctx.rect(-this.w / 2, -this.w / 2, this.w, this.h);
    ctx.arc(0, 0, this.roomRadius, 0, 2 * Math.PI);
    ctx.clip("evenodd");
    ctx.closePath();

    ctx.globalAlpha = 0.3;
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.roundRect(-this.w / 2, -this.w / 2, this.w, this.h, 5);
    ctx.fill();
    ctx.closePath();
    ctx.restore();
    
    // Draw the translucent background inside this minimap's circle
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(0, 0, this.roomRadius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();

    // Set the remaining icons to be transparent if this Ui is currently
    // closed, in case there is a very large enemy with a very large icon that
    // leaks onto the canvas screen.
    ctx.globalAlpha = this.openRatio;

    // Poll the user's own position if the user is currently alive
    let userId = unsafeWindow.selfId ?? -1;
    if (unsafeWindow.spectating && Object.keys(room.flowers).length > 0) {
      // If the user is spectating instead of playing, poll the flower with the
      // lowest ID instead.
      userId = Math.min(
        ...Object.keys(room.flowers).map(id => Number.parseInt(id))
      );
    }
    const user = room.flowers[userId];
    const userAlive = !isNil(user) && !user.dead;
    if (userAlive) {
      this.playerX = user.x;
      this.playerY = user.y;
    }

    // List all mobs that are eligible to be added to the minimap
    const enemyList = Object.values(room.enemies)
      .filter(e => this.checkEligibleEnemy(e));
    
    const enemyListWithDistance = enemyList.map(e => {
      return {
        enemy: e,
        dist: (e.x - this.playerX) ** 2 + (e.y - this.playerY) ** 2,
        drawn: false,
      };
    });

    enemyListWithDistance.sort((a, b) => {
      // Prioritize rendering higher-rarity mobs
      if (a.enemy.rarity > b.enemy.rarity) {
        return -1;
      } else if (b.enemy.rarity > a.enemy.rarity) {
        return 1;
      }

      // Break ties by checking which enemy is closer to the player
      return a.dist - b.dist;
    });

    // Draw the top enemies in the sorted list
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    const enemyCount = Math.min(
      settings.get("minimapNumberOfMobs"), enemyListWithDistance.length,
    );
    for (let i = 0; i < enemyCount; i++) {
      const enemy = enemyListWithDistance[i].enemy;
      this.drawEnemy(enemy);
      enemyListWithDistance[i].drawn = true;
    }

    // Draw more enemies if they should bypass the mob cap
    for (let entry of enemyListWithDistance) {
      const enemy = entry.enemy;
      if (this.checkMustDraw(enemy) && !entry.drawn) {
        this.drawEnemy(enemy);
        entry.drawn = true;
      }
    }

    // Draw the flowers (players)
    this.drawFlowers(userAlive);
    
    // Undo the ctx translation
    ctx.restore();

    // Draw the tooltip icon
    this.tooltipPos = { x: this.x + 30, y: this.y + offset + this.h - 30 };
    this.tooltipIcon.drawIcon(this.tooltipPos);
    this.tooltipIcon.drawText(
      this.tooltipPos, { x: mouse.canvasX, y: mouse.canvasY },
    );
  }

  /**
   * A helper function to decide whether or not the given enemy is eligible to
   * be added to the minimap. Right now, the following enemies are excluded:
   * - Missiles/projectiles
   * - Eggs laid by Queen Ants and such
   * - Non-head leech segments
   */
  checkEligibleEnemy(enemy: Enemy): boolean {
    return !enemy.type.includes("Missile")
      && !enemy.type.includes("Egg")
      && (enemy.isHead || !enemy.type.includes("Eel"))
      && (enemy.isHead || !enemy.type.includes("Leech"));
  }

  /**
   * A helper function to decide whether or not the given enemy must be drawn
   * regardless of the mob cap. Right now, the following enemies are included:
   * - Bosses, if the "Always Show Bosses" setting is turned on.
   * - Enemies belonging to {@linkcode RARE_MOBS}, if the "Always Show Rare
   *   Mobs" setting in turned on.
   * - Enemies with rarity at least the "Always Show Rarity" setting if this
   *   setting is enabled (i.e., greater than 0).
   */
  checkMustDraw(enemy: Enemy): boolean {
    if (settings.get("minimapAlwaysShowBosses") && enemy.isBoss) {
      return true;
    }

    if (settings.get("minimapAlwaysShowRareMobs")
      && RARE_MOBS.includes(enemy.type)
    ) {
      return true;
    }

    const alwaysShowRarity = settings.get("minimapAlwaysShowRarity");
    if (alwaysShowRarity > 0 && enemy.rarity >= alwaysShowRarity) {
      return true;
    }

    return false;
  }

  /**
   * A helper function to draw a single enemy icon on the minimap.
   */
  drawEnemy(enemy: Enemy): void {
    // Scale the enemy's minimap icon based on the enemy's size
    const drawSize = Math.max(
      enemy.radius * this.roomRadius / room.radius, 10,
    );

    // Translate ctx to the enemy's position
    ctx.save();
    ctx.translate(
      enemy.x * this.roomRadius / room.radius,
      enemy.y * this.roomRadius / room.radius,
    );
    
    // Draw auras around rare mobs if the "Rare Mob Aura" setting is turned on
    if (settings.get("minimapRareMobAura") && RARE_MOBS.includes(enemy.type)) {
      // Let the aura pulse slightly
      const auraSize = drawSize * (1.35 + 0.25 * Math.sin(time / 500));
      const aura = ctx.createRadialGradient(0, 0, 0, 0, 0, auraSize);
      aura.addColorStop(0, MINIMAP_YELLOW);
      aura.addColorStop(0.3, MINIMAP_YELLOW);
      aura.addColorStop(1, MINIMAP_YELLOW + "00"); // Yellow but transparent
      ctx.fillStyle = aura;

      ctx.beginPath();
      ctx.arc(0, 0, auraSize, 0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();
    }

    ctx.fillStyle = Colors.rarities[enemy.rarity].color;

    if (enemy.isBoss) {
      // Draw bosses as stars
      ctx.beginPath();
      ctx.moveTo(0, -1.25 * drawSize);
      for (let i = 1; i <= 10; i++) {
        const r = drawSize * (1 + 0.25 * Math.cos(i * Math.PI));
        const angle = Math.PI * (-0.5 + i / 5);
        ctx.lineTo(r * Math.cos(angle), r * Math.sin(angle));
      }
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
    } else if (LOW_SPEED_MOBS.includes(enemy.type)) {
      // Draw low-speed mobs as equilateral triangles
      ctx.beginPath();
      const r = 1.1 * drawSize;
      ctx.moveTo(0, -r);
      for (let i = 1; i <= 3; i++) {
        const angle = Math.PI * (-0.5 + i * 2 / 3);
        ctx.lineTo(r * Math.cos(angle), r * Math.sin(angle));
      }
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
    } else {
      // Draw regular mobs as triangles pointing where the mob is facing
      ctx.rotate(enemy.angle);
      ctx.beginPath();
      ctx.moveTo(1.25 * drawSize, 0);
      ctx.lineTo(-0.7 * drawSize, 0.7 * drawSize);
      ctx.lineTo(-0.7 * drawSize, -0.7 * drawSize);
      ctx.lineTo(1.25 * drawSize, 0);
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
    }

    ctx.restore();
  }

  /**
   * A helper function to draw all flowers (players) on the minimap.
   */
  drawFlowers(userAlive: boolean): void {
    // Draw the user's own position (green circle if alive, red X if dead)
    if (!unsafeWindow.spectating) {
      const drawPlayerX = this.playerX * this.roomRadius / room.radius;
      const drawPlayerY = this.playerY * this.roomRadius / room.radius;
      if (userAlive) {
        ctx.strokeStyle = "black";
        ctx.fillStyle = MINIMAP_GREEN;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(drawPlayerX, drawPlayerY, 10, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
      } else {
        ctx.strokeStyle = MINIMAP_RED;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(drawPlayerX - 10, drawPlayerY - 10);
        ctx.lineTo(drawPlayerX + 10, drawPlayerY + 10);
        ctx.moveTo(drawPlayerX + 10, drawPlayerY - 10);
        ctx.lineTo(drawPlayerX - 10, drawPlayerY + 10);
        ctx.stroke();
        ctx.closePath();
      }
    }

    // Draw the other flowers' positions
    ctx.strokeStyle = "black";
    ctx.fillStyle = MINIMAP_YELLOW;
    ctx.lineWidth = 1;
    for (let flower of Object.values(room.flowers)) {
      if (flower.id !== unsafeWindow.selfId) {
        ctx.beginPath();
        ctx.arc(
          flower.x * this.roomRadius / room.radius,
          flower.y * this.roomRadius / room.radius,
          8,
          0,
          2 * Math.PI,
        );
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
      }
    }
  }
}
