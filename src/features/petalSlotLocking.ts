import { PETAL_BORDER_RATIO } from "../constants/constants";
import { addKeybindInstruction } from "../inits/keybindHandling";
import { settings } from "../settings/settingsManager";
import { isNil } from "../utils";

/**
 * This feature lets the player lock petal slots, which prevents the petal from
 * being swapped with the bottom petal.
 * 
 * This feature also exists in Elocord's script, but with different
 * functionality.
 */
export function addPetalSlotLocking() {
  const lockManager = new LockManager();

  // The game has two different "inventory" objects, and we set both of them to
  // also draw the petal slot locks.
  const oldDrawInventory = inventory.draw;
  inventory.draw = function(alpha?: number) {
    oldDrawInventory.apply(this, [alpha]);

    // Draw the lock icons on top of the loadout
    lockManager.draw(this);
  }
  const oldDrawMenuInventory = menuInventory.draw;
  menuInventory.draw = function(alpha?: number) {
    oldDrawMenuInventory.apply(this, [alpha]);

    // Draw the lock icons on top of the loadout
    lockManager.draw(this);
  }

  // Check for the user pressing/releasing the [Lock Petal Slot] keybind
  addKeybindInstruction({
    type: "settings",
    settingsKey: "keybindLockSlot",
    keyType: "keydown",
    inGame: true,
    inMenu: true,
    fn: () => {
      lockManager.lockKeybindHeld = true;
    },
  });
  addKeybindInstruction({
    type: "settings",
    settingsKey: "keybindLockSlot",
    keyType: "keyup",
    inGame: true,
    inMenu: true,
    fn: () => {
      lockManager.lockKeybindHeld = false;
    },
  });

  // Check for the user pressing the [R] key to swap all petals
  addKeybindInstruction({
    type: "rawValue",
    value: "KeyR",
    inGame: true,
    inMenu: true,
    beforeOriginal: true,
    fn: () => {
      lockManager.swappingAllPetals = true;
    },
  });
  addKeybindInstruction({
    type: "rawValue",
    value: "KeyR",
    inGame: true,
    inMenu: true,
    beforeOriginal: false,
    fn: () => {
      lockManager.swappingAllPetals = false;
    },
  });
  
  const originalSwap = Inventory.prototype.swapPetals;
  Inventory.prototype.swapPetals = function(
    index: number, toSend?: boolean, bypassLock: boolean = false
  ) {
    // Check for the user selecting a petal to be locked
    if (!bypassLock && lockManager.toggleLock(this, index)) {
      return;
    }

    // Enforce the petal being locked
    if (bypassLock || !lockManager.applyLock(this, index)) {
      originalSwap.apply(this, [index, toSend]);
    }
  }
}

/**
 * The possible lock states for a petal slot, denoted as follows:
 * - Unlocked (default): Petal can be swapped freely
 * - Soft Locked: Petal is unaffected by the [R] hotkey
 * - Hard Locked: Petal cannot be swapped at all
 */
type LockState = "Unlocked" | "Soft Locked" | "Hard Locked";

/**
 * A class for managing the user's ability to lock petal slots.
 */
class LockManager {
  /**
   * The lock state of each petal slot.
   */
  lockStates: LockState[];

  /**
   * The *target* opacity of each lock icon (from 0 to 1) based on the slot's
   * status, such as whether the user has locked it, whether it is currently
   * occupied, etc..
   */
  alpha: number[];

  /**
   * The current opacity of each lock icon, which approaches 
   * {@linkcode alpha} smoothly.
   */
  renderAlpha: number[];

  /**
   * The *target* red saturation of each lock icon (from 0 to 1). The lock icon
   * turns red when the user Hard Locks the petal slot.
   */
  redSaturation: number[];

  /**
   * The current red saturation of each lock icon, which approaches
   * {@linkcode redSaturation} smoothly.
   */
  renderRedSaturation: number[];

  /**
   * Whether or not the user is holding the [Lock Petal Slot] key.
   */
  lockKeybindHeld: boolean;

  /**
   * The timer for each petal slot's shaking animation when the user tries to
   * swap a locked petal, in milliseconds.
   */
  shakeTimer: number[];

  /**
   * Whether or not the user is currently swapping all petals by pressing [R].
   */
  swappingAllPetals: boolean;

  constructor() {
    const storedLocks = localStorage.getItem("cinderLocks");

    if (!isNil(storedLocks)) {
      const parsedLocks = JSON.parse(storedLocks);

      // Migration: Lock states used to be stored as booleans instead
      for (let i = 0; i < parsedLocks.length; i++) {
        if (parsedLocks[i] === false) {
          parsedLocks[i] = "Unlocked";
        } else if (parsedLocks[i] === true) {
          parsedLocks[i] = "Hard Locked";
        }
      }
      localStorage.setItem("cinderLocks", JSON.stringify(parsedLocks));

      this.lockStates = parsedLocks;
    } else {
      this.lockStates = Array<LockState>(10).fill("Unlocked");
    }

    this.alpha = Array(10).fill(0);
    this.renderAlpha = Array(10).fill(0);
    this.redSaturation = Array(10).fill(0);
    this.renderRedSaturation = Array(10).fill(0);
    this.shakeTimer = Array(10).fill(0);
    this.lockKeybindHeld = false;
    this.swappingAllPetals = false;
  }

  /**
   * A helper function to determine the maximum lock state allowed for the
   * given petal slot, using the following rules:
   * - If the slot number is greater than the loadout's length, the slot cannot
   *   be locked at all.
   * - If the slot number is < 5 and the "Allow Hard Locking Slots 1 to 5"
   *   setting is turned off, the slot cannot be hard locked.
   */
  maximumAllowedLock(loadout: Inventory, slot: number): LockState {
    if (slot >= loadout.topPetalSlots.length) {
      return "Unlocked";
    } else if (slot < 5 && !settings.get("allowLockSlotsOneToFive")) {
      return "Soft Locked";
    } else {
      return "Hard Locked";
    }
  }

  /**
   * Draws the lock icons onto the petal slots of the given loadout.
   */
  draw(loadout: Inventory): void {
    // Failsafe to prevent non-lockable slots from being locked
    for (let i = 0; i < 10; i++) {
      if (this.maximumAllowedLock(loadout, i) === "Unlocked") {
        this.lockStates[i] = "Unlocked";
      } else if (this.maximumAllowedLock(loadout, i) === "Soft Locked"
        && this.lockStates[i] === "Hard Locked"
      ) {
        this.lockStates[i] = "Unlocked";
      }
    }

    for (let i = 0; i < loadout.topPetalSlots.length; i++) {
      this.updateColour(loadout, i);
      this.drawIcon(loadout, i);
    }
    ctx.globalAlpha = 1;
  }

  /**
   * A helper function to update {@linkcode alpha}, {@linkcode renderAlpha},
   * {@linkcode redSaturation}, and {@linkcode renderRedSaturation} for a
   * single slot.
   */
  updateColour(loadout: Inventory, slot: number) {
    const petal = loadout.topPetalContainers[slot];
    const slotObject = loadout.topPetalSlots[slot];

    if (this.lockStates[slot] === "Unlocked") {
      // If slot is not locked but the user is pressing the [Lock Petal Slot]
      // key, increase opacity to tell user that the slot is lockable.
      if (this.maximumAllowedLock(loadout, slot) !== "Unlocked"
        && this.lockKeybindHeld)
      {
        this.alpha[slot] = 0.5;
      } else {
        this.alpha[slot] = 0;
      }
    } else {
      // If slot is locked but is not occupied, or its petal is far away,
      // the lock icon should not be fully opaque.
      if (isNil(petal)
        || Math.abs(petal.render.x - slotObject.x) > 5
        || Math.abs(petal.render.y - slotObject.y) > 5
      ) {
        this.alpha[slot] = 0.5;
      } else {
        this.alpha[slot] = 1;
      }
    }

    // Turn the lock icon red if the slot is Hard Locked
    if (this.lockStates[slot] === "Hard Locked") {
      this.redSaturation[slot] = 1;
    } else {
      this.redSaturation[slot] = 0;
    }

    // Update interpolations
    this.renderAlpha[slot] = interpolate(
      this.renderAlpha[slot], this.alpha[slot], dt / 200,
    );
    this.renderRedSaturation[slot] = interpolate(
      this.renderRedSaturation[slot], this.redSaturation[slot], dt / 200,
    );
  }

  /**
   * A helper function to draw the lock icon for a single petal slot.
   */
  drawIcon(loadout: Inventory, slot: number) {
    const slotObject = loadout.topPetalSlots[slot];

    // Translate to the slot location
    ctx.save();
    ctx.translate(slotObject.x, slotObject.y + loadout.translateY);

    // Apply shaking
    this.shakeTimer[slot] = Math.max(0, this.shakeTimer[slot] - dt);
    const intensity = settings.get("petalLockShakeIntensity");
    const dx = intensity * Math.sin(this.shakeTimer[slot] * 2 * Math.PI / 75);
    ctx.translate(dx, 0);
    
    // Scale the lock icon according to the petal slot's size
    ctx.scale(slotObject.size / 50, slotObject.size / 50);

    // If the icon is not fully opaque, draw it smaller so it covers the inside
    // of the petal's border, otherwise it looks ugly
    if (this.alpha[slot] === 1) {
      ctx.scale(1 + PETAL_BORDER_RATIO / 2, 1 + PETAL_BORDER_RATIO / 2);
    } else {
      ctx.scale(1.02, 1.02);
    }
    
    // Apply colouring and opacity
    const colour = `hsla(0, ` +
    `${this.renderRedSaturation[slot] * 100}%, ` +
    `${100 - this.renderRedSaturation[slot] * 50}%, ` +
    `${this.renderAlpha[slot]})`;
    ctx.fillStyle = colour;
    ctx.strokeStyle = colour;

    // Draw the lock icon (these commands are copied from the old svg file)
    ctx.lineWidth = 4.5;
    ctx.strokeRect(-25, -25, 50, 50);

    ctx.fillRect(-4, 32.25, 8, 5);

    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 32.25, 2.5, 4, 0, 0, Math.PI, true);
    ctx.stroke();
    ctx.closePath();

    // Restore the ctx
    ctx.restore();
  }

  /**
   * Cycles the given slot's lock status if the slot is lockable.
   * 
   * Locking petals requires the following 3 criteria:
   * 1. The user is holding the [Lock Petal Slot] key.
   * 2. The user is allowed to lock the given slot.
   * 3. The user is not pressing [R] to swap the entire loadout.
   * 
   * @returns `true` iff the slot was successfully toggled.
   */
  toggleLock(loadout: Inventory, slot: number): boolean {
    // Check if the slot can be locked at all
    if (this.maximumAllowedLock(loadout, slot) === "Unlocked") {
      return false;
    }

    // Check if the user is using the [Lock Petal Slot] keybind
    if (this.lockKeybindHeld && !this.swappingAllPetals) {
      if (this.lockStates[slot] === this.maximumAllowedLock(loadout, slot)) {
        // If the slot's lock state is at its maximum, cycle back to "Unlocked"
        this.lockStates[slot] = "Unlocked";
      } else if (this.lockStates[slot] === "Unlocked") {
        // Cycle forwards to "Soft Locked"
        this.lockStates[slot] = "Soft Locked";
      } else if (this.lockStates[slot] === "Soft Locked") {
        // Cycle forwards to "Hard Locked"
        this.lockStates[slot] = "Hard Locked";
      } else if (this.lockStates[slot] === "Hard Locked") {
        // Cycle forwards to "Unlocked"
        this.lockStates[slot] = "Unlocked";
      }

      // Save the toggled lock in local storage
      localStorage.setItem("cinderLocks", JSON.stringify(this.lockStates));
      
      // Also play the shake animation here, as a visual cue that a lock was
      // toggled on.
      if (this.lockStates[slot] !== "Unlocked") {
        // Three shakes, each 75ms long
        this.shakeTimer[slot] = 225;
      }

      return true;
    }
    return false;
  }

  /**
   * @returns `true` iff a lock prevents the given slot from being swapped.
   */
  applyLock(loadout: Inventory, slot: number): boolean {
    // Locks are temporarily disabled if the slot is not occupied by a petal
    if (isNil(loadout.topPetalContainers[slot])) {
      return false;
    }

    // Apply soft locks
    if (this.lockStates[slot] === "Soft Locked" && this.swappingAllPetals) {
      // Three shakes, each 75ms long
      this.shakeTimer[slot] = 225;
      return true;
    }

    // Apply hard locks
    if (this.lockStates[slot] === "Hard Locked") {
      // Three shakes, each 75ms long
      this.shakeTimer[slot] = 225;
      return true;
    }

    return false;
  }
}