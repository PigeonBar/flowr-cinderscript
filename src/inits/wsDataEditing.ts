import { isNil } from "../utils";


/**
 * List of functions to edit data that the websocket is sending to the server.
 */
export const wsDataEditing: ((data: any) => void)[] = [];

/**
 * This function injects some code into `ws.send` so that we can edit any data
 * that the websocket is sending to the server.
 */
export function allowWsDataEditing(): void {
  function injectWsSend() {
    const originalSend = ws.send;
    ws.send = function(data) {
      // Unpack the data, edit it, repack it, then send it
      const rawData = msgpackr.unpack(data);
      for (let fn of wsDataEditing) {
        fn(rawData);
      }
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
 * @param fn A function that modifies `data` and returns nothing.
 */
export function addWsDataEditing(fn: (data: any) => void) {
  wsDataEditing.push(fn);
}