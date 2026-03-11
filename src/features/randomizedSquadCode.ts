import { unsafeWindow } from "$";
import { settings } from "../settings/settingsManager";
import { chatAnnounce } from "../utils";

/**
 * This feature lets users generate a random 6-character hexadecimal squad code
 * (0-9, a-f) by starting a private squad without entering a squad code.
 */
export function addRandomizedSquadCodes() {
  const originalSendRoomRequest = sendRoomRequest;
  sendRoomRequest = function(msg) {
    // If user is starting a private squad without entering a squad code
    if (msg.findPrivate === true && msg.squadCode === "") {
      const newCode = randomSquadCode();
      msg.squadCode = newCode;
      if (settings.get("autoCopyCodes")) {
        navigator.clipboard.writeText(newCode);
        chatAnnounce("Code copied to clipboard! (" + newCode + ")");
      } else {
        chatAnnounce("Random code generated! (" + newCode + ")");
      }
    }
    // Now send the room request as usual
    originalSendRoomRequest(msg);
  }

  const originalPrompt = prompt;
  unsafeWindow.prompt = function(msg?: string, _def?: string): string | null {
    // Change msg to tell user that they can generate a randomized code
    if (msg === "Enter Private Squad Code") {
      msg = "Enter private squad code" +
        " (leave empty to generate a random code):";
    }
    return originalPrompt(msg, _def);
  }
}

/**
 * 
 * @returns A random 6-character hexadecimal squad code.
 */
function randomSquadCode(): string {
  let squadCode = "";
  let hasLetter = false;
  for (let i = 0; i < 6; i++) {
    const roll = Math.floor(Math.random() * 16);
    if (roll < 10) {
      // Digits 0-9
      squadCode += String.fromCharCode("0".charCodeAt(0) + roll);
    } else {
      // Chars a-f
      squadCode += String.fromCharCode("a".charCodeAt(0) + roll - 10);
      hasLetter = true;
    }
  }

  // Flowr server does not allow numbers-only codes, so reroll if needed
  return hasLetter ? squadCode : randomSquadCode();
}