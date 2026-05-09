export type CollectionDuckRarity = "common" | "rare" | "epic" | "legendary";

export interface CollectionDuck {
  id: string;
  name: string;
  slug: string;
  theme: string;
  rarity: CollectionDuckRarity;
  level: number;
  maxLevel: number;
  xp: number;
  nextLevelXp: number;
  unlockedRewards: number;
  totalRewards: number;
  isFavorite?: boolean;
  imageUrl?: string;
}

export interface CollectionStats {
  totalDucks: number;
  totalLegendaryDucks: number;
  totalEpicDucks: number;
  totalRewardsUnlocked: number;
  totalRavelboxes: number;
}
