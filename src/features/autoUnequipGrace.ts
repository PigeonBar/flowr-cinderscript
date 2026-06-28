import { settings } from "../settings/settingsManager";

/**
 * This feature makes the player automatically unequip Amulet of Grace if it
 * would clear less than 10s of the wave timer. This prevents the player from
 * accidentally wasting Grace mana.
 */
export function autoUnequipGrace(): void {
  const originalUpdateRoom = Room.prototype.processUpdate;
  Room.prototype.processUpdate = function(data) {
    originalUpdateRoom.apply(this, [data]);

    // Check if timer is less than the spawning time + 10 seconds
    if (settings.get("autoUnequipGrace")
      && room.waveTimer < 30 * (waveLengthFunc(room.wave) + 10)
    ) {
      // Loop through player's equipped petals
      for (let i = 0; i < 10; i++) {
        // Check if player can unequip Grace in this slot
        if (inventory.topPetalContainers[i]?.type === "Amulet of Grace"
          && inventory.bottomPetalContainers[i]?.type !== "Amulet of Grace"
        ) {
          inventory.swapPetals(i, true, true);
        }
      }
    }
  }
}