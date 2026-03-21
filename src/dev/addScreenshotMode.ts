import { CINDER_COLOUR } from "../constants/constants";
import { deepCopy, isInGameInput, isNil } from "../utils";

/**
 * This feature lets the script developer enter Screenshot Mode. This works by
 * copying the current room state and rendering this copy whenever
 * {@linkcode renderGame} is called, and then using the original room to
 * process game state updates after rendering is done.
 * 
 * Warning: This function is NOT stable, use it at your own risk! This function
 * is meant to help the script developer make visual comparisons when designing
 * visual features.
 */
export function addScreenshotMode() {
  const originalRenderGame = renderGame;
  const originalOnMessage = ws.onmessage;
  const originalDeadMenuDraw = deadMenu.draw;

  const queuedMessages: MessageEvent[] = [];

  let screenshotMode = false;
  let screenshotRoom: Room;
  let runningRoom: Room;

  function toggleScreenshotMode() {
    screenshotMode = !screenshotMode;
    if (screenshotMode) {
      // When screenshot mode is on, do not draw the death menu
      deadMenu.draw = () => {};

      // When turning on screenshot mode, copy the room's state
      screenshotRoom = deepCopy(room);
      runningRoom = room;
      renderGame = (dt) => {
        // Queue messages to be handled after rendering is done
        ws.onmessage = (data) => {queuedMessages.push(data)};

        chatDiv.classList.add("hidden");

        room = screenshotRoom;

        originalRenderGame(dt);

        // "Screenshot Mode" text
        ctx.save();
        ctx.lineWidth = 6;
        ctx.font = "900 32px Ubuntu";
        ctx.textAlign = "right";
        ctx.textBaseline = "top";
        ctx.fillStyle = CINDER_COLOUR;
        ctx.strokeStyle = "black";
        const text = "Screenshot Mode";
        ctx.strokeText(text, canvas.w - 30, 30);
        ctx.fillText(text, canvas.w - 30, 30);
        ctx.restore();

        room = runningRoom;

        // Now handle all queued messages
        let data = queuedMessages.shift();
        while (!isNil(data)) {
          originalOnMessage?.apply(ws, [data]);
          data = queuedMessages.shift();
        }
        ws.onmessage = originalOnMessage;
      }
    } else {
      // Turn off screenshot mode by restoring everything
      room = runningRoom;

      chatDiv.classList.remove("hidden");
      deadMenu.draw = originalDeadMenuDraw;
      renderGame = originalRenderGame;

      // Process queued messages in case there are any
      let data = queuedMessages.shift();
      while (!isNil(data)) {
        originalOnMessage?.apply(ws, [data]);
        data = queuedMessages.shift();
      }
      ws.onmessage = originalOnMessage;
    }
  }
  
  // Toggle screenshot mode when user presses the corresponding key
  const originalHandleKey = inputHandler.handleKey;
  inputHandler.handleKey = function(e) {
    // First, run all the usual code for handling inputs
    originalHandleKey.apply(inputHandler, [e]);
    if (!isInGameInput(e)) {
      return;
    }

    if (e.code === localStorage.getItem("cinderDevScreenshotMode") &&
        e.code.length > 0 &&
        e.type === "keydown"
    ) {
      toggleScreenshotMode();
    }
  }
}