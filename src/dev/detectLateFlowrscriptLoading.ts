import { unsafeWindow } from "$";
import { chatAnnounce, isNil } from "../utils";

/**
 * This function outputs a warning announcement if Flowrscript starts loading
 * after Cinderscript has already started running, since this scenario can
 * cause issues with Flowrscript overwriting Cinderscript's code.
 */
export function detectLateFlowrscriptLoading(): void {
  if (isNil(unsafeWindow.flowrMod)) {
    const interval = setInterval(() => {
      if (!isNil(unsafeWindow.flowrMod)) {
        chatAnnounce("Warning - An issue was detected while trying to load " +
          "Cinderscript after Flowrscript. Please report this if this is " +
          "regularly happening to you."
        );
        clearInterval(interval);
      }
    }, 1000);
  }
}