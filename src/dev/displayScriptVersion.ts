import { version } from "../../package.json";
import { LIGHT_CINDER_COLOUR } from "../constants/constants";

/**
 * This feature displays this script's version number next to the base game's
 * version info when the base game's "Render Debug" setting is turned on.
 */
export function addScriptVersionToDebugInfo() {
  const originalRenderDebug = renderDebug;
  renderDebug = () => {
    // Note down the base game's debug text
    let baseDebugText = "";
    let baseDebugX = 0;
    let baseDebugY = 0;
    const originalFillText = ctx.fillText;
    ctx.fillText = function(
      text: string, x: number, y: number, maxWidth?: number
    ) {
      baseDebugText = text;
      baseDebugX = x;
      baseDebugY = y;
      originalFillText.apply(this, [text, x, y, maxWidth]);
    }

    originalRenderDebug();
    ctx.fillText = originalFillText;

    // Display this script's version number
    const versionText = `Cinderscript: v${version}, `;
    const x = baseDebugX - ctx.measureText(baseDebugText).width;
    const y = baseDebugY;
    ctx.fillStyle = LIGHT_CINDER_COLOUR;
    ctx.strokeText(versionText, x, y);
    ctx.fillText(versionText, x, y);
  }
}