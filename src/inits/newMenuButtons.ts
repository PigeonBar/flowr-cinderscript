import { cinderChangelog } from "../changelog";
import { CINDER_BORDER_COLOUR, CINDER_COLOUR, LIGHT_CINDER_COLOUR } from "../constants/constants";
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
  cinderSettingsButton.className = "cinderMenuButton";
  cinderSettingsButton.appendChild(settingsImage);
  cinderSettingsButton.onclick = () => {
    cinderSettingsMenu.toggle();
  }
  buttonList?.appendChild(cinderSettingsButton);
  
  // The GitHub icon to add to the GitHub link button
  // Icon sourced from https://brand.github.com/foundations/logo
  const githubIcon = new Image(35, 35);
  githubIcon.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik01Ni43OTM3IDg0Ljk2ODhDNDQuNDE4NyA4My40Njg4IDM1LjcgNzQuNTYyNSAzNS43IDYzLjAzMTNDMzUuNyA1OC4zNDM4IDM3LjM4NzUgNTMuMjgxMyA0MC4yIDQ5LjkwNjNDMzguOTgxMiA0Ni44MTI1IDM5LjE2ODcgNDAuMjUgNDAuNTc1IDM3LjUzMTNDNDQuMzI1IDM3LjA2MjUgNDkuMzg3NSAzOS4wMzEzIDUyLjM4NzUgNDEuNzVDNTUuOTUgNDAuNjI1IDU5LjcgNDAuMDYyNSA2NC4yOTM3IDQwLjA2MjVDNjguODg3NSA0MC4wNjI1IDcyLjYzNzUgNDAuNjI1IDc2LjAxMjUgNDEuNjU2M0M3OC45MTg3IDM5LjAzMTMgODQuMDc1IDM3LjA2MjUgODcuODI1IDM3LjUzMTNDODkuMTM3NSA0MC4wNjI1IDg5LjMyNSA0Ni42MjUgODguMTA2MiA0OS44MTI1QzkxLjEwNjIgNTMuMzc1IDkyLjcgNTguMTU2MyA5Mi43IDYzLjAzMTNDOTIuNyA3NC41NjI1IDgzLjk4MTIgODMuMjgxMyA3MS40MTg3IDg0Ljg3NUM3NC42MDYyIDg2LjkzNzUgNzYuNzYyNSA5MS40Mzc1IDc2Ljc2MjUgOTYuNTkzOEw3Ni43NjI1IDEwNi4zNDRDNzYuNzYyNSAxMDkuMTU2IDc5LjEwNjIgMTEwLjc1IDgxLjkxODcgMTA5LjYyNUM5OC44ODc1IDEwMy4xNTYgMTEyLjIgODYuMTg3NSAxMTIuMiA2NS4xODc1QzExMi4yIDM4LjY1NjMgOTAuNjM3NSAxNyA2NC4xMDYyIDE3QzM3LjU3NSAxNyAxNi4yIDM4LjY1NjIgMTYuMiA2NS4xODc1QzE2LjIgODYgMjkuNDE4NyAxMDMuMjUgNDcuMjMxMiAxMDkuNzE5QzQ5Ljc2MjUgMTEwLjY1NiA1Mi4yIDEwOC45NjkgNTIuMiAxMDYuNDM4TDUyLjIgOTguOTM3NUM1MC44ODc1IDk5LjUgNDkuMiA5OS44NzUgNDcuNyA5OS44NzVDNDEuNTEyNSA5OS44NzUgMzcuODU2MiA5Ni41IDM1LjIzMTIgOTAuMjE4OEMzNC4yIDg3LjY4NzUgMzMuMDc1IDg2LjE4NzUgMzAuOTE4NyA4NS45MDYzQzI5Ljc5MzcgODUuODEyNSAyOS40MTg3IDg1LjM0MzggMjkuNDE4NyA4NC43ODEzQzI5LjQxODcgODMuNjU2MyAzMS4yOTM3IDgyLjgxMjUgMzMuMTY4NyA4Mi44MTI1QzM1Ljg4NzUgODIuODEyNSAzOC4yMzEyIDg0LjUgNDAuNjY4NyA4Ny45Njg4QzQyLjU0MzcgOTAuNjg3NSA0NC41MTI1IDkxLjkwNjMgNDYuODU2MiA5MS45MDYzQzQ5LjIgOTEuOTA2MyA1MC43IDkxLjA2MjUgNTIuODU2MiA4OC45MDYzQzU0LjQ1IDg3LjMxMjUgNTUuNjY4NyA4NS45MDYzIDU2Ljc5MzcgODQuOTY4OFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=";
  githubIcon.id = "githubIcon";
  githubIcon.draggable = false;

  // The GitHub link button
  const githubButton = document.createElement("div");
  githubButton.className = "cinderMenuButton";
  const githubLink = document.createElement("a");
  githubLink.href = "https://github.com/PigeonBar/flowr-cinderscript";
  githubLink.target = "_blank";
  githubLink.title = "Check out Cinderscript on GitHub!";
  githubLink.appendChild(githubIcon);
  githubButton.appendChild(githubLink);
  buttonList?.appendChild(githubButton);

  // The "paper scroll icon" to add to the changelog button
  const changelogImage = new Image(24, 24);
  changelogImage.src = `gfx/scroll.png?v=${ver}`;
  changelogImage.draggable = false;

  // The changelog button
  const cinderChangelogButton = document.createElement("div");
  cinderChangelogButton.className = "cinderMenuButton";
  cinderChangelogButton.appendChild(changelogImage);
  cinderChangelogButton.onclick = () => {
    cinderChangelog.toggle();
  }
  buttonList?.appendChild(cinderChangelogButton);

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

    #githubIcon {
      margin-top: 3px;
    }

    .cinderMenuButton {
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
    
    .cinderMenuButton:hover {
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