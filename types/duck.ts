export type DuckRarity = "common" | "rare" | "epic" | "legendary";

export type DuckRewardType =
  | "duck"
  | "border"
  | "pin"
  | "island_accessory"
  | "digital_art"
  | "ravelbox"
  | "skin";

export interface Duck {
  id: string;
  name: string;
  slug: string;
  theme: string;
  rarity: DuckRarity;
  level: number;
  xp: number;
  nextLevelXp: number;
  maxLevel: number;
  imageUrl: string;
}

export interface DuckReward {
  id: string;
  duckId: string;
  level: number;
  name: string;
  type: DuckRewardType;
  description: string;
  imageUrl?: string;
}
