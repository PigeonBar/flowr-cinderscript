import { CINDER_BORDER_COLOUR, CINDER_COLOUR, LIGHT_CINDER_COLOUR } from "../constants";
import { cinderSettingsMenu } from "../settings/settingsMenu";

/**
 * This initializer adds new buttons to the main menu to accommodate this
 * script's new menus.
 */
export function addNewMenuButtons() {
  // A horizontal separator line
  const menuSeparatorLine = document.createElement("div");
  menuSeparatorLine.id = "menuSeparatorLine";
  const buttonList = changelogButton.parentElement;
  buttonList?.appendChild(menuSeparatorLine);

  // The "gear icon" to add to the settings button
  const settingsImage = new Image(35, 35);
  settingsImage.src = `gfx/gear.png?v=${ver}`;
  settingsImage.draggable = false;

  // The new settings button
  const cinderSettingsButton = document.createElement("div");
  cinderSettingsButton.id = "cinderSettingsButton";
  cinderSettingsButton.appendChild(settingsImage);
  cinderSettingsButton.onclick = () => {
    cinderSettingsMenu.toggle();
  }
  buttonList?.appendChild(cinderSettingsButton);

  // Adding CSS styling to the settings button (similar to the other buttons)
  const styles = `
    #menuSeparatorLine {
      background-color: ${CINDER_BORDER_COLOUR};
      margin-left: 10px;
      margin-top: 10px;
      width: 41px;
      height: 5px;
      border-radius: 3px;
    }

    #cinderSettingsButton {
      border-color: ${CINDER_BORDER_COLOUR};
      border-style: solid;
      border-width: 3px;
      background-color: ${CINDER_COLOUR};
      border-radius: 8px;
      margin-left: 10px;
      margin-top: 10px;
      width: 35px;
      height: 35px;
      transition: background-color 0.1s;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    #cinderSettingsButton:hover {
      cursor: pointer;
      background-color: ${LIGHT_CINDER_COLOUR};
    }
    
    #changelogButton:hover {
      cursor: pointer;  /* I think the Flowr devs forgot to add this */
    }
  `;
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}