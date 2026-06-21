import { isNil } from "../utils";

export type ChatHotkey = { chatMsg: string, keybind: string };

export type ChatHotkeys = ChatHotkey[];

/**
 * A helper function to validate whether or not the given item is a
 * {@linkcode ChatHotkey}.
 */
function isChatHotkey(obj: any): obj is ChatHotkey {
  return !isNil(obj)
    && typeof obj === "object"
    && typeof obj.chatMsg === "string"
    && typeof obj.keybind === "string";
}

/**
 * A helper function to validate whether or not the given item is a
 * {@linkcode ChatHotkeys} array.
 */
export function isChatHotkeysArray(obj: any): obj is ChatHotkeys {
  if (!Array.isArray(obj)) {
    return false;
  }
  
  for (let item of obj) {
    if (!isChatHotkey(item)) {
      return false;
    }
  }

  return true;
}