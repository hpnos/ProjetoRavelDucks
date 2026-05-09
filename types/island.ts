export type IslandItemType =
  | "duck"
  | "decoration"
  | "accessory"
  | "background"
  | "special";

export type IslandSlot =
  | "main_duck"
  | "secondary_duck"
  | "left_decoration"
  | "right_decoration"
  | "center_decoration"
  | "special_item";

export interface IslandDuck {
  id: string;
  name: string;
  level: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  imageUrl?: string;
  position: {
    left: string;
    top: string;
  };
}

export interface IslandItem {
  id: string;
  name: string;
  type: IslandItemType;
  slot: IslandSlot;
  imageUrl?: string;
  position: {
    left: string;
    top: string;
  };
}

export interface IslandOwner {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  title: string;
}

export interface UserIsland {
  id: string;
  owner: IslandOwner;
  backgroundName: string;
  backgroundUrl?: string;
  collectionStats: {
    totalDucks: number;
    totalRewards: number;
    rarestDuck: string;
    ravelboxesUnlocked: number;
  };
  ducks: IslandDuck[];
  items: IslandItem[];
}
