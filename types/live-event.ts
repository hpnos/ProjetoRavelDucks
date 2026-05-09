export type LiveEventType =
  | "pack_opened"
  | "rare_card"
  | "level_up"
  | "ravelbox"
  | "duck_unlocked";

export type LiveEventRarity =
  | "common"
  | "rare"
  | "epic"
  | "legendary";

export interface LiveEventDocument {
  id: string;
  userId?: string;
  username: string;
  displayName: string;
  type: LiveEventType;
  title: string;
  description: string;
  rarity?: LiveEventRarity;
  icon: string;
  consumed: boolean;
  createdAt: Date;
}
