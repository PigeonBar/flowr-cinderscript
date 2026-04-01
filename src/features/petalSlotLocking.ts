import { PETAL_BORDER_RATIO } from "../constants/constants";
import { addKeybindInstruction } from "../inits/keybindHandling";
import { settings } from "../settings/settingsManager";
import { isNil } from "../utils";

// icons/petal-lock.svg
const petalLockIcon = new Image();
petalLockIcon.src = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB3aWR0aD0iNTQuNTAwMzJtbSIKICAgaGVpZ2h0PSI2NC41MDAwMDhtbSIKICAgdmlld0JveD0iMCAwIDU0LjUwMDMyIDY0LjUwMDAwOCIKICAgdmVyc2lvbj0iMS4xIgogICBpZD0ic3ZnMSIKICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcwogICAgIGlkPSJkZWZzMSIgLz4KICA8ZwogICAgIGlkPSJsYXllcjEiCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTY5Ljk5OTk5OSwtNzApIj4KICAgIDxyZWN0CiAgICAgICBzdHlsZT0iZmlsbDojZGYwMmZmO2ZpbGwtb3BhY2l0eTowO3N0cm9rZTojZmZmZmZmO3N0cm9rZS13aWR0aDo0LjQ5ODtzdHJva2UtbGluZWNhcDpzcXVhcmU7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjE7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjE7cGFpbnQtb3JkZXI6bWFya2VycyBzdHJva2UgZmlsbCIKICAgICAgIGlkPSJyZWN0MiIKICAgICAgIHdpZHRoPSI1MC4wMDIzMTkiCiAgICAgICBoZWlnaHQ9IjUwLjAwMjMxOSIKICAgICAgIHg9IjcyLjI0OTAwMSIKICAgICAgIHk9IjcyLjI0OTAwMSIgLz4KICAgIDxyZWN0CiAgICAgICBzdHlsZT0iZmlsbDojZmZmZmZmO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTojZmZmZmZmO3N0cm9rZS13aWR0aDowO3N0cm9rZS1saW5lY2FwOnNxdWFyZTtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MTtwYWludC1vcmRlcjptYXJrZXJzIHN0cm9rZSBmaWxsIgogICAgICAgaWQ9InJlY3QzIgogICAgICAgd2lkdGg9IjgiCiAgICAgICBoZWlnaHQ9IjUiCiAgICAgICB4PSI5My4yNSIKICAgICAgIHk9IjEyOS41IiAvPgogICAgPGVsbGlwc2UKICAgICAgIHN0eWxlPSJmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjA7c3Ryb2tlOiNmZmZmZmY7c3Ryb2tlLXdpZHRoOjI7c3Ryb2tlLWxpbmVjYXA6c3F1YXJlO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoxO3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxO3BhaW50LW9yZGVyOm1hcmtlcnMgc3Ryb2tlIGZpbGwiCiAgICAgICBpZD0icGF0aDMiCiAgICAgICBjeD0iOTcuMjUiCiAgICAgICBjeT0iMTI5LjUiCiAgICAgICByeD0iMi41IgogICAgICAgcnk9IjQiIC8+CiAgPC9nPgo8L3N2Zz4K";

/**
 * This feature lets the player lock petal slots, which prevents the petal from
 * being swapped with the bottom petal.
 * 
 * This feature also exists in Elocord's script, but with different
 * functionality.
 */
export function addPetalSlotLocking() {
  const lockManager = new LockManager();

  const oldDraw = Inventory.prototype.draw;
  Inventory.prototype.draw = function(alpha?: number) {
    oldDraw.apply(this, [alpha]);

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
  Inventory.prototype.swapPetals = function(index: number, toSend?: boolean) {
    // Check for the user selecting a petal to be locked
    if (lockManager.toggleLock(this, index)) {
      return;
    }

    // Enforce the petal being locked
    if (!lockManager.applyLock(this, index)) {
      originalSwap.apply(this, [index, toSend]);
    }
  }
}

/**
 * A class for managing the user's ability to lock petal slots.
 */
class LockManager {
  /**
   * Whether or not each slot is currently locked.
   */
  slotLocked: boolean[];

  /**
   * The *target* opacity of each lock icon (from 0 to 1) based the slot's
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
      this.slotLocked = JSON.parse(storedLocks);
    } else {
      this.slotLocked = Array(10).fill(false);
    }

    this.alpha = Array(10).fill(0);
    this.renderAlpha = Array(10).fill(0);
    this.shakeTimer = Array(10).fill(0);
    this.lockKeybindHeld = false;
    this.swappingAllPetals = false;
  }

  /**
   * A helper function to determine whether a slot is lockable, according to
   * the settings and the total number of petals that the loadout has.
   */
  isAllowedToLock(loadout: Inventory, slot: number): boolean {
    return (slot >= 5 || settings.get("allowLockSlotsOneToFive"))
      && slot < loadout.topPetalSlots.length;
  }

  /**
   * Draws the lock icons onto the petal slots of the given loadout.
   */
  draw(loadout: Inventory): void {
    // Failsafe to prevent non-lockable slots from being locked
    for (let i = 0; i < 10; i++) {
      if (!this.isAllowedToLock(loadout, i)) {
        this.slotLocked[i] = false;
      }
    }

    for (let i = 0; i < loadout.topPetalSlots.length; i++) {
      this.updateAlpha(loadout, i);
      this.drawIcon(loadout, i);
    }
    ctx.globalAlpha = 1;
  }

  /**
   * A helper function to update {@linkcode alpha} and {@linkcode renderAlpha}
   * for a single slot.
   */
  updateAlpha(loadout: Inventory, slot: number) {
    const petal = loadout.topPetalContainers[slot];
    const slotObject = loadout.topPetalSlots[slot];

    if (!this.isAllowedToLock(loadout, slot)) {
      this.alpha[slot] = 0;
    } else if (this.slotLocked[slot]) {
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
    } else {
      // If slot is not locked but the user is pressing the [Lock Petal Slot]
      // key, increase opacity to tell user that the slot is lockable.
      if (this.lockKeybindHeld) {
        this.alpha[slot] = 0.5;
      } else {
        this.alpha[slot] = 0;
      }
    }

    // Update `renderAlpha` to approach `alpha` smoothly
    this.renderAlpha[slot] =
      interpolate(this.renderAlpha[slot], this.alpha[slot], dt / 200);
  }

  /**
   * A helper function to draw the lock icon for a single petal slot.
   */
  drawIcon(loadout: Inventory, slot: number) {
    // If the icon is not fully opaque, draw it smaller so it covers the inside
    // of the petal's border, otherwise it looks ugly
    const sizeMult = this.alpha[slot] === 1 ?
      Math.pow(1 + PETAL_BORDER_RATIO / 2, 2) :
      1 + PETAL_BORDER_RATIO / 2 + 0.02;

    const iconRatio = petalLockIcon.height / petalLockIcon.width;
    const slotObject = loadout.topPetalSlots[slot];

    // Apply shaking
    this.shakeTimer[slot] = Math.max(0, this.shakeTimer[slot] - dt);
    const intensity = settings.get("petalLockShakeIntensity");
    const iconX = slotObject.x - sizeMult * slotObject.size / 2
      + intensity * Math.sin(this.shakeTimer[slot] * 2 * Math.PI / 75);

    ctx.globalAlpha = this.renderAlpha[slot];

    ctx.drawImage(
      petalLockIcon,
      iconX,
      slotObject.y - sizeMult * slotObject.size / 2 + loadout.translateY,
      sizeMult * slotObject.size,
      sizeMult * slotObject.size * iconRatio,
    );
  }

  /**
   * Toggles the given slot's lock status if the slot is lockable.
   * 
   * Locking petals requires the following 3 criteria:
   * 1. The user is holding the [Lock Petal Slot] key.
   * 2. The user is allowed to lock the given slot.
   * 3. The user is not pressing [R] to swap the entire loadout.
   * 
   * @returns `true` iff the slot was successfully toggled.
   */
  toggleLock(loadout: Inventory, slot: number): boolean {
    if (this.lockKeybindHeld
        && this.isAllowedToLock(loadout, slot)
        && !this.swappingAllPetals
    ) {
      this.slotLocked[slot] = !this.slotLocked[slot];

      // Saved the toggled lock in local storage
      localStorage.setItem("cinderLocks", JSON.stringify(this.slotLocked));
      
      // Also play the shake animation here, as a visual cue that a lock was
      // toggled on.
      if (this.slotLocked[slot]) {
        // Three shakes, each 75ms long
        this.shakeTimer[slot] = 225;
      }

      return true;
    }
    return false;
  }

  /**
   * @returns `true` iff the slot is currently locked.
   */
  applyLock(loadout: Inventory, slot: number): boolean {
    // Locks are temporarily disabled if the slot is not occupied by a petal
    if (this.slotLocked[slot] && !isNil(loadout.topPetalContainers[slot])) {
      // Three shakes, each 75ms long
      this.shakeTimer[slot] = 225;
      return true;
    }

    return false;
  }
}