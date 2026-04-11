/**
 * This feature widens certain stats boxes to properly fit some displayed
 * values to the right of the stats box's name, if those displays did not fit
 * yet.
 */
export function widerMobStatsBoxes(): void {
  const originalGenerateDesc = StatsBox.prototype.generateDesc;
  StatsBox.prototype.generateDesc = function(min: number, max: number) {
    const dimensions = originalGenerateDesc.apply(this, [min, max]);
    
    // Leave at least 175 units of space after the stats box's name text, so it
    // can fit the amount counter, the mob's XP value, some padding, etc..
    ctx.font = `900 ${1.2 * 22.5}px Ubuntu`;
    const textWidth = ctx.measureText(this.name).width;
    dimensions.width = Math.max(dimensions.width, textWidth + 175);
    
    // Re-apply hard bounds
    dimensions.width = Math.max(Math.min(dimensions.width, max), min);

    return dimensions;
  }
}