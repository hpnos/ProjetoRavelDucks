export type LiveOverlayEventType =
  | "pack_opened"
  | "rare_card"
  | "level_up"
  | "ravelbox"
  | "duck_unlocked";

export type LiveOverlayEventRarity =
  | "common"
  | "rare"
  | "epic"
  | "legendary";

export interface LiveOverlayEvent {
  id: string;
  username: string;
  displayName: string;
  type: LiveOverlayEventType;
  title: string;
  description: string;
  rarity?: LiveOverlayEventRarity;
  icon: string;
  createdAt: string;
}
