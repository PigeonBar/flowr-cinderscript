import { MAX_PETAL_RARITY } from "./constants";
import { isNil, theoryCraft } from "./utils";

/**
 * List of functions to edit data that the websocket is sending to the server.
 */
const wsDataProcessing: ((data: any) => void)[] = [];

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
 * This function injects some code into `ws.send` so that we can edit any data
 * that the websocket is sending to the server.
 */
export function allowWsDataProcessing(): void {
  function injectWsSend() {
    const originalSend = ws.send;
    ws.send = function(data) {
      // Unpack the data, edit it, repack it, then send it
      const rawData = msgpackr.unpack(data);
      for (let fn of wsDataProcessing) {
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
export function addWsDataProcessing(fn: (data: any) => void) {
  wsDataProcessing.push(fn);
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