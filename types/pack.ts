export type PackStatus = "available" | "opened" | "expired";

export type CardRarity = "common" | "rare" | "epic" | "legendary";

export type CardType =
  | "duck"
  | "duck_xp"
  | "island_item"
  | "accessory"
  | "border"
  | "pin"
  | "digital_art"
  | "ravelbox";

export interface Pack {
  id: string;
  name: string;
  description: string;
  cardsQuantity: number;
  status: PackStatus;
  source: "live_purchase" | "event_reward" | "manual_bonus" | "admin";
  createdAt: string;
}

export interface PackCardReward {
  id: string;
  name: string;
  description: string;
  type: CardType;
  rarity: CardRarity;
  duckId?: string;
  xpAmount?: number;
  isDuplicate?: boolean;
}
