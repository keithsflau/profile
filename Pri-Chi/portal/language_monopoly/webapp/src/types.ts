export type SpaceType =
  | "start"
  | "property"
  | "chance"
  | "fate"
  | "utility"
  | "railroad"
  | "corner"
  | "special";

export interface BoardSpace {
  id: number;
  name: string;
  type: SpaceType;
  color?: string;
  cost?: number;
  baseRent?: number;
  description: string;
  extra?: string;
}

export type CardDeckType = "opportunity" | "fate";

export type CardAction =
  | { kind: "resource"; amount: number }
  | { kind: "move"; steps: number }
  | { kind: "moveToNearest"; target: SpaceType }
  | { kind: "teleport"; targetSpaceId: number; awardOnPass?: boolean }
  | { kind: "draw"; deck: CardDeckType }
  | { kind: "grantShield" }
  | { kind: "grantUpgrade" }
  | { kind: "chargeOthers"; amount: number }
  | { kind: "allPay"; amount: number }
  | { kind: "enterJail" }
  | { kind: "skipTurn" }
  | { kind: "none" };

export interface CardDefinition {
  id: number;
  title: string;
  description: string;
  actions?: CardAction[];
}

export interface PropertyState {
  ownerId?: string;
  houses: number;
  academy: boolean;
}

export interface PlayerState {
  id: string;
  name: string;
  color: string;
  position: number;
  resources: number;
  rentShield: boolean;
  upgradeCredits: number;
  skipTurns: number;
  inJail: boolean;
  properties: number[];
}

export interface DrawnCard {
  id: string;
  deck: CardDeckType;
  card: CardDefinition;
  timestamp: number;
}

