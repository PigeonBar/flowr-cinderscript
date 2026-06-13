import { unsafeWindow } from "$";
import { SETTINGS_OPTION_HEIGHT } from "../constants/constants";
import { settings } from "../settings/settingsManager";
import { cinderSettingsMenu } from "../settings/settingsMenu";
import { chatAnnounce, isNil } from "../utils";

export let flowrMod: FlowrMod | undefined;

/**
 * This initializer sets {@linkcode flowrMod} as a pointer to window.flowrMod
 * if Flowrscript is currently active.
 * 
 * This function also outputs a warning announcement if Flowrscript starts
 * loading after Cinderscript has already started running, since this scenario
 * can cause issues with Flowrscript overwriting Cinderscript's code.
 */
export function initFlowrscriptPointer(): void {
  if (!isNil(unsafeWindow.flowrMod)) {
    flowrMod = unsafeWindow.flowrMod;
  } else {
    if (settings.get("flowrscriptLoadWaitTime") >= 3) {
      // Display tip to prevent users from accidentally using unnecessarily
      // high waiting times
      chatAnnounce("Tip - If you are not using any variant of Flowrscript, " +
        "please feel free to decrease this script's waiting time at " +
        "(Settings > Performance > Flowrscript Load Wait Time)."
      );
    }

    const interval = setInterval(() => {
      if (!isNil(unsafeWindow.flowrMod)) {
        clearInterval(interval);

        // Display warning message if this script did not successfully wait for
        // Flowrscript to finish loading
        chatAnnounce("Warning - An issue was detected while trying to load " +
          "Cinderscript after Flowrscript. Please increase this script's " +
          "waiting time at (Settings > Performance > Flowrscript Load " +
          "Wait Time), then reload the page and see if that fixes the " +
          "issue. If not, then please feel free to report this issue. Sorry " +
          "for the inconvenience."
        );

        // Also open the settings menu, since the settings button breaks in
        // these situations
        if (!cinderSettingsMenu.active) {
          cinderSettingsMenu.toggle();
        }

        // Scroll the settings menu to the "Performance" section
        cinderSettingsMenu.scroll = cinderSettingsMenu.options.findIndex(
          option => option.isSectionHeading() && option.text === "Performance"
        ) * SETTINGS_OPTION_HEIGHT;
        
        // Finally, restore some of the settings menu's functionality that also
        // breaks in these situations
        const originalRenderMenu = renderMenu;
        renderMenu = (dt: number) => {
          originalRenderMenu(dt);
          cinderSettingsMenu.x = 110;
          cinderSettingsMenu.draw();
        }
        const originalOnMouseDown = unsafeWindow.onmousedown;
        unsafeWindow.onmousedown = (e: MouseEvent) => {
          originalOnMouseDown?.apply(unsafeWindow, [e]);

          if (unsafeWindow.connected === true) {
            cinderSettingsMenu.mouseDown({x: mouse.canvasX, y: mouse.canvasY});
          }
        }
        const originalOnMouseUp = unsafeWindow.onmouseup;
        unsafeWindow.onmouseup = (e: MouseEvent) => {
          originalOnMouseUp?.apply(unsafeWindow, [e]);

          if (unsafeWindow.connected === true) {
            cinderSettingsMenu.mouseUp();
          }
        }
      }
    }, 1000);
  }
}