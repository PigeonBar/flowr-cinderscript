import { CINDER_COLOUR, DELETE_ICON_WIDTH, EDIT_ICON_SIZE, FLOWRSCRIPT_HOTKEYS, KEYBIND_DELETED, SETTINGS_BUTTON_PADDING, SETTINGS_BUTTON_SIZE, SETTINGS_GREEN, SETTINGS_OPTION_HEIGHT, X_BUTTON_FILL, X_BUTTON_STROKE } from "../constants/constants";
import { addKeybindInstruction } from "../inits/keybindHandling";
import { ctxDrawText, isNil } from "../utils";
import { AbstractSettingsMenu } from "./abstractSettingsMenu";
import { isChatHotkeysArray, type ChatHotkey, type ChatHotkeys } from "./hotkeysUtils";
import { settings } from "./settingsManager";
import { type CinderSettingsMenu } from "./settingsMenu";
import { editIcon, DisplayValueOption, CustomOption, AbstractKeybindOption, TableHeading } from "./settingsOptions";

// icons/delete.svg
const deleteIcon = new Image();
deleteIcon.src = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB3aWR0aD0iMzAuMDAwMDAybW0iCiAgIGhlaWdodD0iNDVtbSIKICAgdmlld0JveD0iMCAwIDMwLjAwMDAwMiA0NSIKICAgdmVyc2lvbj0iMS4xIgogICBpZD0ic3ZnMSIKICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcwogICAgIGlkPSJkZWZzMSI+CiAgICA8Y2xpcFBhdGgKICAgICAgIGNsaXBQYXRoVW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgaWQ9ImNsaXBQYXRoMjAiPgogICAgICA8cGF0aAogICAgICAgICBpZD0icGF0aDIwIgogICAgICAgICBzdHlsZT0iZGlzcGxheTpub25lO2ZpbGw6I2ZmMDAwMDtmaWxsLW9wYWNpdHk6MTtzdHJva2U6I2ZmZmZmZjtzdHJva2Utd2lkdGg6MDtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MTtwYWludC1vcmRlcjptYXJrZXJzIHN0cm9rZSBmaWxsIgogICAgICAgICBkPSJtIDEwOS4wMDAwNywxMjUuMDAwMTIgYyAtMC41NTQsMCAtMC45OTk5NCwwLjQ0NTk0IC0wLjk5OTk0LDAuOTk5OTQgViAxNDQgYyAwLDAuNTU0IDAuNDQ1OTQsMC45OTk5MyAwLjk5OTk0LDAuOTk5OTMgMC41NTQsMCAwLjk5OTkzLC0wLjQ0NTkzIDAuOTk5OTMsLTAuOTk5OTMgdiAtMTcuOTk5OTQgYyAwLC0wLjU1NCAtMC40NDU5MywtMC45OTk5NCAtMC45OTk5MywtMC45OTk5NCB6IG0gNi4wMDAxNSwwIGMgLTAuNTU0LDAgLTEuMDAwNDYsMC40NDU5NCAtMS4wMDA0NiwwLjk5OTk0IFYgMTQ0IGMgMCwwLjU1NCAwLjQ0NjQ2LDAuOTk5OTMgMS4wMDA0NiwwLjk5OTkzIDAuNTU0LDAgMC45OTk5MywtMC40NDU5MyAwLjk5OTkzLC0wLjk5OTkzIHYgLTE3Ljk5OTk0IGMgMCwtMC41NTQgLTAuNDQ1OTMsLTAuOTk5OTQgLTAuOTk5OTMsLTAuOTk5OTQgeiBtIDUuOTk5NjMsMCBjIC0wLjU1NCwwIC0wLjk5OTk0LDAuNDQ1OTQgLTAuOTk5OTQsMC45OTk5NCBWIDE0NCBjIDAsMC41NTQgMC40NDU5NCwwLjk5OTkzIDAuOTk5OTQsMC45OTk5MyAwLjU1NCwwIDAuOTk5OTQsLTAuNDQ1OTMgMC45OTk5NCwtMC45OTk5MyB2IC0xNy45OTk5NCBjIDAsLTAuNTU0IC0wLjQ0NTk0LC0wLjk5OTk0IC0wLjk5OTk0LC0wLjk5OTk0IHoiIC8+CiAgICAgIDxwYXRoCiAgICAgICAgIGlkPSJscGVfcGF0aC1lZmZlY3QyMCIKICAgICAgICAgc3R5bGU9ImZpbGw6I2ZmMDAwMDtmaWxsLW9wYWNpdHk6MTtzdHJva2U6I2ZmZmZmZjtzdHJva2Utd2lkdGg6MDtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MTtwYWludC1vcmRlcjptYXJrZXJzIHN0cm9rZSBmaWxsIgogICAgICAgICBjbGFzcz0icG93ZXJjbGlwIgogICAgICAgICBkPSJtIDk1LDExNSBoIDQwIHYgNDAgSCA5NSBaIG0gMTQuMDAwMDcsMTAuMDAwMTIgYyAtMC41NTQsMCAtMC45OTk5NCwwLjQ0NTk0IC0wLjk5OTk0LDAuOTk5OTQgViAxNDQgYyAwLDAuNTU0IDAuNDQ1OTQsMC45OTk5MyAwLjk5OTk0LDAuOTk5OTMgMC41NTQsMCAwLjk5OTkzLC0wLjQ0NTkzIDAuOTk5OTMsLTAuOTk5OTMgdiAtMTcuOTk5OTQgYyAwLC0wLjU1NCAtMC40NDU5MywtMC45OTk5NCAtMC45OTk5MywtMC45OTk5NCB6IG0gNi4wMDAxNSwwIGMgLTAuNTU0LDAgLTEuMDAwNDYsMC40NDU5NCAtMS4wMDA0NiwwLjk5OTk0IFYgMTQ0IGMgMCwwLjU1NCAwLjQ0NjQ2LDAuOTk5OTMgMS4wMDA0NiwwLjk5OTkzIDAuNTU0LDAgMC45OTk5MywtMC40NDU5MyAwLjk5OTkzLC0wLjk5OTkzIHYgLTE3Ljk5OTk0IGMgMCwtMC41NTQgLTAuNDQ1OTMsLTAuOTk5OTQgLTAuOTk5OTMsLTAuOTk5OTQgeiBtIDUuOTk5NjMsMCBjIC0wLjU1NCwwIC0wLjk5OTk0LDAuNDQ1OTQgLTAuOTk5OTQsMC45OTk5NCBWIDE0NCBjIDAsMC41NTQgMC40NDU5NCwwLjk5OTkzIDAuOTk5OTQsMC45OTk5MyAwLjU1NCwwIDAuOTk5OTQsLTAuNDQ1OTMgMC45OTk5NCwtMC45OTk5MyB2IC0xNy45OTk5NCBjIDAsLTAuNTU0IC0wLjQ0NTk0LC0wLjk5OTk0IC0wLjk5OTk0LC0wLjk5OTk0IHoiIC8+CiAgICA8L2NsaXBQYXRoPgogIDwvZGVmcz4KICA8ZwogICAgIGlkPSJsYXllcjEiCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTk5Ljk5OTk5NywtMTA1KSI+CiAgICA8cmVjdAogICAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtmaWxsLW9wYWNpdHk6MTtzdHJva2U6I2ZmZmZmZjtzdHJva2Utd2lkdGg6MDtzdHJva2UtbGluZWNhcDpzcXVhcmU7c3Ryb2tlLW1pdGVybGltaXQ6MDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MTtwYWludC1vcmRlcjptYXJrZXJzIHN0cm9rZSBmaWxsIgogICAgICAgaWQ9InJlY3QyIgogICAgICAgd2lkdGg9IjMwIgogICAgICAgaGVpZ2h0PSI1IgogICAgICAgeD0iMTAwIgogICAgICAgeT0iMTEzIiAvPgogICAgPHBhdGgKICAgICAgIHN0eWxlPSJmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOiNmZmZmZmY7c3Ryb2tlLXdpZHRoOjA7c3Ryb2tlLWxpbmVjYXA6c3F1YXJlO3N0cm9rZS1taXRlcmxpbWl0OjA7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjE7cGFpbnQtb3JkZXI6bWFya2VycyBzdHJva2UgZmlsbCIKICAgICAgIGQ9Im0gMTAwLDEyMCBoIDMwIGwgLTMsMzAgaCAtMjQgeiIKICAgICAgIGlkPSJwYXRoMiIKICAgICAgIGNsaXAtcGF0aD0idXJsKCNjbGlwUGF0aDIwKSIgLz4KICAgIDxwYXRoCiAgICAgICBzdHlsZT0iZmlsbDojZmYwMDAwO2ZpbGwtb3BhY2l0eTowO3N0cm9rZTojZmZmZmZmO3N0cm9rZS13aWR0aDo0O3N0cm9rZS1saW5lY2FwOnNxdWFyZTtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MTtwYWludC1vcmRlcjptYXJrZXJzIHN0cm9rZSBmaWxsIgogICAgICAgZD0ibSAxMDcsMTExIHYgLTQgaCAxNiB2IDQiCiAgICAgICBpZD0icGF0aDE5IiAvPgogIDwvZz4KPC9zdmc+Cg==";

/**
 * The icon for the "Add Hotkey" option.
 * 
 * This icon is drawn as a simple plus sign.
 */
const addHotkeyIcon = new OffscreenCanvas(50, 50);
const addHotkeyCtx = addHotkeyIcon.getContext("2d");
if (!isNil(addHotkeyCtx)) {
  addHotkeyCtx.strokeStyle = "white";
  addHotkeyCtx.lineWidth = 10;
  addHotkeyCtx.beginPath();
  addHotkeyCtx.moveTo(0, 25);
  addHotkeyCtx.lineTo(50, 25);
  addHotkeyCtx.moveTo(25, 0);
  addHotkeyCtx.lineTo(25, 50);
  addHotkeyCtx.stroke();
  addHotkeyCtx.closePath();
}

/**
 * The icon for the "Export Hotkeys" option.
 * 
 * This icon is drawn as an arrow pointing out of a container.
 */
const exportIcon = new OffscreenCanvas(50, 50);
const exportIconCtx = exportIcon.getContext("2d");
if (!isNil(exportIconCtx)) {
  exportIconCtx.strokeStyle = "white";
  exportIconCtx.lineWidth = 10;

  // Draw the container
  exportIconCtx.beginPath();
  exportIconCtx.moveTo(0, 30);
  exportIconCtx.lineTo(0, 50);
  exportIconCtx.lineTo(50, 50);
  exportIconCtx.lineTo(50, 30);

  exportIconCtx.stroke();
  exportIconCtx.closePath();

  exportIconCtx.lineWidth = 5;

  // Draw the arrow
  exportIconCtx.beginPath();
  exportIconCtx.moveTo(25, 0);
  exportIconCtx.lineTo(25, 35);
  exportIconCtx.moveTo(25, 0);
  exportIconCtx.lineTo(10, 15);
  exportIconCtx.moveTo(25, 0);
  exportIconCtx.lineTo(40, 15);

  exportIconCtx.stroke();
  exportIconCtx.closePath();
}

/**
 * The icon for the "Import Hotkeys" options.
 * 
 * This icon is drawn as an arrow pointing into a container.
 */
const importIcon = new OffscreenCanvas(50, 50);
const importIconCtx = importIcon.getContext("2d");
if (!isNil(importIconCtx)) {
  importIconCtx.strokeStyle = "white";
  importIconCtx.lineWidth = 10;

  // Draw the container
  importIconCtx.beginPath();
  importIconCtx.moveTo(0, 30);
  importIconCtx.lineTo(0, 50);
  importIconCtx.lineTo(50, 50);
  importIconCtx.lineTo(50, 30);

  importIconCtx.stroke();
  importIconCtx.closePath();

  importIconCtx.lineWidth = 5;

  // Draw the arrow
  importIconCtx.beginPath();
  importIconCtx.moveTo(25, 35);
  importIconCtx.lineTo(25, 0);
  importIconCtx.moveTo(25, 35);
  importIconCtx.lineTo(10, 20);
  importIconCtx.moveTo(25, 35);
  importIconCtx.lineTo(40, 20);

  importIconCtx.stroke();
  importIconCtx.closePath();
}

/**
 * The x-position of the vertical line separating the "Chat Messages" column
 * and the "Keybinds" column of the hotkeys editor.
 */
const SEPARATOR_1 = 550;

/**
 * The x-position of the vertical line separating the "Keybinds" column and
 * the "Delete Buttons" column of the hotkeys editor.
 */
const SEPARATOR_2 = 750;

/**
 * A UI for editing chat hotkeys. It displays editable hotkeys in a table
 * format, and it also allows importing and exporting all of the hotkeys stored
 * in this editor.
 * 
 * Note that this menu does not directly handle making keybinds editable.
 * Instead, it delegates this task to the {@linkcode parentMenu}'s system so
 * the parent menu can act as a unified system for handling all keybinds.
 */
export class HotkeysEditor extends AbstractSettingsMenu {
  /**
   * The parent settings menu that this editor belongs to.
   */
  parentMenu: CinderSettingsMenu;

  /**
   * The hotkeys currently set by this editor.
   */
  state: ChatHotkeys;

  constructor(parentMenu: CinderSettingsMenu) {
    super();

    // The height is intentionally not a multiple of SETTINGS_OPTION_HEIGHT, to
    // make it clearer to the user that the menu should be scrollable.
    this.h = 9.6 * SETTINGS_OPTION_HEIGHT;
    this.w = 850;

    this.parentMenu = parentMenu;
    this.state = settings.get("chatHotkeys");

    // TODO: Find a better way to handle this, since it would most likely crash
    // this constructor.
    if (!isChatHotkeysArray(this.state)) {
      console.warn("Saved hotkeys are corrupted!", this.state);
    }

    // Populate this editor's list of options
    this.options = [new TableHeading(
      ["Chat Messages", "Keybinds", "Delete"], [SEPARATOR_1, SEPARATOR_2],
    )];

    for (let hotkey of this.state) {
      this.options.push(new HotkeysOption(hotkey, this));
    }

    this.options.push(new CustomOption(
      "Add New Hotkey",
      addHotkeyIcon,
      () => {
        // Add a new blank hotkey at the end of all the other hotkeys
        const newOption = new HotkeysOption({
          chatMsg: "<Enter chat message here...>",
          keybind: KEYBIND_DELETED,
        }, this);
        this.options.splice(
          this.firstCustomOptionIndex, 0, newOption,
        );
        this.updateState();

        // Apply the "option changed" flash immediately
        newOption.changeTime = time;

        // Scroll the editor down to account for the added option
        this.scroll += SETTINGS_OPTION_HEIGHT;
      },
    ));

    this.options.push(new CustomOption(
      "Export Hotkeys to Clipboard",
      exportIcon,
      () => {
        // Undo the player's click before opening the prompt
        send({attack: false});

        navigator.clipboard.writeText(JSON.stringify(this.state));
        alert("Successfully exported your current hotkeys to your clipboard.");
      },
    ));

    this.options.push(new CustomOption(
      "Import Hotkeys as Text",
      importIcon,
      () => {
        try {
          // Undo the player's click before opening the prompt
          send({attack: false});

          const response = prompt(
            "Please enter the hotkeys you wish to import:"
          );
          const hotkeys = JSON.parse(response ?? "null");
          this.importHotkeys(hotkeys, "your inputted hotkeys");
        } catch (_e) {
          alert(
            "Error: The inputted hotkeys are not formatted correctly! " +
            "Import aborted."
          );
        }
      },
      undefined,
      undefined,
      "The imported hotkeys require a very specific format, and it is meant " +
      "to support importing hotkeys that you exported from another device " +
      "using the \"Export Hotkeys\" button. It is strongly recommended not " +
      "to attempt manually formatting hotkeys by yourself.",
    ));

    this.options.push(new CustomOption(
      "Import Flowrscript's Default Hotkeys",
      importIcon,
      () => {
        // Undo the player's click before opening the prompt
        send({attack: false});

        this.importHotkeys(
          FLOWRSCRIPT_HOTKEYS, "Flowrscript's default hotkeys",
        );
      },
    ));

    // Also add a keybind instruction to activate this editor's hotkeys
    addKeybindInstruction({ type: "always", fn: (e: KeyboardEvent) => {
      if (settings.get("useChatHotkeys")) {
        for (let hotkey of this.state) {
          if (e.code === hotkey.keybind) {
            send(["c", hotkey.chatMsg]);
          }
        }
      }
    }});
  }

  /**
   * The first index in {@linkcode options} that contains a custom option
   * instead of a hotkey item.
   */
  get firstCustomOptionIndex(): number {
    return this.options.findIndex(
      option => !option.isSectionHeading() && option.isCustomOption()
    );
  }

  toggle(): void {
    super.toggle();

    // Also close the colour selector when opening the hotkeys editor
    if (this.active) {
      this.parentMenu.cancelColourOption();
    }
  }

  draw(): void {
    // Draw this menu to the right of the parent menu
    this.x = this.parentMenu.x + this.parentMenu.w + 20;

    super.draw();
  }

  /**
   * Updates {@linkcode state} based on the {@linkcode HotkeysOption} items
   * currently stored in this editor.
   * 
   * This function also handles saving the new state in the settings and
   * telling the parent menu to recount keybinds.
   */
  updateState(): void {
    this.state = [];
    for (let option of this.options) {
      if (!option.isSectionHeading() && option.isHotkeysOption()) {
        this.state.push(option.state);
      }
    }

    settings.set("chatHotkeys", this.state);

    // Tell parent menu to recount keybinds whenever these hotkeys get updated
    this.parentMenu.recountKeybinds();
  }

  /**
   * Validates whether or not the given hotkeys are a valid set of hotkeys and
   * then imports the given hotkeys.
   * 
   * This function also prompts the user on whether or not they want to
   * overwrite their current keybinds.
   * 
   * @param hotkeys The array of hotkeys being imported.
   * @param name The name to call the imported set of hotkeys.
   */
  importHotkeys(hotkeys: any, name: string): void {
    if (!isChatHotkeysArray(hotkeys)) {
      alert(
        "Error: The inputted hotkeys are not formatted correctly! " +
        "Import aborted."
      );
      return;
    }

    // Make the user confirm overwriting their entire set of hotkeys
    const response = prompt(
      `Caution: You are about to import ${name}, which will OVERWRITE ALL ` +
      "of your currently saved hotkeys! Type \"Yes\" to confirm."
    );
    if (response?.toLowerCase() === "yes") {
      // Remove all currently saved hotkeys
      const heading = this.options[0];
      this.options.splice(0, this.firstCustomOptionIndex);

      // Add the new hotkeys that are being imported
      for (let i = hotkeys.length - 1; i >= 0; i--) {
        this.options.unshift(new HotkeysOption(hotkeys[i], this));
      }
      this.options.unshift(heading);

      this.updateState();
      alert(`Successfully imported ${name}.`);
    } else {
      alert("Import aborted.");
    }
  }
}

/**
 * A basic item inside the {@linkcode HotkeysEditor} that lets the user edit
 * both its keybind and its corresponding chat message.
 * 
 * This is designed similarly to a {@linkcode DisplayValueOption}, except it
 * needs to allow editing two values instead of just one.
 */
class HotkeysOption extends AbstractKeybindOption {
  /**
   * The hotkeys editor that this hotkey item belongs to.
   */
  parentMenu: HotkeysEditor;

  /**
   * This item's currently saved state, consisting of a keybind and its
   * corresponding chat message.
   */
  state: ChatHotkey;

  /**
   * The position of the button that lets the user edit this item's saved chat
   * message.
   */
  editChatMsgButton: { x: number, y: number, w: number, h: number };

  /**
   * The position of the button that lets the user edit this item's saved
   * keybind.
   */
  editKeybindButton: { x: number, y: number, w: number, h: number };

  /**
   * The position of the button that lets the user delete this item.
   */
  deleteButton: { x: number, y: number, w: number, h: number };

  constructor(state: ChatHotkey, parentMenu: HotkeysEditor) {
    super("");

    this.state = state;
    this.parentMenu = parentMenu;

    // Place all buttons at (0, 0) for now, they will be updated properly when
    // drawing this item in the hotkeys editor.
    this.editChatMsgButton = { x: 0, y: 0, w: 0, h: 0 };
    this.editKeybindButton = { x: 0, y: 0, w: 0, h: 0 };
    this.deleteButton = { x: 0, y: 0, w: 0, h: 0 };
  }

  isHotkeysOption(): this is this {
    return true;
  }

  draw(menu: AbstractSettingsMenu) {
    // Display the "Edit Chat Message" button
    this.editChatMsgButton = {
      x: 15 + menu.x,
      y: menu.midHeight - SETTINGS_BUTTON_SIZE / 2 + menu.y,
      w: SETTINGS_BUTTON_SIZE,
      h: SETTINGS_BUTTON_SIZE,
    }

    ctx.fillStyle = "#9f9f9f";
    ctx.strokeStyle = "#5f5f5f";
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.rect(
      this.editChatMsgButton.x - menu.x,
      this.editChatMsgButton.y - menu.y,
      this.editChatMsgButton.w,
      this.editChatMsgButton.h,
    );
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    // Display the edit icon
    ctx.drawImage(
      editIcon,
      this.editChatMsgButton.x - menu.x + SETTINGS_BUTTON_SIZE / 2
        - EDIT_ICON_SIZE / 2,
      menu.midHeight - EDIT_ICON_SIZE / 2,
      EDIT_ICON_SIZE,
      EDIT_ICON_SIZE,
    );

    // Display the "Edit Keybind" button
    this.editKeybindButton = {
      x: 15 + SEPARATOR_1 + menu.x,
      y: menu.midHeight - SETTINGS_BUTTON_SIZE / 2 + menu.y,
      w: SETTINGS_BUTTON_SIZE,
      h: SETTINGS_BUTTON_SIZE,
    }

    ctx.beginPath();
    ctx.rect(
      this.editKeybindButton.x - menu.x,
      this.editKeybindButton.y - menu.y,
      this.editKeybindButton.w,
      this.editKeybindButton.h,
    );
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    // Display the edit icon
    ctx.drawImage(
      editIcon,
      this.editKeybindButton.x - menu.x + SETTINGS_BUTTON_SIZE / 2
        - EDIT_ICON_SIZE / 2,
      menu.midHeight - EDIT_ICON_SIZE / 2,
      EDIT_ICON_SIZE,
      EDIT_ICON_SIZE,
    );

    // Display the "Delete" button
    this.deleteButton = {
      // Placed midway between separator 2 and the scrollbar
      x: menu.x + SEPARATOR_2
        + (menu.w - SEPARATOR_2 - 16 - SETTINGS_BUTTON_SIZE) / 2,
      y: menu.midHeight - SETTINGS_BUTTON_SIZE / 2 + menu.y,
      w: SETTINGS_BUTTON_SIZE,
      h: SETTINGS_BUTTON_SIZE,
    }

    ctx.fillStyle = X_BUTTON_FILL;
    ctx.strokeStyle = X_BUTTON_STROKE;
    ctx.beginPath();
    ctx.rect(
      this.deleteButton.x - menu.x,
      this.deleteButton.y - menu.y,
      this.deleteButton.w,
      this.deleteButton.h,
    );
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    // Display the delete icon
    ctx.drawImage(
      deleteIcon,
      this.deleteButton.x - menu.x + SETTINGS_BUTTON_SIZE / 2
        - DELETE_ICON_WIDTH / 2,
      menu.midHeight - EDIT_ICON_SIZE / 2,
      DELETE_ICON_WIDTH,
      EDIT_ICON_SIZE,
    )
    
    // If needed, truncate the chat message to fit inside the UI
    ctx.font = "900 17px Ubuntu";
    let currentX = this.editChatMsgButton.x - menu.x + SETTINGS_BUTTON_SIZE
      + SETTINGS_BUTTON_PADDING;
    let maxWidth = SEPARATOR_1 - currentX - SETTINGS_BUTTON_PADDING;
    let drawnMsg = this.state.chatMsg;
    if (ctx.measureText(drawnMsg).width > maxWidth) {
      drawnMsg = "";
      let index = 0;
      while (ctx.measureText(
        drawnMsg + this.state.chatMsg.charAt(index) + "..."
      ).width < maxWidth) {
        drawnMsg += this.state.chatMsg.charAt(index);
        index++;
        
        // Failsafe, in case the index somehow gets out of bounds
        if (index >= this.state.chatMsg.length) {
          break;
        }
      }
      drawnMsg += "...";
    }

    // Display the saved chat message
    ctx.font = "900 17px Ubuntu";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillStyle = this.getFlashColour(SETTINGS_GREEN);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctxDrawText(drawnMsg, currentX, menu.midHeight);

    // Display the saved keybind
    currentX = this.editKeybindButton.x - menu.x + SETTINGS_BUTTON_SIZE
      + SETTINGS_BUTTON_PADDING;
    let text = "";
    if (this.editingKeybind) {
      ctx.fillStyle = CINDER_COLOUR;
      text = "(Editing...)";
    } else {
      ctx.fillStyle = this.getKeybindColour(
        this.state.keybind, this.parentMenu.parentMenu,
      );
      text = this.state.keybind;
    }
    ctxDrawText(text, currentX, menu.midHeight);

    // Draw the vertical separators in order
    ctx.strokeStyle = "#7f7f7f";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(SEPARATOR_1, menu.currentHeight);
    ctx.lineTo(SEPARATOR_1, menu.currentHeight + SETTINGS_OPTION_HEIGHT);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.moveTo(SEPARATOR_2, menu.currentHeight);
    ctx.lineTo(SEPARATOR_2, menu.currentHeight + SETTINGS_OPTION_HEIGHT);
    ctx.stroke();
    ctx.closePath();

    menu.currentHeight += SETTINGS_OPTION_HEIGHT;
  }

  /**
   * Determines whether the given mouse coordinates are inside the "Edit Chat
   * Message" button.
   */
  mouseInEditChatMsgButton(e: CanvasMouseData): boolean {
    return mouseInBox(e, this.editChatMsgButton);
  }

  /**
   * Determines whether the given mouse coordinates are inside the "Edit
   * Keybind" button.
   */
  mouseInEditKeybindButton(e: CanvasMouseData): boolean {
    return mouseInBox(e, this.editKeybindButton);
  }

  /**
   * Determines whether the given mouse coordinates are inside the "Delete"
   * button.
   */
  mouseInDeleteButton(e: CanvasMouseData): boolean {
    return mouseInBox(e, this.deleteButton);
  }

  mouseInButton(e: CanvasMouseData): boolean {
    // Check if the user is hovering over any of the three buttons
    return this.mouseInEditChatMsgButton(e)
      || this.mouseInEditKeybindButton(e)
      || this.mouseInDeleteButton(e);
  }

  onClick(_menu: AbstractSettingsMenu, e: CanvasMouseData) {
    // Select behaviour based on which button the user clicked
    if (this.mouseInEditChatMsgButton(e)) {
      // Undo the player's click before opening the prompt
      send({attack: false});

      // Prompt the user for a new message
      const chatMsg = prompt(
        "Please enter the new chat message you wish to use. The currently " +
        `saved chat message for this hotkey is:\n\n"${this.state.chatMsg}"`
      ) ?? "";
      if (chatMsg.length > 0) {
        this.state.chatMsg = chatMsg;
        this.parentMenu.updateState();
        this.changeTime = performance.now();
      } else {
        alert("No new chat message detected. Edit aborted.");
      }
    } else if (this.mouseInEditKeybindButton(e)) {
      // Use `AbstractKeybindOption`'s code to edit this setting's keybind
      super.onClick(this.parentMenu.parentMenu, e);
    } else if (this.mouseInDeleteButton(e)) {
      // Undo the player's click before opening the prompt
      send({attack: false});

      // Make the user confirm deleting the hotkey
      if (confirm(
        "Are you sure you want to delete this hotkey? The currently saved " +
        `chat message for this hotkey is:\n\n"${this.state.chatMsg}"`
      )) {
        alert(
          "Deleted the hotkey for the following chat message:\n\n" +
          `"${this.state.chatMsg}"`
        )
        this.parentMenu.options.splice(
          this.parentMenu.options.findIndex(option => option === this), 1,
        );
        this.parentMenu.updateState();
      } else {
        alert("Deletion aborted.");
      }
    }
  };

  finishEdit(newKeybind?: string): void {
    super.finishEdit(newKeybind);

    if (!isNil(newKeybind)) {
      this.changeTime = performance.now();
      this.state.keybind = newKeybind;
      this.parentMenu.updateState();
    }
  }
}

export type { HotkeysOption };
