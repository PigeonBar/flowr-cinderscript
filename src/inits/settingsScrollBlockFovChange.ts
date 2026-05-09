import { cinderSettingsMenu } from "../settings/settingsMenu";

/**
 * This initializer blocks the FOV from accidentally being changed by scroll
 * inputs when the user is trying to scroll the settings menu.
 */
export function blockFovChangeFromSettingsScroll(): void {
  let previousFrameFov = fov;

  const originalRenderGame = renderGame;
  renderGame = (dt: number) => {
    // Restore previous frame's fov if fov could have changed due to scrolling
    if (cinderSettingsMenu.hasRecentMouseScroll()) {
      fov = previousFrameFov;
    }

    // Record the fov to prepare for the next frame
    previousFrameFov = fov;

    originalRenderGame(dt);
  }
}