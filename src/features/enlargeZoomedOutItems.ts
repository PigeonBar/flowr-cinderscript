import { unsafeWindow } from "$";
import { settings } from "../settings/settingsManager";
import { convertPetalValue, isNil } from "../utils";

/**
 * This feature enlarges some displayed items. Right now, these items include
 * high-rarity petal drops, as well as the HP bar displayed below the player.
 * More items can be added later if requested.
 * 
 * Since high-rarity mobs can drop "jackpots" consisting of thousands of a
 * lower-rarity petal, this feature uses {@linkcode convertPetalValue} to judge
 * whether or not a drop is high-rarity.
 */
export function enlargeZoomedOutItems(): void {
  const originalRenderHpBar = renderHpBar;
  renderHpBar = function(data: HpBarData, entity?: HpEntityData) {
    // Enlarge the player's HP bar, not other flowers' HP bars
    if (data.flowerName !== undefined && entity?.id === unsafeWindow.selfId) {
      // Flowr's code scales the HP bar by r ** 1.2, which we compensate for.
      const scale = settings.get("playerHpBarScale");
      const rScale = scale ** (1 / 1.2);

      // The code normally changes the y-value based on the radius, so we
      // adjust the y-value here to compensate.
      data.y -= (scale - 1) * data.radius;
      data.radius *= rScale;
    }

    // Now render the HP bar as usual
    originalRenderHpBar(data, entity);
  }

  /**
   * A helper function to set the given petal to a new size based on the
   * settings related to "specialDropsScale".
   */
  function calculatePetalSize(petal: PetalContainer): void {
    const desiredRarity = settings.get("specialDropsRarity");
    const desiredQuantity = settings.get("specialDropsQuantity");
    const effectiveQuantity = convertPetalValue(
      petal.amount,
      petal.rarity,
      desiredRarity,
    );

    if (effectiveQuantity >= desiredQuantity) {
      const scale = settings.get("specialDropsScale");

      // Multiply the petal's size by the desired scale (default size is 50)
      petal.w = 50 * scale;
      petal.h = 50 * scale;
    } else {
      // Set petal size back to default (50)
      petal.w = 50;
      petal.h = 50;
    }
  }

  // Function that gets called when a petal drops from a mob
  const originalNewPetalContainer = processGameMessageMap.newPetalContainer;
  processGameMessageMap.newPetalContainer = function(
    data: any, _me?: any, _advanced?: any
  ) {
    const scale = settings.get("specialDropsScale");

    // Calculate if the petal container has enough value
    const desiredRarity = settings.get("specialDropsRarity");
    const desiredQuantity = settings.get("specialDropsQuantity");
    const effectiveQuantity = convertPetalValue(
      data.amount ?? 1,
      data.rarity,
      desiredRarity,
    );
    if (effectiveQuantity >= desiredQuantity) {
      const originalSize = data.w;

      // Also drop the petal further away from the mob's centre, so that it
      // doesn't cover up other petals
      const dx = data.x - data.originalX;
      const dy = data.y - data.originalY;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d > 0) {
        data.x = data.originalX + dx * (d + originalSize * (scale - 1)) / d;
        data.y = data.originalY + dy * (d + originalSize * (scale - 1)) / d;
      }
    }

    // Now add the petal container as usual
    originalNewPetalContainer(data, _me, _advanced);

    // Finally, resize the new petal immediately
    const petal = room.petalContainers[data.id];
    if (!isNil(petal)) {
      calculatePetalSize(petal);
    }
  }

  // Also recalculate sizes for ALL petal drops if settings get edited
  function recalculateAllPetalSizes(): void {
    for (let petal of Object.values(room.petalContainers)) {
      calculatePetalSize(petal);
    }
  }

  settings.addListener("specialDropsScale", recalculateAllPetalSizes);
  settings.addListener("specialDropsRarity", recalculateAllPetalSizes);
  settings.addListener("specialDropsQuantity", recalculateAllPetalSizes);
}