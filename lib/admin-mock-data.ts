import {
  AdminCard,
  AdminDuck,
  AdminPack,
  AdminRecentAction,
  AdminRavelbox,
  AdminUser,
} from "@/types/admin";

export const adminDucks: AdminDuck[] = [
  {
    id: "duck-junkrat",
    name: "Pato Junkrat",
    rarity: "epic",
    theme: "Junkrat",
    maxLevel: 10,
    status: "active",
  },
  {
    id: "duck-king",
    name: "Pato Rei",
    rarity: "legendary",
    theme: "Realeza",
    maxLevel: 10,
    status: "active",
  },
  {
    id: "duck-shadow",
    name: "Pato Sombra",
    rarity: "legendary",
    theme: "Noturno",
    maxLevel: 10,
    status: "active",
  },
  {
    id: "duck-basic",
    name: "Pato Clássico",
    rarity: "common",
    theme: "Inicial",
    maxLevel: 10,
    status: "active",
  },
];

export const adminCards: AdminCard[] = [
  {
    id: "card-duck-junkrat",
    name: "Pato Junkrat",
    type: "duck",
    rarity: "epic",
    relatedDuck: "Pato Junkrat",
    status: "active",
  },
  {
    id: "card-xp-junkrat",
    name: "XP Junkrat +100",
    type: "duck_xp",
    rarity: "rare",
    relatedDuck: "Pato Junkrat",
    status: "active",
  },
  {
    id: "card-border-junkrat",
    name: "Borda Junkrat",
    type: "border",
    rarity: "rare",
    relatedDuck: "Pato Junkrat",
    status: "active",
  },
  {
    id: "card-ravelbox",
    name: "Ravelbox",
    type: "ravelbox",
    rarity: "legendary",
    status: "active",
  },
];

export const adminPacks: AdminPack[] = [
  {
    id: "pack-live",
    name: "Pacote da Live",
    cardsQuantity: 4,
    source: "live_purchase",
    status: "active",
  },
  {
    id: "pack-event",
    name: "Pacote Evento Especial",
    cardsQuantity: 3,
    source: "event_reward",
    status: "active",
  },
  {
    id: "pack-bonus",
    name: "Pacote Bônus Manual",
    cardsQuantity: 3,
    source: "manual_bonus",
    status: "active",
  },
];

export const adminUsers: AdminUser[] = [
  {
    id: "jMSLatVdBsccg5zySKo1viMsqrz1",
    username: "ravel",
    displayName: "Ravel",
    totalDucks: 7,
    availablePacks: 1,
  },
  {
    id: "zrEBFqzXTLgXMB9ASKTRXtwrSVy1",
    username: "levi",
    displayName: "Levi",
    totalDucks: 4,
    availablePacks: 0,
  },
  {
    id: "user-guilherme",
    username: "guilherme",
    displayName: "Guilherme",
    totalDucks: 10,
    availablePacks: 2,
  },
];

export const adminRavelboxes: AdminRavelbox[] = [
  {
    id: "ravelbox-001",
    username: "guilherme",
    source: "Pato Sombra nível 6",
    rewardName: "Ravelbox",
    status: "pending",
    createdAt: "2026-05-09",
  },
  {
    id: "ravelbox-002",
    username: "ravel",
    source: "Pato Junkrat nível 10",
    rewardName: "Ravelbox Final",
    status: "pending",
    createdAt: "2026-05-09",
  },
  {
    id: "ravelbox-003",
    username: "levi",
    source: "Evento da Live",
    rewardName: "Ravelbox Evento",
    status: "delivered",
    createdAt: "2026-05-08",
  },
];

export const adminRecentActions: AdminRecentAction[] = [
  {
    id: "action-001",
    description: "Pacote da Live liberado para Guilherme",
    createdAt: "2026-05-09 20:14",
    type: "pack",
  },
  {
    id: "action-002",
    description: "Ravelbox desbloqueada por Ravel",
    createdAt: "2026-05-09 20:10",
    type: "ravelbox",
  },
  {
    id: "action-003",
    description: "Pato Junkrat cadastrado no sistema",
    createdAt: "2026-05-09 19:45",
    type: "duck",
  },
  {
    id: "action-004",
    description: "Recompensa de nível 8 configurada",
    createdAt: "2026-05-09 19:30",
    type: "reward",
  },
];
