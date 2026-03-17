import { unsafeWindow } from "$";
import { addKeybindInstruction } from "../inits/keybindHandling";
import { addWsDataEditing } from "../inits/wsDataEditing";
import { settings } from "../settings/settingsManager";
import { chatAnnounce, isNil } from "../utils";

/**
 * This feature lets the player invert attack and defend inputs. When attack or
 * defend inputs are inverted, then the player will be in that state by
 * default, and the player can exit the state by pressing the respective input.
 * 
 * This feature works for both keyboard inputs and mouse inputs.
 */
export function enableInvertAttackAndDefend() {
  /**
   * Whether the player is inputting "Attack", before processing inversion
   */
  let rawAttacking = false;
  /**
   * Whether the player is inputting "Defend", before processing inversion
   */
  let rawDefending = false;

  /**
   * Sets the client-side flower's attacking state, after processing inversion.
   * 
   * @returns The flower's attacking state, after processing inversion.
   */
  function updateClientAttack(): boolean {
    const newAttacking = (rawAttacking !== settings.get("invertAttack"));
    if (!isNil(unsafeWindow.selfId)) {
      const player = room.flowers[unsafeWindow.selfId];
      if (!isNil(player)) {
        player.attacking = newAttacking;
      }
    }
    return newAttacking;
  }

  /**
   * Sets the client-side flower's defending state, after processing inversion.
   * 
   * @returns The flower's defending state, after processing inversion.
   */
  function updateClientDefend(): boolean {
    const newDefending = (rawDefending !== settings.get("invertDefend"));
    if (!isNil(unsafeWindow.selfId)) {
      const player = room.flowers[unsafeWindow.selfId];
      if (!isNil(player)) {
        player.defending = newDefending;
      }
    }
    return newDefending;
  }

  addWsDataEditing((data: any) => {
    if (!isNil(data.attack)) {
      rawAttacking = data.attack;
      data.attack = updateClientAttack();
    } else if (data[0] === "a") {
      rawAttacking = data[1];
      data[1] = updateClientAttack();
    } else if (!isNil(data.defend)) {
      rawDefending = data.defend;
      data.defend = updateClientDefend();
    } else if (data[0] === "d") {
      rawDefending = data[1];
      data[1] = updateClientDefend();
    }
  });

  // Add keybind instructions for invert attack/defend inputs in-game
  addKeybindInstruction(
    {type: "settings", key: "keybindInvertAttack", fn: () => {
      const newInvertAttack = !settings.get("invertAttack");
      settings.set("invertAttack", newInvertAttack);
      chatAnnounce(
        "Invert Attack set to " + (newInvertAttack ? "ON" : "OFF") + "!",
        "#ffbfbf", // Pink
      );
      send({attack: rawAttacking});
    }}
  );
  addKeybindInstruction(
    {type: "settings", key: "keybindInvertDefend", fn: () => {
      const newInvertDefend = !settings.get("invertDefend");
      settings.set("invertDefend", newInvertDefend);
      chatAnnounce(
        "Invert Defend set to " + (newInvertDefend ? "ON" : "OFF") + "!",
        "#bfbfff", // Light blue
      );
      send({defend: rawDefending});
    }}
  );

  // Also reset inputs and process input inversion when entering a game
  const originalEnterGame = enterGame;
  enterGame = function() {
    originalEnterGame();

    send({attack: false});
    send({defend: false});
  }
}