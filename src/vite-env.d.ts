/// <reference types="vite/client" />
/// <reference types="vite-plugin-monkey/client" />
//// <reference types="vite-plugin-monkey/global" />
/// <reference types="vite-plugin-monkey/style" />


/**
 * We declare the `Type`s of objects from flowr's client code here,
 * so that our other ts files can use them.
 */
declare global {
  interface Window {
    selfId?: number;
    state?: string;
  }

  type PetalType = string; // TODO: List of actually existing petal types?
  type EnemyType = string; // TODO: List of actually existing enemy types?

  /**
   * Calculates the success chance of crafting a (`rarity + 1`) petal on
   * attempt number (`attempt + 1`).
   */
  function calculateChance(attempt: number, rarity: Rarity);

  class CraftingMenu {
    w: number;
    h: number;
    lastOpenTime: number;
    lastCloseTime: number;
    petalContainerSize: number;
    craftingPetalContainers: PetalContainer[];
    previewPetalContainer: PetalContainer | undefined;
    
    previewPetalSlot: {
      x: number;
      y: number;
      w: number;
      h: number;
    };

    drawInventory(alpha: number = 1);

    getSlotColor();

    addCraftingPetalContainers(
      type: PetalType,
      rarity: number,
      amount: number,
      attempt: number
    );

    removeCraftingPetalContainers();

    enterGame();
  }

  const craftingMenu: CraftingMenu;

  class DeadMenu {
    draw();
  }
  
  const deadMenu: DeadMenu;

  class Enemy {
    type: EnemyType;

    draw();
  }

  class Petal {
    constructor(data: any);
  }

  class PetalContainer {
    type: PetalType;
    rarity: number;
    amount: number;
    w: number;
    h: number;
    isHovered: boolean;
    render: {
      x: number;
      y: number;
      w: number;
    }

    constructor(
      petals: Petal[],
      args: any,
      id: number,
      amount: number,
      attempt?: number,
    )

    draw();

    drawStatsBox(
      drawBelow: boolean = false,
      mob?: boolean,
      x: number = this.render.x,
      y: number = this.render.y
    );
  }

  class Room {
    enemies: Record<number, Enemy>;
  }

  let room: Room;

  class MouseData {
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

  const mouse: MouseData;
  
  function mouseInBox(
    {x: number, y: number},
    box: {x: number, y: number, w: number, h: number}
  );

  class InputHandler {
    chatOpen: boolean;

    handleKey(e: KeyboardEvent);
  }

  const inputHandler: InputHandler;

  const ctx: CanvasRenderingContext2D;

  const canvas: HTMLCanvasElement & {
    // New fields added by flowr devs
    h: number;
    w: number;
    zoom: number;
  };

  let time: number; // Used for tracking how long each frame is?

  let fov: number;

  function easeOutCubic(x: number);

  let renderGame: (dt: number) => void;

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

  class SettingsMenu {
    // A temporary dev backdoor before a proper settings menu is created.
    cinderSetting(key: SettingsKey, value: any): void;
  }

  const settingsMenu: SettingsMenu;

  const ws: WebSocket;

  let processGameMessageMap: {
    newPetalContainer: (data: any, _me?: any, _advanced?: any) => void;
  };
}

export {};