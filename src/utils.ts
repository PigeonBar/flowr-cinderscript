const statsBoxQueue = [] as {
  container: PetalContainer;
  args: Parameters<PetalContainer["drawStatsBox"]>;
}[];

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
) {
  statsBoxQueue.push({container, args});
}

/**
 * Draws all of the queued stats boxes, then removes them from the queue.
 */
export function drawQueuedStatsBoxes() {
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