export type UserRole = "user" | "admin";

export type Rarity = "common" | "rare" | "epic" | "legendary";

export type CardType =
  | "duck"
  | "duck_xp"
  | "island_item"
  | "accessory"
  | "border"
  | "pin"
  | "digital_art"
  | "ravelbox";

export type PackStatus = "available" | "opened" | "expired";

export type PendingRewardStatus = "pending" | "delivered" | "cancelled";

export interface AppUser {
  id: string;
  username: string;
  displayName: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface DuckDocument {
  id: string;
  name: string;
  slug: string;
  theme: string;
  rarity: Rarity;
  maxLevel: number;
  imageUrl?: string;
  gifUrl?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type RewardType =
  | CardType
  | "skin";

export interface DuckRewardDocument {
  id: string;
  duckId: string;
  level: number;
  name: string;
  type: RewardType;
  description: string;
  imageUrl?: string;
  active: boolean;
}

export interface CardDocument {
  id: string;
  name: string;
  description: string;
  type: CardType;
  rarity: Rarity;
  duckId?: string;
  xpAmount?: number;
  imageUrl?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PackDocument {
  id: string;
  name: string;
  description: string;
  cardsQuantity: number;
  cardPool: string[];
  imageUrl?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GrantedPackDocument {
  id: string;
  userId: string;
  packId: string;
  status: PackStatus;
  reason: "live_purchase" | "event_reward" | "manual_bonus" | "admin";
  grantedBy: string;
  createdAt: Date;
  openedAt?: Date;
}

export interface UserDuckDocument {
  id: string;
  userId: string;
  duckId: string;
  level: number;
  xp: number;
  unlockedRewards: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IslandDocument {
  id: string;
  userId: string;
  backgroundId?: string;
  public: boolean;
  visibleDucks: string[];
  equippedItems: {
    slotId: string;
    itemId: string;
    x?: number;
    y?: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PendingRewardDocument {
  id: string;
  userId: string;
  rewardType: "ravelbox" | "external_reward";
  rewardName: string;
  source: "duck_level" | "collection_milestone" | "event" | "admin";
  sourceId?: string;
  status: PendingRewardStatus;
  createdAt: Date;
  deliveredAt?: Date;
}

export interface PackOpeningDocument {
  id: string;
  userId: string;
  packId: string;
  grantedPackId: string;
  cardsReceived: string[];
  createdAt: Date;
}

export interface ResolvedGrantedPack {
  id: string;
  userId: string;
  packId: string;
  status: PackStatus;
  reason: "live_purchase" | "event_reward" | "manual_bonus" | "admin";
  grantedBy: string;
  createdAt: Date;
  openedAt?: Date;
  pack: PackDocument;
}

export interface CollectionDuckView {
  userDuck: UserDuckDocument;
  duck: DuckDocument;
  rewards: DuckRewardDocument[];
}
