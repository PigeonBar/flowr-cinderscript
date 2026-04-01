import { unsafeWindow } from "$";
import { CINDER_COLOUR, MAX_PETAL_RARITY } from "./constants/constants";
import { MENU_LIST } from "./constants/menuLists";
import { Rarity } from "./enums";

export type nil = null | undefined;

/**
 * @returns `true` if `arg` is `null` or `undefined`, `false` otherwise.
 */
export function isNil(arg: any): arg is nil {
  return arg === undefined || arg === null;
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
 * Determines the rarity index corresponding to the given rarity name.
 */
export function rarityToIndex(rarity: string): Rarity {
  return Rarity[rarity.toUpperCase() as keyof typeof Rarity];
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

/**
 * A helper function that determines whether a menu is a {@linkcode TopMenu}
 * (which uses the field `active`) or a {@linkcode BottomMenu} (which uses the
 * field `menuActive`).
 */
export function isTopMenu(menu: Menu): menu is TopMenu {
  return Object.hasOwn(menu, "active");
}

/**
 * Determines whether the cursor is currently hovering over any menu.
 */
export function mouseOnMenu() {
  if (unsafeWindow.state !== "menu") {
    return false;
  }

  for (let menu of MENU_LIST) {
    if (mouseInBox(
      {
        x: mouse.canvasX,
        y: mouse.canvasY,
      },
      {
        x: isTopMenu(menu) ? menu.x : 130,
        y: menu.renderY,
        w: menu.w,
        h: menu.h,
      }
    )) {
      return true;
    }
  }

  return false;
}