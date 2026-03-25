import { CINDER_BORDER_COLOUR, CINDER_COLOUR, LIGHT_CINDER_COLOUR } from "../constants/constants";
import { settings } from "../settings/settingsManager";
import { isNil } from "../utils";

// icons/inventory-expand.svg
const expandIcon = new Image();
expandIcon.src = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB3aWR0aD0iMjkuOTk5OTkybW0iCiAgIGhlaWdodD0iMzAuMDAwMDExbW0iCiAgIHZpZXdCb3g9IjAgMCAyOS45OTk5OTIgMzAuMDAwMDExIgogICB2ZXJzaW9uPSIxLjEiCiAgIGlkPSJzdmcxIgogICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxkZWZzCiAgICAgaWQ9ImRlZnMxIiAvPgogIDxnCiAgICAgaWQ9ImxheWVyMSIKICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNzQsLTE1NC4wMDAwMSkiPgogICAgPHBhdGgKICAgICAgIHN0eWxlPSJmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOiNmZmZmZmY7c3Ryb2tlLXdpZHRoOjAuMDE7c3Ryb2tlLWxpbmVjYXA6c3F1YXJlO3N0cm9rZS1taXRlcmxpbWl0OjA7cGFpbnQtb3JkZXI6bWFya2VycyBzdHJva2UgZmlsbCIKICAgICAgIGlkPSJwYXRoMSIKICAgICAgIGQ9Ik0gNzcuMTA4NTg4LDExNS40NDI5OSAzMi41NTEzNTgsMTAyLjc2MDQyIDY1LjgxMzQwMSw3MC41MTQwMTUgWiIKICAgICAgIHRyYW5zZm9ybT0ibWF0cml4KDAuMTY2OTA4LC0wLjA2Nzg5NDA2LDAuMTc2MjAyMDEsMC4yMzI0MzMzOCw1Ni41OTE3MzIsMTU2LjMyNDEpIiAvPgogICAgPHBhdGgKICAgICAgIHN0eWxlPSJmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOiNmZmZmZmY7c3Ryb2tlLXdpZHRoOjAuMDE7c3Ryb2tlLWxpbmVjYXA6c3F1YXJlO3N0cm9rZS1taXRlcmxpbWl0OjA7cGFpbnQtb3JkZXI6bWFya2VycyBzdHJva2UgZmlsbCIKICAgICAgIGlkPSJwYXRoMS04IgogICAgICAgZD0iTSA3Ny4xMDg1ODgsMTE1LjQ0Mjk5IDMyLjU1MTM1OCwxMDIuNzYwNDIgNjUuODEzNDAxLDcwLjUxNDAxNSBaIgogICAgICAgdHJhbnNmb3JtPSJtYXRyaXgoLTAuMTY2OTA4LDAuMDY3ODk0MDYsLTAuMTc2MjAyMDEsLTAuMjMyNDMzMzgsMTIxLjQwODAzLDE4MS42NzYxMSkiIC8+CiAgICA8cmVjdAogICAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtmaWxsLW9wYWNpdHk6MTtzdHJva2U6I2ZmZmZmZjtzdHJva2Utd2lkdGg6MC4wMTQwNzQzO3N0cm9rZS1saW5lY2FwOnNxdWFyZTtzdHJva2UtbWl0ZXJsaW1pdDowO3BhaW50LW9yZGVyOm1hcmtlcnMgc3Ryb2tlIGZpbGwiCiAgICAgICBpZD0icmVjdDIiCiAgICAgICB3aWR0aD0iNC4xMTg1NTg0IgogICAgICAgaGVpZ2h0PSIxOC4zNTYzMzMiCiAgICAgICB4PSIxODAuNDYwNDUiCiAgICAgICB5PSI0Ny4xODQyODQiCiAgICAgICB0cmFuc2Zvcm09Im1hdHJpeCgwLjcwNzcyMTA1LDAuNzA2NDkxOTcsLTAuNzA4MTgxMzMsMC43MDYwMzA2LDAsMCkiIC8+CiAgICA8cmVjdAogICAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtmaWxsLW9wYWNpdHk6MDtzdHJva2U6I2ZmZmZmZjtzdHJva2Utd2lkdGg6MC4wMTg3MzQ7c3Ryb2tlLWxpbmVjYXA6c3F1YXJlO3N0cm9rZS1taXRlcmxpbWl0OjA7cGFpbnQtb3JkZXI6bWFya2VycyBzdHJva2UgZmlsbCIKICAgICAgIGlkPSJyZWN0MyIKICAgICAgIHdpZHRoPSIyOS45ODEyNjYiCiAgICAgICBoZWlnaHQ9IjI5Ljk4MTI2NiIKICAgICAgIHg9Ijc0LjAwOTM2OSIKICAgICAgIHk9IjE1NC4wMDkzNyIgLz4KICA8L2c+Cjwvc3ZnPgo=";

/**
 * This feature adds a button that lets the player expand the inventory menu
 * into a fullscreen menu.
 * 
 * Thanks to ykitsnathan for suggesting this idea!
 */
export function addInventoryMenuExpansion() {
  /**
   * The raw side length of each square petal container.
   */
  const petalContainerSize = 65;

  /**
   * The total width/height each petal container takes up, after accounting
   * for padding.
   */
  const petalContainerTotalSpace = petalContainerSize + 10;

  /**
   * The padding between the menu's left side and the petals' left side.
   */
  const menuLeftPadding = 35;

  /**
   * The padding between the menu's right side and the petals' right side.
   */
  const menuRightPadding = 50;

  /**
   * The padding between the menu's top side and the petals' top side.
   */
  const menuTopPadding = 100;

  /**
   * The padding between the screen's left side and the menu's left side.
   */
  const screenLeftPadding = 130;

  /**
   * The minimum padding between the screen's right side and the menu's right
   * side.
   */
  const screenRightPadding = 10;

  /**
   * The minimum padding between the screen's top side and the menu's top side.
   */
  const screenTopPadding = 110;

  /**
   * The padding between the screen's bottom side and the menu's bottom side.
   */
  const screenBottomPadding = 20;

  /**
   * The size of the X button and the "Expand" button.
   */
  const buttonSize = 30;

  /**
   * The padding around the X button and the "Expand" button.
   */
  const buttonPadding = 7.5 + 3;

  /**
   * The inventory menu's height when not expanded.
   */
  const originalHeight = globalInventory.h;

  globalInventory.expanded = false;
  const nicknameTextbox = document.getElementsByClassName("nickname")[0];
  const nicknameUI = nicknameTextbox.parentElement;

  globalInventory.calculatePetalPositions = function() {
    let petalIndex = 0;

    // Loop through rarities from highest to lowest
    for (let group of Object.values(this.petalContainers).reverse()) {
      for (let pc of group) {
        if (this.filteredOutBySearch(pc)) {
          continue;
        }

        const row = Math.floor(petalIndex / globalInventory.petalsPerRow);
        const column = petalIndex % globalInventory.petalsPerRow;

        // Need to use `defineProperties` since Flowr's base code is hardcoded
        // to recalculate each petal's position using 5 petals per row
        Object.defineProperties(pc, {
          x: {
            get: () => petalContainerSize / 2 + menuLeftPadding
              + column * petalContainerTotalSpace,
            set: () => {},
            configurable: true,
          },
          y: {
            get: () => petalContainerSize / 2 + menuTopPadding
              + row * petalContainerTotalSpace
              + globalInventory.render.scroll,
            set: () => {},
            configurable: true,
          },
          relativeY: {
            get: function(this: PetalContainer) {
              return this.y - menuTopPadding;
            },
            set: () => {},
            configurable: true,
          },
        });

        petalIndex++;
      }
    }
  }

  globalInventory.recalculateDimensions = function() {
    if (this.expanded) {
      // Expand this menu into a fullscreen menu
      this.h = canvas.h - screenTopPadding - screenBottomPadding;
      const maxInventorySpaceWidth =
        canvas.w - screenLeftPadding - screenRightPadding
        - menuLeftPadding - menuRightPadding;
      this.petalsPerRow =
        Math.floor(maxInventorySpaceWidth / petalContainerTotalSpace);
    } else {
      this.petalsPerRow = 5;
      this.h = originalHeight;
    }
    this.w = petalContainerTotalSpace * this.petalsPerRow
      + menuLeftPadding + menuRightPadding;
  }

  globalInventory.toggleExpansion = function() {
    if (!settings.get("inventoryExpandButton")) {
      // Failsafe to ensure that the inventory is never expanded if the setting
      // is turned off
      this.expanded = false;
      this.recalculateDimensions();
      nicknameUI?.classList?.remove("hidden");
    }

    this.expanded = !this.expanded;

    this.recalculateDimensions();
    
    // The nickname UI is a text input placed at a higher z-index, so we need
    // to hide it so it does not cover up the inventory
    if (!isNil(nicknameUI)) {
      if (this.expanded) {
        nicknameUI.classList.add("hidden");
      } else {
        nicknameUI.classList.remove("hidden");
      }
    }
  }

  const originalToggleMenu = globalInventory.toggleMenu;
  globalInventory.toggleMenu = function() {
    originalToggleMenu.apply(this);

    // After closing the menu, it should no longer be expanded
    if (this.expanded) {
      this.toggleExpansion();
    }
    this.lastDragStartTime = undefined;
    this.lastDragEndTime = undefined;
  }

  globalInventory.getExpandButtonDimensions = function() {
    // Place this button to the left of the X button
    return {
      x: screenLeftPadding + this.w - 2 * (buttonSize + buttonPadding),
      y: this.renderY + buttonPadding,
      w: buttonSize,
      h: buttonSize,
    };
  }

  globalInventory.hoveringOverExpand = function() {
    return mouseInBox(
      {x: mouse.canvasX, y: mouse.canvasY}, this.getExpandButtonDimensions(),
    );
  }

  const originalDraw = globalInventory.draw;
  globalInventory.draw = function() {
    // If setting is turned off, just draw the inventory as usual
    if (!settings.get("inventoryExpandButton")) {
      originalDraw.apply(this);
      return;
    }

    const originalDrawStatsBox = StatsBox.prototype.draw;

    if (!isNil(this.lastDragStartTime)) {
      // Continue enforcing hiding menu by adjusting `lastCloseTime`.
      // We apply a speed factor of 0.2x, and cap the final elapsed time at
      // <160ms, since this is the maximum elapsed time that the base code will
      // process properly.
      this.lastCloseTime =
        time - Math.min(0.2 * (time - this.lastDragStartTime), 159.9);

      // Also stop drawing the inventory menu's stat boxes when hiding the menu
      StatsBox.prototype.draw = () => {};
    }
    if (!isNil(this.lastDragEndTime)) {
      // Bring menu back up by adjusting `lastOpenTime`, with 0.5x speed factor
      this.lastOpenTime = time - 0.5 * (time - this.lastDragEndTime);
    }

    // Override the base code's petal position calculations
    this.calculatePetalPositions();

    originalDraw.apply(this);

    // Restore stuff
    StatsBox.prototype.draw = originalDrawStatsBox;

    // Draw the "Expand" button
    const buttonDims = this.getExpandButtonDimensions();
    ctx.strokeStyle = CINDER_BORDER_COLOUR;
    ctx.fillStyle = CINDER_COLOUR;
    if (this.hoveringOverExpand()) {
      setCursor("pointer");
      ctx.fillStyle = LIGHT_CINDER_COLOUR;
    }
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.roundRect(buttonDims.x, buttonDims.y, buttonDims.w, buttonDims.h, 6);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    // Draw the "Expand" icon
    ctx.drawImage(
      expandIcon, buttonDims.x, buttonDims.y, buttonDims.w, buttonDims.h,
    );
  }

  globalInventory.shouldHideFromDraggingPetal = function() {
    return this.expanded && !isNil(draggingPetalContainer);
  }

  const originalMouseDown = globalInventory.mouseDown;
  globalInventory.mouseDown = function(
    { mouseX, mouseY }: CanvasMouseData2, inv: Inventory
  ) {
    // If setting is turned off, just handle mouse clicks as usual
    if (!settings.get("inventoryExpandButton")) {
      originalMouseDown.apply(this, [{ mouseX, mouseY }, inv]);
      return;
    }

    originalMouseDown.apply(this, [{ mouseX, mouseY }, inv]);

    // Hide the menu if the player starts dragging a petal while the menu is
    // expanded to fullscreen
    if (this.shouldHideFromDraggingPetal()) {
      this.lastDragEndTime = undefined;
      this.lastDragStartTime = time;
      nicknameUI?.classList?.remove("hidden");
    }

    // Toggle expansion if the user clicked on the "Expand" button
    if (this.hoveringOverExpand()) {
      this.toggleExpansion();
    }
  }

  const originalMouseUp = globalInventory.mouseUp;
  globalInventory.mouseUp = function(
    { mouseX, mouseY }: CanvasMouseData2,
    inv: Inventory,
    skipFastFlag?: boolean,
  ) {
    // Check for releasing a dragged petal
    if (this.shouldHideFromDraggingPetal()) {
      this.lastDragStartTime = undefined;
      this.lastDragEndTime = time;
      nicknameUI?.classList?.add("hidden");
    }
    originalMouseUp.apply(this, [{ mouseX, mouseY }, inv, skipFastFlag]);
  }

  // When the player resizes the window, also resize the inventory menu.
  window.addEventListener("resize", function() {
    if (globalInventory.expanded) {
      globalInventory.recalculateDimensions();
    }
  });

  // Also recalculate dimensions immediately to apply this script's slightly
  // different padding
  globalInventory.recalculateDimensions();
}