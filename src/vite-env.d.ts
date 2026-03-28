/// <reference types="vite/client" />
/// <reference types="vite-plugin-monkey/client" />

import type { Rarity } from "./enums";
import type { BooleanOption, SettingsOption, SettingsSectionHeading } from "./settings/settingsOptions";

//// <reference types="vite-plugin-monkey/global" />
/// <reference types="vite-plugin-monkey/style" />


/**
 * We declare the `Type`s of objects from flowr's client code here,
 * so that our other ts files can use them.
 */
declare global {
  interface Window {
    /**
     * Whether or not the client is currently connected to Flowr's servers.
     */
    connected?: boolean;

    /**
     * The id of the flower that the player is currently playing as.
     */
    selfId?: number;

    /**
     * The client's current state ("menu", "game", "disconnected", etc.).
     */
    state?: string;

    /**
     * The base game's raw setting for whether or not petals should be drawn in
     * high quality.
     */
    _hqp: boolean;

    /**
     * Whether or not petals should be drawn in high quality.
     */
    hqp: boolean;

    /**
     * Camera data that is used to determine whether objects are currently
     * off-screen, which can cause them to not be rendered. An x-coordinate of
     * `"pass"` means that objects will always be rendered, regardless of their
     * current position.
     */
    camera: CameraData;
  }

  type PetalType = string; // TODO: List of actually existing petal types?
  type EnemyType = string; // TODO: List of actually existing enemy types?

  /**
   * Calculates the success chance of crafting a (`rarity + 1`) petal on
   * attempt number (`attempt + 1`).
   */
  function calculateChance(attempt: number, rarity: Rarity);

  function calculateStats(pvp?: boolean, tanksmith?: boolean);

  const Stats: {
    enemies: Record<EnemyType, any>;
  };

  const Colors: {
    rarities: {name: string, color: string, border: string, fancy?: any}[];
  }

  /**
   * A list of non-animated gradients that are used when displaying fancy
   * petal gradients while High Quality Renders is turned off.
   */
  const staticGradients: Partial<Record<Rarity, CanvasGradient | string>>;

  /**
   * The menus at the bottom of the screen (inventory, crafting, gallery)
   */
  class BottomMenu {
    w: number;
    h: number;
    menuActive: boolean;
    lastOpenTime?: number;
    lastCloseTime?: number;

    /**
     * The y-position of this menu on the canvas. This value changes when the
     * menu is opened or closed.
     * 
     * Note: This value is only used by this script, and will not affect any of
     * Flowr's base code operations.
     */
    renderY: number;

    toggleMenu();
  }

  class CraftingMenu extends BottomMenu {
    scroll: number;
    petalContainerSize: number;
    craftingPetalContainers: PetalContainer[];
    previewPetalContainer: PetalContainer | undefined;
    searchBarActive: boolean;
    maxRarity: Rarity;

    /**
     * Whether or not the server has finished processing the craft request.
     */
    _finishedCraft: boolean;

    /**
     * Whether or not the current crafting attempt has finished, including its
     * animation.
     */
    finishedCraft: boolean;

    /**
     * The base game's internal timer for the crafting animation.
     */
    craftingAnimationTimer: number;

    /**
     * A countdown used by this script for the crafting animation.
     */
    craftAnimationCountdown: number;

    /**
     * A list of owned petals displayed below the crafting area, after applying
     * filtering from the search bar.
     */
    petalContainers: Record<PetalType, Record<Rarity, PetalContainer>>;

    /**
     * A list of all owned petals, without applying filtering from the search
     * bar.
     */
    rawPetalContainers: Record<PetalType, Record<Rarity, PetalContainer>>;

    /**
     * A search bar that allows for filtering petals by petal type.
     */
    craftSearch: HTMLInputElement;

    craftingPetalSlotsDimensions: {
      x: number;
      y: number;
      maxRadius: number;
      radius: number;
      angleOffset: number;
    };

    inventorySpace: {
      x: number;
      y: number;
      w: number;
      h: number;
    };
    
    previewPetalSlot: {
      x: number;
      y: number;
      w: number;
      h: number;
    };
    
    searchBarDimensions: {
      x: number;
      y: number;
      w: number;
      h: number;
    };

    scrollbar: {
      top: number;
      bottom: number;
      renderTop: number;
      renderBottom: number;
      length: number;

      /**
       * The smallest possible y-position of the scrollbar
       */
      start: number;

      /**
       * The largest possible y-position of the scrollbar
       */
      end: number;
    }

    drawInventory(alpha: number = 1);

    getSlotColor();

    getMainFill();

    getMainStroke();

    startCraftingAnimation();

    runCraftingAnimation();

    addPetalContainer(p: PetalContainer);

    removePetalContainer(type: PetalType, rarity: Rarity);

    removePetalContainerAmount(
      type: PetalType, rarity: Rarity, amount: number,
    );

    addCraftingPetalContainers(
      type: PetalType,
      rarity: Rarity,
      amount: number,
      attempt: number
    );

    removeCraftingPetalContainers();

    enterGame();

    mouseDown({mouseX, mouseY}: CanvasMouseData2, evt: MouseEvent);

    mouseMove({mouseX, mouseY}: CanvasMouseData2, evt: MouseEvent);

    recalculateTypeIndexes();

    /**
     * Updates the search bar to become active/inactive based on the settings,
     * and also shifts the menu's UI elements to make room for the search bar
     * as needed.
     */
    updateSearchBarActive(): void;

    /**
     * Returns `true` iff the search bar is toggled on and the mouse is
     * currently hovering over the search bar.
     */
    mouseInSearchBar(): boolean;

    /**
     * Determines whether the player is currently typing in the search bar.
     */
    searchBarFocused(): boolean;

    /**
     * Reapplies the search bar's filter to the list of owned petals.
     */
    recalculateFilteredPetals(): void;
  }

  const craftingMenu: CraftingMenu;

  const petalsearch: HTMLInputElement;

  /**
   * The inventory menu, which stores all owned petals that the user is
   * currently *not* equipping.
   */
  class GlobalInventory extends BottomMenu {
    petalContainers: Record<Rarity, PetalContainer[]>;
    render: {
      scroll: number;
    };

    /**
     * Whether or not the inventory menu is currently expanded to fullscreen.
     */
    expanded: boolean;

    /**
     * The number of petals to place in each row of this menu. This number
     * changes when the user expands this menu.
     */
    petalsPerRow: number;

    /**
     * The timestamp for the user starting to drag a petal from this inventory,
     * or `undefined` if the user is not currently dragging a petal.
     */
    lastDragStartTime?: number;

    /**
     * The timestamp for the user releasing a petal that they were dragging, or
     * `undefined` if the user has not recently dragged a petal.
     */
    lastDragEndTime?: number;

    initInventory(data: any);
    draw();
    filteredOutBySearch(petalContainer: PetalContainer);
    mouseDown({ mouseX, mouseY }: CanvasMouseData2, inv: Inventory);
    mouseUp(
      { mouseX, mouseY }: CanvasMouseData2,
      inv: Inventory,
      skipFastFlag?: boolean,
    );

    toggleExpansion(): void;

    /**
     * Recalculates this menu's dimensions based on whether the menu is
     * currently expanded.
     */
    recalculateDimensions(): void;

    /**
     * Calculates the position that each petal should be placed in this
     * inventory menu.
     */
    calculatePetalPositions(): void;

    /**
     * Determines whether or not this menu should be hidden due to the player
     * dragging a petal while this menu is expanded to fullscreen.
     */
    shouldHideFromDraggingPetal(): boolean;

    /**
     * Determines whether or not the user's mouse is hovering over the "Expand"
     * button.
     */
    hoveringOverExpand(): boolean;

    /**
     * Calculates the position of the "Expand" button relative to the main
     * canvas, based on whether the menu is currently expanded to fullscreen.
     */
    getExpandButtonDimensions(): {x: number, y: number, w: number, h: number};
  }

  const globalInventory: GlobalInventory;

  class MobGallery extends BottomMenu {
    generateEnemyPc(
      type: EnemyType,
      rarity: Rarity,
      dimensions: number,
    ): PetalContainer;
  }

  const mobGallery: MobGallery;

  class DeadMenu {
    draw();
  }
  
  const deadMenu: DeadMenu;

  /**
   * The current loadout, which stores petals that the user *is* equipping.
   */
  class Inventory {
    draw(alpha = 1);

    mouseDown({ mouseX, mouseY }: CanvasMouseData2, inv: Inventory);

    /**
     * If the given petal is close enough to any loadout petal, return the
     * closest loadout petal. Otherwise, return `false`.
     */
    getClosest(p: PetalContainer): PetalContainer | false;

    /**
     * Adds the currently dragged petal to this loadout at the slot closest to
     * the player's mouse, if the mouse is close enough (similarly to, but not
     * exactly the same as, {@linkcode getClosest}).
     * 
     * If the loadout slot is already occupied by a petal, that petal is also
     * sent back to the player's inventory.
     * 
     * @returns `true` if and only if the petal was successfully added.
     */
    addClosest(p: PetalContainer, globalInv: GlobalInventory): boolean;
  }

  const menuInventory: Inventory;

  class Enemy {
    type: EnemyType;

    draw();
  }

  class Flower {
    attacking: boolean;
    defending: boolean;
  }

  class Petal {
    constructor(data: any);
  }

  class PetalContainer {
    // Yes, PetalContainer is also used to display enemies
    petals: Petal[] | Enemy[];
    type: PetalType;
    rarity: Rarity;
    amount: number;
    x: number;
    y: number;
    w: number;
    h: number;
    radius: number;
    isHovered: boolean;
    statsBoxAlpha: number;
    render: {
      x: number;
      y: number;
      w: number;
    };
    nameless: boolean;
    stars?: {x: number, y: number}[];
    toOscillate: boolean;
    toSkipCulling: boolean;
    draggingTimer?: number;
    undraggingPetalContainerTimer?: number;
    lastDraggingAngle?: number;
    angleOffset?: number;

    /**
     * A number from 0 to 1 indicating the petal's progress through its
     * spawning animation.
     */
    spawnAnimation: number;

    /**
     * Unclear what this is supposed to be (seems to be currently unused)
     */
    interval?: any;
    
    /**
     * The y-position of this petal relative to the inventory menu.
     */
    relativeY?: number;

    /**
     * Whether or not this petal is being dragged.
     */
    isDraggingPetalContainer: boolean;

    /**
     * Whether or not this petal is a crafted petal being displayed in the
     * crafting menu.
     */
    isDisplayPetalContainer: boolean;

    /**
     * Whether or not to draw the cached Air petal in order to draw this
     * petal's background gradients.
     */
    shouldDrawCachedAir: boolean;

    constructor(
      petals: Petal[],
      args: any,
      id: number,
      amount: number,
      attempt?: number,
    )

    /**
     * Updates this petal's displayed location to make it smoothly approach the
     * petal's actual location.
     */
    updateInterpolate();

    draw(inGame?: boolean, number?: number);

    drawStatsBox(
      drawBelow: boolean = false,
      mob?: boolean,
      x: number = this.render.x,
      y: number = this.render.y
    );

    /**
     * Determines whether or not this petal should be animated, based on
     * whether it has an animation, and based on whether animations are
     * disabled in the settings.
     */
    shouldAnimate(): boolean;

    /**
     * Generates an image of this petal. For petals with animations, this is
     * called every frame in order to advance the animation.
     * @param quality The desired quality (affects resolution). Default: 62.5.
     * @param map Some data for drawing the image.
     * @param livePath Whether or not to also draw the image. Default: false.
     */
    generatePetalImage(quality: number, map: any, livePath?: boolean);

    /**
     * A helper function to draw this petal's shiny stars.
     * 
     * This code is copied from Flowr's base code.
     */
    drawStars();

    /**
     * Determines the scale at which to draw this petal. (1x scale = 50 units)
     */
    getScale(): number;

    /**
     * Determines the rotation at which to draw this petal, in radians.
     */
    getRotation(): number;
  }

  class StatsBox {
    draw();
  }

  const draggingPetalContainer: PetalContainer | null;

  /**
   * Handles the user dragging a petal to the given mouse coordinates.
   */
  let simulatedraggingPetalContainer: (x: number, y: number) => void;

  /**
   * In-game data for the length of time that each unloaded petal has been
   * reloading for.
   */
  const petalReloadData: Record<number, any>;

  // Yeah the Flowr devs actually skissued and forgot to capitalize 1st letter
  class enemyBox {
    type: EnemyType;
    amount: number;
    rarity: Rarity;
    isBoss: boolean;
    x: number;
    y: number;
    w: number;
    h: number;
    ec?: PetalContainer;
  }

  class Room {
    enemies: Record<number, Enemy>;
    enemyBoxes: enemyBox[];
    flowers: Record<number, Flower>;
  }

  let room: Room;

  class BiomeManager {
    mouseDown({ mouseX, mouseY }: CanvasMouseData2);
  }

  const biomeManager: BiomeManager;

  type MouseData = {
    x: number;
    y: number;
    canvasX: number;
    canvasY: number;
    clickPosition: "up" | "down";
    lastDownData: {
      time: number;
      x: number;
      y: number;
    };
  }

  // Ty flowr devs for being inconsistent with mouse data
  type CanvasMouseData = {x: number, y: number};
  type CanvasMouseData2 = {mouseX: number, mouseY: number};

  const mouse: MouseData;
  
  function mouseInBox(
    mouse: {x: number, y: number},
    box: {x: number, y: number, w: number, h: number}
  );

  class InputHandler {
    chatOpen: boolean;

    handleKey(e: KeyboardEvent);

    handleMouse(e: MouseEvent);
  }

  const inputHandler: InputHandler;

  let ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

  const canvas: HTMLCanvasElement & {
    // New fields added by flowr devs
    h: number;
    w: number;
    zoom: number;
  };

  let time: number; // How many milliseconds have passed since loading the game

  let dt: number; // The length of the previous tick/frame, in milliseconds.

  let fov: number;

  type ObjectRenderData = {x: number, y: number, radius: number};

  type CameraData = {x: number | "pass", y: number, disableCulling?: boolean};

  function toRender(obj1: ObjectRenderData, cam: CameraData);

  function easeOutCubic(x: number);

  function blendColor(color1: string, color2: string, ratio: number): string;

  function interpolate(start: number, end: number, time: number): number;
  
  function smoothstep(t: number);

  function setCursor(state: string);

  let draw: () => void;

  let renderGame: (dt: number) => void;

  let renderDebug: () => void;

  let savedRenderTransform: DOMMatrix;

  type HpBarData = {
    x: number;
    y: number;
    radius: number;
    hp: number;
    maxHp: number;
    beforeStreakHp: number;
    givenAlpha?: number;
    flowerName?: string;
    flowerUsername?: string;
    shield?: number;
    team?: string;
  }

  type HpEntityData = {
    fadeState: string;
    fadeTime: number;
    lastHp: number;
    hp?: number;
    id?: number;
  }

  let renderHpBar: (data: HpBarData, entity?: HpEntityData) => void;

  const chatDiv: HTMLDivElement;

  function appendChatAnnouncement(msg: string, color: string);

  let sendRoomRequest: (msg: {
    findPublic?: true,
    newSquad?: true,
    findPrivate?: true,
    biome: number,
    squadCode?: string,
  }) => void;

  /**
   * The menus at the top of the screen (settings, changelog)
   */
  class TopMenu {
    x: number;
    y: number;
    w: number;
    h: number;
    offset: number;
    active: boolean;

    /**
     * The y-position of this menu on the canvas. This value changes when the
     * menu is opened or closed.
     * 
     * Note: This value is only used by this script, and will not affect any of
     * Flowr's base code operations.
     */
    renderY: number;

    toggle();
  }

  type Menu = TopMenu | BottomMenu;

  class SettingsMenu extends TopMenu {
    targetOffset: number;
    currentHeight: number;
    options: readonly (SettingsOption | SettingsSectionHeading)[];

    draw();
    
    renderOption(option: SettingsOption);

    renderToggle(option: BooleanOption);

    mouseDown(e: CanvasMouseData);

    mouseMove(e: CanvasMouseData);

    processToggle(t: BooleanOption, e: CanvasMouseData);
  }

  const settingsMenu: SettingsMenu;

  class Changelog extends TopMenu {
    hoveringOverX: boolean;

    generateEntries();

    draw();

    mouseMove(e: CanvasMouseData2);

    mouseDown(e: CanvasMouseData2);

    mouseUp(e: CanvasMouseData2);

    updateScroll(
      delta: {x: number, y: number}, mouse: CanvasMouseData2
    );
  }

  const changelog: Changelog;

  const changelogButton: HTMLDivElement;

  type ChangelogEntry = {text: string, date: string};

  const changeloglist: ChangelogEntry[];

  class SquadUI {
    render(dt: number);

    /**
     * Handles the user clicking on the Starting Wave slider.
     */
    startSliderDrag(x: number);
  }

  const squadUI: SquadUI;

  const ws: WebSocket;

  let initWS: () => void;

  const msgpackr: {
    pack(msg: any): any;
    unpack(msg: any): any;
  }

  function send(data: any, forceSend?: boolean);

  let processGameMessageMap: Record<
    "newPetalContainer",
    (data: any, _me?: any, _advanced?: any) => void
  >;

  let enterGame: () => void;

  /**
   * The current version of Flowr's client code.
   */
  let ver: string;
}

export {};