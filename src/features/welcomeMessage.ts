import { settings } from "../settings/settingsManager";
import { chatAnnounce } from "../utils";

/**
 * This feature displays a "Welcome" announcement to direct new users to the
 * settings menu. This behaviour continues until the user disables this
 * announcement in the settings menu.
 */
export function displayWelcomeMessage(): void {
  if (!settings.get("disableWelcomeMessage")) {
    chatAnnounce(
      "Welcome to Cinderscript! If this is your first time using this " +
      "script, please take some time to familiarize yourself with its " +
      "settings, keybinds, and features.\n\n" +
      "You can disable this message at (Settings > Disable Welcome Message), " +
      "located at the bottom of the settings menu."
    );
  }
}