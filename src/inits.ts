import { MAX_PETAL_RARITY } from "./constants";
import { theoryCraft } from "./utils";

/**
 * Computes {@linkcode theoryCraft}, which lists the expected number of petals
 * needed to craft rarity (n + 1) from rarity n.
 */
export function initTheoryCraft(): void {
  if (theoryCraft.length > 0) {
    console.warn("theoryCraft already initialized!");
    return;
  }
  for (let rarity = 0; rarity <= MAX_PETAL_RARITY; rarity++) {
    // 5 petals required for successful attempt
    theoryCraft.push(5);
    let probFailedSoFar = 1;
    let attempt = 0;
    while (probFailedSoFar > 0) {
      probFailedSoFar *= 1 - calculateChance(attempt, rarity) / 100;
      // Average of 2.5 petals burned per failed attempt
      theoryCraft[rarity] += probFailedSoFar * 2.5;
      attempt++;
    }
  }
}

/**
 * Unfreezes frozen objects that this script will need to modify.
 */
export function unfreezeObjects(): void {
  processGameMessageMap = {...processGameMessageMap};
}

/**
 * Refreezes frozen objects that this script has done modifying.
 */
export function refreezeObjects(): void {
  processGameMessageMap = Object.freeze(processGameMessageMap);
}