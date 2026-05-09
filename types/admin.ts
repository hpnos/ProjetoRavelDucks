export type AdminStatus = "active" | "inactive" | "pending" | "delivered";

export interface AdminDuck {
  id: string;
  name: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  theme: string;
  maxLevel: number;
  status: AdminStatus;
}

export interface AdminCard {
  id: string;
  name: string;
  type:
    | "duck"
    | "duck_xp"
    | "island_item"
    | "accessory"
    | "border"
    | "pin"
    | "digital_art"
    | "ravelbox";
  rarity: "common" | "rare" | "epic" | "legendary";
  relatedDuck?: string;
  status: AdminStatus;
}

export interface AdminPack {
  id: string;
  name: string;
  cardsQuantity: number;
  source: "live_purchase" | "event_reward" | "manual_bonus" | "admin";
  status: AdminStatus;
}

export interface AdminUser {
  id: string;
  username: string;
  displayName: string;
  totalDucks: number;
  availablePacks: number;
}

export interface AdminRavelbox {
  id: string;
  username: string;
  source: string;
  rewardName: string;
  status: "pending" | "delivered";
  createdAt: string;
}

export interface AdminRecentAction {
  id: string;
  description: string;
  createdAt: string;
  type: "pack" | "duck" | "ravelbox" | "reward";
}
