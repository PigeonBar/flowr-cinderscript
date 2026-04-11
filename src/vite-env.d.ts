/// <reference types="vite/client" />
/// <reference types="vite-plugin-monkey/client" />

import type { Rarity } from "./enums";
import type { MobCounter } from "./features/mobGalleryKillCounter";
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
     * Whether or not the user is spectating a different player's room.
     */
    spectating: boolean;

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

    /**
     * The timestamp for the most recent message received via the WebSocket.
     */
    lastMessageTimeReceived: number;
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
    x: number;

    /**
     * The percentages that this gallery is scrolled horizontally and
     * vertically, as numbers between 0 and 1.
     */
    scroll: {render: {x: number, y: number}};

    /**
     * The total dimensions of the gallery's entries, minus the gallery's own
     * dimensions. This is multiplied by {@linkcode scroll scroll.render} to
     * determine the gallery entries' translations due to scrolling.
     */
    scrollExcess: {x: number, y: number};

    /**
     * The mob gallery's contents, as follows:
     * - `PetalContainer`: A container displaying a mob as usual.
     * - `false`: An empty tile because the player has not discovered the mob.
     * - `true`: An empty tile that still needs to generate the mob's image.
     */
    rows: Record<EnemyType, (PetalContainer | boolean)[]>;

    /**
     * Whether or not the gallery should regenerate all of its entries the next
     * time it is drawn.
     */
    toRegenerate: boolean;

    /**
     * Whether or not the mob gallery can be displayed outside the menu screen.
     * Specifically, when outside the menu screen, the mob gallery is displayed
     * iff {@linkcode activeOutsideMenu} and {@linkcode menuActive} are both
     * `true`.
     * 
     * Currently, this field can only be toggled using dev tools.
     */
    activeOutsideMenu: boolean;

    /**
     * The stat that this mob gallery is currently counting. Available options
     * are "Kills", "Kills+", "Spawns", and "Spawns+". Setting this field to
     * any other value will disable counting.
     */
    countMode: string;

    draw();

    generateEnemyPc(
      type: EnemyType,
      rarity: Rarity,
      dimensions: number,
    ): PetalContainer;

    /**
     * Returns the stat counter currently being used, based on
     * {@linkcode countMode}.
     */
    getStatCounter(): MobCounter | undefined;

    /**
     * Determines the colour that should be used to display the currectly
     * displayed stat, based on {@linkcode countMode}.
     */
    getStatTextColour(): string;

    /**
     * Set the stat that this mob gallery is currently counting, and also
     * updates all of the gallery entries to display the new stat. Available
     * options are "Kills", "Kills+", "Spawns", and "Spawns+". Using any other
     * value will disable counting.
     */
    setCountMode(value: string);

    /**
     * Updates this gallery's displayed stat for the given mob of the given
     * rarity, based on {@linkcode getStatCounter}, and also returns the stat.
     */
    updateStat(type: EnemyType, rarity: Rarity): number;
  }

  const mobGallery: MobGallery;

  /**
   * A record of whether the user has encountered each mob of each rarity.
   */
  const discoveredEnemies: Partial<Record<EnemyType, (boolean | null)[]>>;

  /**
   * Records the user as having encountered the given mob of the given rarity.
   */
  let addDiscoveredEnemy: (type?: EnemyType, rarity?: Rarity) => void;

  class DeadMenu {
    draw();
  }
  
  const deadMenu: DeadMenu;

  /**
   * The current loadout, which stores petals that the user *is* equipping.
   */
  class Inventory {
    topPetalSlots: PetalSlot[];
    bottomPetalSlots: PetalSlot[];
    topPetalContainers: Record<number, PetalContainer | undefined>;
    bottomPetalContainers: Record<number, PetalContainer | undefined>;
    translateY: number;

    draw(alpha = 1);

    mouseDown({ mouseX, mouseY }: CanvasMouseData2, inv: Inventory);

    swapPetals(index: number, toSend?: boolean);

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

  /**
   * The loadout object used on the menu screen.
   */
  const menuInventory: Inventory;

  /**
   * The loadout object used during runs.
   */
  const inventory: Inventory;

  class Enemy {
    type: EnemyType;
    rarity: Rarity;
    xp: number;
    isBoss?: boolean;
    statsBoxAlpha: number;

    /**
     * Whether or not this mob is the head segment of a Leech-like mob.
     */
    isHead?: boolean;

    /**
     * The multiplier applied to this mob's loot, based on whether it spawned
     * during a lucky wave, etc..
     */
    lootMultiplier: number;

    draw();

    drawStatsBox(drawBelow?: boolean, rarityOverride?: boolean);
  }

  class Flower {
    attacking: boolean;
    defending: boolean;
  }
  
  /**
   * A slot that can be empty or occupied by a petal.
   */
  class PetalSlot {
    x: number;
    y: number;
    size: number;
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
     * Whether or not this petal is greyed out (e.g., due to being a petal from
     * an unofficial biome).
     */
    greyed: boolean;

    /**
     * The timestamp for the most recent time that this container's
     * {@linkcode amount} was changed.
     */
    lastAmountChangedTime: number;

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
     * A helper function to draw this petal's amount counter.
     * 
     * This code is copied from Flowr's base code.
     * 
     * @param textColour The text colour to use.
     */
    drawAmount(textColour?: string);

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
    x: number;
    y: number;
    w: number;
    h: number;
    amount: number;
    image?: OffscreenCanvas;
    name: string;
    rarity: Rarity;

    /**
     * A list of rows of text for this stats box's description. Each row may be
     * further split into blocks of text with different colours. `written`
     * refers to the physical width of each block of text.
     */
    finalDesc: {text: string, color: string, written: number}[][];
    
    /**
     * Whether or not this stats box is being displayed for a gallery entry, in
     * which case it also displays the stat being tracked by the gallery.
     */
    isGallery: boolean;

    draw();

    /**
     * Generates and returns the stats box's image.
     * 
     * Only use this function if this stats box is for an {@linkcode Enemy}.
     * If this stats box is for a {@linkcode Petal}, use {@linkcode genPcBox}
     * instead.
     */
    genEcBox(): OffscreenCanvas;

    /**
     * Generates and returns the stats box's image.
     * 
     * Only use this function if this stats box is for a {@linkcode Petal}.
     * If this stats box is for an {@linkcode Enemy}, use {@linkcode genEcBox}
     * instead.
     */
    genPcBox(): OffscreenCanvas;

    /**
     * Generates this stats box's {@linkcode finalDesc}, and then returns the
     * required dimensions to contain the text.
     */
    generateDesc(min: number, max: number): { width: number, height: number };
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

    /**
     * The number of "lucky" stacks applied to the current wave, if it is
     * lucky; `undefined` otherwise.
     */
    shinyWave?: number;
  }

  let room: Room;

  /**
   * A list of all boss mobs that are currently alive.
   */
  const bosses: Enemy[];

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

  /**
   * Returns a string representing the given amount after formatting it using
   * abbreviations (e.g., 6700 = 6.7k).
   */
  function formatAmount(amount: number): string;

  function setCursor(state: string);

  let draw: () => void;

  let renderMenu: (dt: number) => void;

  let renderGame: (dt: number) => void;

  let renderDebug: () => void;

  let savedRenderTransform: DOMMatrix;

  const cachedImages: {
    statBoxes: {
      enemies: Partial<Record<string, StatsBox>>;
    }
  }

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
    "newEnemy" | "newPetalContainer" | "removeEnemy" ,
    (data: any, _me?: any, _advanced?: any) => void
  >;

  let enterGame: () => void;

  /**
   * The current version of Flowr's client code.
   */
  let ver: string;

  /**
   * The user's current account username.
   */
  let username: string;
}

export {};