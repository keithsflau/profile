import { create } from "zustand";
import { boardSpaces, colorGroups } from "../data/board";
import { fateCards, opportunityCards } from "../data/cards";
import { getRandomQuestion, type QuizQuestion } from "../data/questions";
import type {
  BoardSpace,
  CardAction,
  CardDeckType,
  CardDefinition,
  DrawnCard,
  PlayerState,
  PropertyState,
  SpaceType,
} from "../types";

const PLAYER_COLORS = ["#ef476f", "#118ab2", "#06d6a0", "#ffd166"];

const initialProperties = boardSpaces.reduce<Record<number, PropertyState>>(
  (acc, space) => {
    if (
      space.type === "property" ||
      space.type === "railroad" ||
      space.type === "utility"
    ) {
      acc[space.id] = { ownerId: undefined, houses: 0, academy: false };
    }
    return acc;
  },
  {}
);

const shuffle = <T,>(input: T[]): T[] => {
  const array = [...input];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

type Phase = "lobby" | "playing";

interface GameStore {
  phase: Phase;
  board: BoardSpace[];
  players: PlayerState[];
  propertyStates: Record<number, PropertyState>;
  decks: Record<CardDeckType, CardDefinition[]>;
  discard: Record<CardDeckType, CardDefinition[]>;
  currentPlayerIndex: number;
  pendingPurchase?: number;
  pendingQuiz?: { question: QuizQuestion; spaceId: number };
  drawnCard?: DrawnCard;
  pendingSpecial?: {
    type: "library" | "canteen" | "oratory";
    playerId: string;
  };
  log: string[];
  roomCode: string;
  selfId: string;
  lastDice?: [number, number];
  actions: {
    setRoomCode: (code: string) => void;
    configurePlayers: (names: string[]) => void;
    startGame: () => void;
    rollDice: () => void;
    endTurn: () => void;
    purchaseProperty: () => void;
    skipPurchase: () => void;
    answerQuiz: (correct: boolean) => void;
    drawCard: (deck: CardDeckType) => void;
    closeCard: () => void;
    buildHouse: (spaceId: number) => void;
    upgradeAcademy: (spaceId: number) => void;
    consumeUpgradeCredit: (spaceId: number) => void;
    resolveSpecial: (
      payload:
        | { type: "library" | "canteen"; choice: "resource" | "card" }
        | { type: "oratory"; success: boolean }
    ) => void;
    syncFromRemote: (state: Partial<GameStoreStateSnapshot>) => void;
  };
}

export interface GameStoreStateSnapshot {
  phase: Phase;
  players: PlayerState[];
  propertyStates: Record<number, PropertyState>;
  decks: Record<CardDeckType, CardDefinition[]>;
  discard: Record<CardDeckType, CardDefinition[]>;
  currentPlayerIndex: number;
  pendingPurchase?: number;
  pendingQuiz?: { question: QuizQuestion; spaceId: number };
  drawnCard?: DrawnCard;
  pendingSpecial?: {
    type: "library" | "canteen" | "oratory";
    playerId: string;
  };
  log: string[];
  lastDice?: [number, number];
}

export const createSnapshot = (state: GameStore): GameStoreStateSnapshot => ({
  phase: state.phase,
  players: state.players,
  propertyStates: state.propertyStates,
  decks: state.decks,
  discard: state.discard,
  currentPlayerIndex: state.currentPlayerIndex,
  pendingPurchase: state.pendingPurchase,
  pendingQuiz: state.pendingQuiz,
  drawnCard: state.drawnCard,
  pendingSpecial: state.pendingSpecial,
  log: state.log,
  lastDice: state.lastDice,
});

const initialState: Omit<GameStore, "actions"> = {
  phase: "lobby",
  board: boardSpaces,
  players: [],
  propertyStates: initialProperties,
  decks: {
    opportunity: shuffle(opportunityCards),
    fate: shuffle(fateCards),
  },
  discard: {
    opportunity: [],
    fate: [],
  },
  currentPlayerIndex: 0,
  log: [],
  roomCode: "",
  selfId: crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2),
  pendingSpecial: undefined,
};

const applyResourceChange = (
  player: PlayerState,
  amount: number,
  log: string[]
) => {
  player.resources += amount;
  log.push(
    amount >= 0
      ? `${player.name} 獲得 ${amount} 語文資源`
      : `${player.name} 支付 ${Math.abs(amount)} 語文資源`
  );
};

const findNextSpaceByType = (
  start: number,
  type: SpaceType,
  board: BoardSpace[]
) => {
  let idx = start;
  for (let i = 0; i < board.length; i += 1) {
    idx += 1;
    if (idx > board.length) idx = 1;
    if (board[idx - 1].type === type) {
      return idx;
    }
  }
  return start;
};

const calculateRent = (
  space: BoardSpace,
  state: PropertyState | undefined,
  owner: PlayerState | undefined
) => {
  if (!space.baseRent || !state || !owner) {
    return 0;
  }
  let rent = space.baseRent;
  if (state.academy) {
    rent = space.baseRent * 3;
  } else if (state.houses > 0) {
    rent = Math.round(space.baseRent * (1 + state.houses * 0.5));
  }
  if (space.color) {
    const group = colorGroups[space.color];
    const ownsSet = group?.every((id) => owner.properties.includes(id));
    if (ownsSet) {
      rent = Math.round(rent * 1.1);
    }
  }
  return rent;
};

const ownsColorSet = (player: PlayerState, color?: string) => {
  if (!color) return false;
  const group = colorGroups[color];
  return !!group && group.every((id) => player.properties.includes(id));
};

const canBuildHouse = (
  player: PlayerState,
  space: BoardSpace,
  propertyState: PropertyState
) => {
  if (space.type !== "property" || !space.color) return false;
  if (!ownsColorSet(player, space.color)) return false;
  if (propertyState.academy) return false;
  return propertyState.houses < 4;
};

const canUpgradeAcademy = (
  player: PlayerState,
  space: BoardSpace,
  propertyState: PropertyState
) =>
  space.type === "property" &&
  propertyState.houses === 4 &&
  !propertyState.academy &&
  ownsColorSet(player, space.color);

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,
  actions: {
    setRoomCode: (code) => set({ roomCode: code }),
    configurePlayers: (names) =>
      set((state) => {
        const sanitized = names
          .map((n) => n.trim())
          .filter(Boolean)
          .slice(0, 4);
        const players: PlayerState[] = sanitized.map((name, index) => ({
          id: crypto.randomUUID
            ? crypto.randomUUID()
            : Math.random().toString(36).slice(2),
          name,
          color: PLAYER_COLORS[index % PLAYER_COLORS.length],
          position: 1,
          resources: 1500,
          rentShield: false,
          upgradeCredits: 0,
          skipTurns: 0,
          inJail: false,
          properties: [],
        }));
        return {
          ...state,
          players,
          currentPlayerIndex: 0,
          propertyStates: structuredClone(initialProperties),
          decks: {
            opportunity: shuffle(opportunityCards),
            fate: shuffle(fateCards),
          },
          discard: { opportunity: [], fate: [] },
          pendingPurchase: undefined,
          drawnCard: undefined,
          pendingSpecial: undefined,
          log: ["已設定玩家名單，準備開始冒險！"],
          phase: players.length ? "lobby" : state.phase,
        };
      }),
    startGame: () =>
      set((state) => ({
        ...state,
        phase: state.players.length ? "playing" : "lobby",
        currentPlayerIndex: 0,
        log: [
          ...state.log,
          state.players.length
            ? "語文冒險正式開始！"
            : "尚未設定玩家，無法開始。",
        ],
      })),
    rollDice: () => {
      const state = get();
      if (state.phase !== "playing" || !state.players.length) return;
      const player = state.players[state.currentPlayerIndex];
      if (player.skipTurns > 0) {
        player.skipTurns -= 1;
        if (player.skipTurns === 0) {
          player.inJail = false;
        }
        set({
          players: [...state.players],
          log: [...state.log, `${player.name} 暫停一回合，剩餘 ${player.skipTurns}`],
        });
        return;
      }
      const dice: [number, number] = [
        Math.ceil(Math.random() * 6),
        Math.ceil(Math.random() * 6),
      ];
      let steps = dice[0] + dice[1];
      let newPos = player.position + steps;
      let log = [...state.log, `${player.name} 擲出 ${dice[0]} 與 ${dice[1]}`];
      if (newPos > state.board.length) {
        newPos = ((newPos - 1) % state.board.length) + 1;
        player.resources += 200;
        log.push(`${player.name} 通過起點，獲得 200 資源`);
      }
      player.position = newPos;
      const landedSpace = state.board[newPos - 1];
      log.push(`${player.name} 來到「${landedSpace.name}」`);
      const toDraw = handleLanding(landedSpace, player, state, log, dice[0] + dice[1]);
      set({
        players: [...state.players],
        propertyStates: { ...state.propertyStates },
        pendingPurchase: get().pendingPurchase,
        pendingSpecial: get().pendingSpecial,
        decks: { ...state.decks },
        discard: { ...state.discard },
        drawnCard: get().drawnCard,
        log,
        lastDice: dice,
      });
      if (toDraw) {
        setTimeout(() => {
          get().actions.drawCard(toDraw);
        }, 400);
      }
    },
    endTurn: () =>
      set((state) => ({
        ...state,
        currentPlayerIndex: (state.currentPlayerIndex + 1) % state.players.length,
        pendingPurchase: undefined,
        pendingQuiz: undefined,
        pendingSpecial: undefined,
        drawnCard: undefined,
        lastDice: undefined,
      })),
    purchaseProperty: () =>
      set((state) => {
        if (!state.pendingPurchase) return state;
        const player = state.players[state.currentPlayerIndex];
        const space = state.board[state.pendingPurchase - 1];
        if (!space.cost || player.resources < space.cost) {
          return {
            ...state,
            log: [...state.log, `${player.name} 資源不足，無法購買 ${space.name}`],
            pendingPurchase: undefined,
          };
        }
        if (state.pendingQuiz) {
          return state;
        }
        const question = getRandomQuestion();
        return {
          ...state,
          pendingQuiz: { question, spaceId: state.pendingPurchase },
        };
      }),
    answerQuiz: (correct: boolean) =>
      set((state) => {
        if (!state.pendingQuiz) return state;
        const player = state.players[state.currentPlayerIndex];
        const space = state.board[state.pendingQuiz.spaceId - 1];
        const log = [...state.log];

        if (correct) {
          if (!space.cost || player.resources < space.cost) {
            log.push(`${player.name} 答對了，但資源不足，無法購買 ${space.name}`);
            return {
              ...state,
              players: [...state.players],
              log,
              pendingPurchase: undefined,
              pendingQuiz: undefined,
            };
          }
          player.resources -= space.cost;
          player.properties.push(space.id);
          state.propertyStates[space.id] = {
            ownerId: player.id,
            houses: 0,
            academy: false,
          };
          log.push(
            `${player.name} 答對了問題，成功購買 ${space.name}（-${space.cost}）`
          );
        } else {
          log.push(
            `${player.name} 答錯了問題，無法購買 ${space.name}。要繼續學習！`
          );
        }
        return {
          ...state,
          players: [...state.players],
          propertyStates: { ...state.propertyStates },
          log,
          pendingPurchase: undefined,
          pendingQuiz: undefined,
        };
      }),
    skipPurchase: () =>
      set((state) => ({
        ...state,
        pendingPurchase: undefined,
        pendingQuiz: undefined,
      })),
    drawCard: (deck) => {
      const state = get();
      const cards = state.decks[deck];
      const discard = state.discard[deck];
      if (!cards.length) {
        state.decks[deck] = shuffle(discard);
        state.discard[deck] = [];
      }
      const [card, ...rest] = state.decks[deck];
      state.decks[deck] = rest;
      state.discard[deck] = [...state.discard[deck], card];
      const drawn: DrawnCard = {
        id: `${deck}-${card.id}-${Date.now()}`,
        deck,
        card,
        timestamp: Date.now(),
      };
      const log = [...state.log, `${state.players[state.currentPlayerIndex].name} 抽到「${card.title}」`];
      const queued: CardDeckType[] = [];
      applyCardActions(card.actions, state, log, queued);
      set({
        decks: { ...state.decks },
        discard: { ...state.discard },
        drawnCard: drawn,
        players: [...state.players],
        propertyStates: { ...state.propertyStates },
        pendingPurchase: state.pendingPurchase,
        pendingSpecial: state.pendingSpecial,
        log,
      });
      queued.forEach((nextDeck, index) => {
        setTimeout(() => {
          get().actions.drawCard(nextDeck);
        }, 400 * (index + 1));
      });
    },
    closeCard: () => set({ drawnCard: undefined }),
    buildHouse: (spaceId) =>
      set((state) => {
        const player = state.players[state.currentPlayerIndex];
        const space = state.board[spaceId - 1];
        const propertyState = state.propertyStates[spaceId];
        if (!space || !propertyState || propertyState.ownerId !== player.id) {
          return state;
        }
        if (!canBuildHouse(player, space, propertyState)) {
          return state;
        }
        const cost = Math.round((space.cost ?? 0) * 0.5);
        if (player.resources < cost) {
          return {
            ...state,
            log: [...state.log, `${player.name} 資源不足，無法建造字屋。`],
          };
        }
        player.resources -= cost;
        propertyState.houses += 1;
        const log = [
          ...state.log,
          `${player.name} 在 ${space.name} 建造字屋（-${cost}）`,
        ];
        return {
          ...state,
          players: [...state.players],
          propertyStates: { ...state.propertyStates },
          log,
        };
      }),
    upgradeAcademy: (spaceId) =>
      set((state) => {
        const player = state.players[state.currentPlayerIndex];
        const space = state.board[spaceId - 1];
        const propertyState = state.propertyStates[spaceId];
        if (!space || !propertyState || propertyState.ownerId !== player.id) {
          return state;
        }
        if (!canUpgradeAcademy(player, space, propertyState)) {
          return state;
        }
        const cost = Math.round((space.cost ?? 0));
        if (player.resources < cost) {
          return {
            ...state,
            log: [...state.log, `${player.name} 資源不足，無法升級書院。`],
          };
        }
        player.resources -= cost;
        propertyState.academy = true;
        const log = [
          ...state.log,
          `${player.name} 將 ${space.name} 升級為書院（-${cost}）`,
        ];
        return {
          ...state,
          players: [...state.players],
          propertyStates: { ...state.propertyStates },
          log,
        };
      }),
    consumeUpgradeCredit: (spaceId) =>
      set((state) => {
        const player = state.players[state.currentPlayerIndex];
        if (!player.upgradeCredits) return state;
        const space = state.board[spaceId - 1];
        const propertyState = state.propertyStates[spaceId];
        if (!space || !propertyState || propertyState.ownerId !== player.id) {
          return state;
        }
        if (!canBuildHouse(player, space, propertyState)) {
          return state;
        }
        player.upgradeCredits -= 1;
        propertyState.houses += 1;
        const log = [
          ...state.log,
          `${player.name} 使用免費升級卡在 ${space.name} 建造字屋。`,
        ];
        return {
          ...state,
          players: [...state.players],
          propertyStates: { ...state.propertyStates },
          log,
        };
      }),
    resolveSpecial: (payload) => {
      const state = get();
      const pending = state.pendingSpecial;
      if (!pending || pending.type !== payload.type) {
        return;
      }
      const player = state.players.find((p) => p.id === pending.playerId);
      if (!player) return;
      const log = [...state.log];
      if ((payload.type === "library" || payload.type === "canteen") && payload.choice === "resource") {
        applyResourceChange(
          player,
          payload.type === "library" ? 50 : 100,
          log
        );
      } else if (payload.type === "oratory") {
        if (payload.success) {
          applyResourceChange(player, 50, log);
          log.push(`${player.name} 完成口語任務，獲得讚賞！`);
        } else {
          applyResourceChange(player, -30, log);
          log.push(`${player.name} 需要更多練習，支付 30 資源。`);
        }
      } else {
        log.push(
          `${player.name} 選擇抽取 ${
            payload.type === "library" ? "命運" : "補給"
          } 卡。`
        );
      }
      set({
        players: [...state.players],
        log,
        pendingSpecial: undefined,
      });
      if (
        (payload.type === "library" || payload.type === "canteen") &&
        payload.choice === "card"
      ) {
        setTimeout(() => {
          get().actions.drawCard("fate");
        }, 350);
      }
    },
    syncFromRemote: (snapshot) =>
      set((state) => ({
        ...state,
        ...snapshot,
      })),
  },
}));

const handleLanding = (
  space: BoardSpace,
  player: PlayerState,
  state: GameStore,
  log: string[],
  diceTotal?: number
): CardDeckType | null => {
  state.pendingPurchase = undefined;
  state.pendingSpecial = undefined;
  if (space.type === "property") {
    return handleOwnershipSpace(space, player, state, log);
  }
  if (space.type === "railroad") {
    return handleOwnershipSpace(space, player, state, log, {
      kind: "railroad",
      diceTotal,
    });
  }
  if (space.type === "utility") {
    return handleOwnershipSpace(space, player, state, log, {
      kind: "utility",
      diceTotal,
    });
  }
  if (space.type === "chance") {
    return "opportunity";
  }
  if (space.type === "fate") {
    return "fate";
  }
  if (space.type === "corner") {
    handleCorner(space, player, state, log);
    return null;
  }
  if (space.type === "special") {
    handleSpecial(space, player, state, log);
    return null;
  }
  return null;
};

const handleOwnershipSpace = (
  space: BoardSpace,
  player: PlayerState,
  state: GameStore,
  log: string[],
  options?: { kind?: "railroad" | "utility"; diceTotal?: number }
) => {
  const propertyState =
    state.propertyStates[space.id] ??
    (state.propertyStates[space.id] = {
      ownerId: undefined,
      houses: 0,
      academy: false,
    });
  if (!propertyState.ownerId) {
    state.pendingPurchase = space.cost ? space.id : undefined;
    if (space.cost) {
      log.push(`${space.name} 無人管理，可用 ${space.cost} 資源購買。`);
    }
    return null;
  }
  state.pendingPurchase = undefined;
  if (propertyState.ownerId === player.id) {
    log.push(`${player.name} 是此地的管理員。`);
    return null;
  }
  const owner = state.players.find((p) => p.id === propertyState.ownerId);
  if (!owner) return null;
  if (player.rentShield) {
    player.rentShield = false;
    log.push(`${player.name} 使用免租盾牌，免付租金。`);
    return null;
  }
  let rent = 0;
  if (options?.kind === "railroad") {
    const count = owner.properties.filter(
      (id) => state.board[id - 1]?.type === "railroad"
    ).length;
    rent = 25 * Math.pow(2, Math.max(0, count - 1));
  } else if (options?.kind === "utility") {
    const count = owner.properties.filter(
      (id) => state.board[id - 1]?.type === "utility"
    ).length;
    const total = options?.diceTotal && options.diceTotal > 0 ? options.diceTotal : 7;
    rent = total * (count >= 2 ? 20 : 10);
  } else {
    rent = calculateRent(space, propertyState, owner);
  }
  applyResourceChange(player, -rent, log);
  applyResourceChange(owner, rent, log);
  return null;
};

const handleCorner = (
  space: BoardSpace,
  player: PlayerState,
  state: GameStore,
  log: string[]
) => {
  switch (space.id) {
    case 1:
      applyResourceChange(player, 200, log);
      break;
    case 10:
      applyResourceChange(player, -75, log);
      log.push(`${player.name} 參加語文活動中心工作坊。`);
      break;
    case 20:
      player.inJail = true;
      player.skipTurns = Math.max(player.skipTurns, 1);
      log.push(`${player.name} 進入語文修養室，需休息一回合。`);
      break;
    case 31:
      state.pendingSpecial = { type: "canteen", playerId: player.id };
      log.push(`${player.name} 抵達餐膳補給站，選擇領取補給或抽卡。`);
      break;
    default:
      break;
  }
};

const handleSpecial = (
  space: BoardSpace,
  player: PlayerState,
  state: GameStore,
  log: string[]
) => {
  if (space.id === 17) {
    state.pendingSpecial = { type: "library", playerId: player.id };
    log.push(`${player.name} 進入免費圖書室，選擇領 50 資源或抽卡。`);
    return;
  }
  if (space.id === 38) {
    state.pendingSpecial = { type: "oratory", playerId: player.id };
    log.push(`${player.name} 進入口語表達廣場，決定挑戰或略過。`);
    return;
  }
  log.push(space.description);
};

const movePlayerBy = (
  player: PlayerState,
  steps: number,
  state: GameStore,
  log: string[]
): CardDeckType | null => {
  if (steps === 0) return null;
  let newPos = player.position + steps;
  const total = state.board.length;
  if (steps > 0) {
    while (newPos > total) {
      newPos -= total;
      applyResourceChange(player, 200, log);
      log.push(`${player.name} 再次通過起點。`);
    }
  } else {
    while (newPos < 1) {
      newPos += total;
    }
  }
  player.position = newPos;
  const space = state.board[newPos - 1];
  log.push(`${player.name} 來到「${space.name}」`);
  return handleLanding(space, player, state, log);
};

const movePlayerTo = (
  player: PlayerState,
  target: number,
  state: GameStore,
  log: string[],
  awardOnPass = true
): CardDeckType | null => {
  if (awardOnPass && target <= player.position) {
    applyResourceChange(player, 200, log);
  }
  player.position = target;
  const space = state.board[target - 1];
  log.push(`${player.name} 來到「${space.name}」`);
  return handleLanding(space, player, state, log);
};

const applyCardActions = (
  actions: CardAction[] | undefined,
  state: GameStore,
  log: string[],
  queuedDraws: CardDeckType[]
) => {
  if (!actions?.length) return;
  const player = state.players[state.currentPlayerIndex];
  actions.forEach((action) => {
    switch (action.kind) {
      case "resource":
        applyResourceChange(player, action.amount, log);
        break;
      case "move":
        {
          const result = movePlayerBy(player, action.steps, state, log);
          if (result) queuedDraws.push(result);
        }
        break;
      case "moveToNearest":
        {
          const target = findNextSpaceByType(
            player.position,
            action.target,
            state.board
          );
          const result = movePlayerTo(
            player,
            target,
            state,
            log,
            target <= player.position
          );
          if (result) queuedDraws.push(result);
        }
        break;
      case "teleport":
        {
          const award =
            action.awardOnPass ?? action.targetSpaceId > player.position;
          const result = movePlayerTo(
            player,
            action.targetSpaceId,
            state,
            log,
            award
          );
          if (result) queuedDraws.push(result);
        }
        break;
      case "draw":
        queuedDraws.push(action.deck);
        break;
      case "grantShield":
        player.rentShield = true;
        log.push(`${player.name} 獲得一次免租盾牌。`);
        break;
      case "grantUpgrade":
        player.upgradeCredits += 1;
        log.push(`${player.name} 獲得免費建屋資格。`);
        break;
      case "chargeOthers":
        state.players.forEach((p) => {
          if (p.id === player.id) return;
          applyResourceChange(p, -action.amount, log);
          applyResourceChange(player, action.amount, log);
        });
        break;
      case "allPay":
        state.players.forEach((p) => {
          applyResourceChange(p, -action.amount, log);
        });
        break;
      case "enterJail":
        player.inJail = true;
        player.skipTurns = Math.max(player.skipTurns, 1);
        player.position = 20;
        log.push(`${player.name} 被送往語文修養室。`);
        break;
      case "skipTurn":
        player.skipTurns += 1;
        log.push(`${player.name} 需暫停一回合。`);
        break;
      case "none":
      default:
        break;
    }
  });
};

export const getGameSnapshot = () =>
  createSnapshot(useGameStore.getState());

