import { isNil } from "../utils";


/**
 * List of functions to edit data that the websocket is sending to the server.
 */
export const wsDataEditing: ((data: any) => void)[] = [];

/**
 * This function injects some code into `ws.send` so that we can edit any data
 * that the websocket is sending to the server.
 * 
 * If the data is deleted by setting it to `undefined`, then this server
 * communication will be aborted, and nothing will be sent to the server.
 */
export function allowWsDataEditing(): void {
  function injectWsSend() {
    const originalSend = ws.send;
    ws.send = function(data) {
      // Unpack the data, edit it, repack it, then send it
      let rawData = msgpackr.unpack(data) as unknown;
      for (let fn of wsDataEditing) {
        rawData = fn(rawData);

        // If the data got deleted, return immediately
        if (isNil(rawData)) {
          return;
        }
      }
      
      // Finally, send the edited data to the server
      originalSend.apply(ws, [msgpackr.pack(rawData)]);
    }
  }

  const originalInitWS = initWS;
  initWS = function() {
    // First, initialize the websocket as usual
    originalInitWS();

    // Then, when the websocket sends data, we inject some code to edit it
    injectWsSend();
  }

  // Also inject some code into the initial ws, in case it was already created
  if (!isNil(ws)) {
    injectWsSend();
  }
}

/**
 * Adds another function to edit data that the client is sending to the server.
 * @param fn A function that returns `data`, with or without modifications.
 */
export function addWsDataEditing(fn: (data: unknown) => any): void {
  wsDataEditing.push(fn);
}

/**
 * Deletes all queued chat messages in {@linkcode wsMsgQueue}. This function is
 * meant to help with disabling certain chat messages in the first few seconds
 * of each run.
 */
export function deleteQueuedChatMsgs(): void {
  wsMsgQueue = wsMsgQueue.filter(isNotChatMessage);
}

/**
 * A helper function to determine whether or not the given message (to be
 * delivered to the server) is a chat message from the player.
 * 
 * Chat messages have the following format: `["c", "<Chat message>"]`.
 */
export function isNotChatMessage(data: unknown): boolean {
  return !(Array.isArray(data) && data[0] === "c");
}