import { unsafeWindow } from "$";
import { CINDER_COLOUR, MAX_PETAL_RARITY } from "./constants";
import type { Rarity } from "./enums";

const statsBoxQueue = [] as {
  container: PetalContainer;
  args: Parameters<PetalContainer["drawStatsBox"]>;
}[];

export type nil = null | undefined;

/**
 * @returns `true` if `arg` is `null` or `undefined`, `false` otherwise.
 */
export function isNil(arg: any): arg is nil {
  return arg === undefined || arg === null;
}

/**
 * Queues a stats box to be drawn at some point in the future.
 * Useful for making sure that stats boxes are drawn above other objects.
 * @param container The `PetalContainer` that the stats box belongs to.
 * @param args The args that got passed into `PetalContainer.drawStatsBox`.
 */
export function queueDrawStatsBox(
  container: PetalContainer,
  args: Parameters<PetalContainer["drawStatsBox"]>
): void {
  statsBoxQueue.push({container, args});
}

/**
 * Draws all of the queued stats boxes, then removes them from the queue.
 */
export function drawQueuedStatsBoxes(): void {
  let queueEmpty = false;
  while (!queueEmpty) {
    const item = statsBoxQueue.shift();
    if (isNil(item)) {
      queueEmpty = true;
    } else {
      const {container, args} = item;
      container.drawStatsBox(...args);
    }
  }
}

/**
 * Sends an announcement to the player through the chat.
 * @param msg The message to be announced.
 * @param color The text colour to use (default "#fc9547" - light brown).
 */
export function chatAnnounce(msg: string, color: string = CINDER_COLOUR): void {
  chatDiv.classList.remove("hidden");
  appendChatAnnouncement("[Cinder]: " + msg, color);
}


/**
 * List of the expected number of petals needed to craft rarity (n + 1) from n.
 */
export const theoryCraft: number[] = [];

/**
 * Outputs the number of `newRarity` petals that would have equivalent value to
 * the given `amount` of `oldRarity` petals, according to the exchange rates
 * given by {@linkcode theoryCraft}.
 */
export function convertPetalValue(
  amount: number, oldRarity: Rarity, newRarity: Rarity
): number {
  // Some safeguards
  if (oldRarity > MAX_PETAL_RARITY) {
    return Infinity;
  }
  if (newRarity > MAX_PETAL_RARITY) {
    return 0;
  }

  while (oldRarity < newRarity) {
    amount /= theoryCraft[oldRarity];
    oldRarity++;
  }
  while (oldRarity > newRarity) {
    amount *= theoryCraft[oldRarity - 1];
    oldRarity--;
  }
  return amount;
}

/**
 * Determines whether or not the user is making an in-game input (i.e., the
 * player is currently in-game and is not typing in the chat).
 */
export function isInGameInput(
  e: KeyboardEvent
): boolean {
  if (e.repeat) {
    e.preventDefault();
  }
  return unsafeWindow.state === "game" && !inputHandler.chatOpen && !e.repeat;
}

/**
 * Recursively constructs a deep copy of the given object, up to a given depth.
 * This means that the returned object's fields/properties are also a copy of
 * the original object's fields/properties, up to the given depth.
 * 
 * This function also tries to copy the object's prototype, which gives it
 * access to its methods as usual.
 * 
 * Warning: This function is NOT stable. JS has many, many different types of
 * objects, and I have not accounted for them all.
 * 
 * @param obj The object to copy.
 * @param depth Default: 5. A depth of 0 returns the object without copying.
 */
export function deepCopy<T>(obj: T, depth = 5): T {
  if (depth === 0) {
    return obj;
  }
  if (obj === null) {
    return obj;
  }
  if (typeof obj === "object") {
    try {
      if (Array.isArray(obj)) {
        return obj.map(item => deepCopy(item, depth - 1)) as T;
      } else {
        const ret = Object.create(Object.getPrototypeOf(obj));
        for (let key in obj) {
          // Do not deepCopy images, it destroys them.
            ret[key] = deepCopy(obj[key], depth - 1);
        }
        return ret;
      }
    } catch (e) {
      console.warn("Failed to copy:", obj);
      return obj;
    }
  } else {
    return obj;
  }
}