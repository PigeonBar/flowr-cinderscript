const statsBoxQueue = [] as {
  container: PetalContainer;
  args: Parameters<PetalContainer["drawStatsBox"]>;
}[];

// Cinderleaf petal's colour
const CINDER_COLOUR = "#fc9547"

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