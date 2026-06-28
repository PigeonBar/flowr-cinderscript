import { addKeybindInstruction } from "../inits/keybindHandling";
import type { BooleanOption } from "../settings/settingsOptions";
import { chatAnnounce, isNil } from "../utils";

/**
 * The movement directions that the user is pressing on their keyboard. This
 * continues updating even if the [Mouse Movement] setting is turned on.
 * 
 * This array's indices correspond to movement directions according to
 * {@linkcode directionToIdMap}.
 */
const keyboardDirections = [0, 0, 0, 0];

/**
 * This feature adds a keybind to let the player switch controls between using
 * mouse movement and using keyboard movement.
 * 
 * Thank you to Applepie for suggesting this feature!
 */
export function allowTogglingMouseMovement(): void {
  // Find the [Mouse Movement] setting in the base game's settings menu
  const movementSetting = settingsMenu.options.find(
    option => (option as BooleanOption).name === "Mouse Movement"
  ) as BooleanOption | undefined;

  // Add keybind instructions to update `keyboardDirections`
  addKeybindInstruction({
    type: "always",
    keyType: "keydown",
    inGame: true,
    inMenu: true,
    fn: (e: KeyboardEvent) => {
      const direction = keyCodes[e.code];
      if (!isNil(direction)) {
        keyboardDirections[directionToIdMap[direction]] = 1;
      }
    }
  });
  addKeybindInstruction({
    type: "always",
    keyType: "keyup",
    inGame: true,
    inMenu: true,
    fn: (e: KeyboardEvent) => {
      const direction = keyCodes[e.code];
      if (!isNil(direction)) {
        keyboardDirections[directionToIdMap[direction]] = 0;
      }
    }
  });

  // Enable the keybind to toggle mouse movement
  addKeybindInstruction({
    type: "settings",
    settingsKey: "keybindToggleMouseMovement",
    fn: () => {
      mouseMovement = !mouseMovement;
      localStorage.setItem("mouseMovement", `${mouseMovement}`);

      // Also update the base game's settings menu
      if (!isNil(movementSetting)) {
        movementSetting.state = mouseMovement;
      }

      if (mouseMovement) {
        chatAnnounce("Now using MOUSE movement!");

        // Also immediately update the player's motion to match their mouse pos
        inputHandler.handleMouse(new MouseEvent(
          "mousemove", { clientX: mouse.x, clientY: mouse.y },
        ));
      } else {
        chatAnnounce("Now using KEYBOARD movement!");

        // Also immediately update the player's motion to match keys pressed
        latestInput = [...keyboardDirections];
        previousInput = [...keyboardDirections];
        send(keyboardDirections);
      }
    }
  });
}