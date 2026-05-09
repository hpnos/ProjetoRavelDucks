import { UserIsland } from "@/types/island";

export const mockIslandsGallery: UserIsland[] = [
  {
    id: "island-ravel",
    owner: {
      id: "user-ravel",
      username: "ravel",
      displayName: "Ravel",
      title: "Colecionador de Patos",
    },
    backgroundName: "Ilha da Floresta",
    collectionStats: {
      totalDucks: 7,
      totalRewards: 18,
      rarestDuck: "Pato Junkrat",
      ravelboxesUnlocked: 2,
    },
    ducks: [
      {
        id: "duck-junkrat",
        name: "Pato Junkrat",
        level: 4,
        rarity: "epic",
        position: {
          left: "42%",
          top: "55%",
        },
      },
      {
        id: "duck-king",
        name: "Pato Rei",
        level: 2,
        rarity: "legendary",
        position: {
          left: "62%",
          top: "58%",
        },
      },
    ],
    items: [
      {
        id: "item-junkrat-barrel",
        name: "Barril Explosivo",
        type: "decoration",
        slot: "left_decoration",
        position: {
          left: "25%",
          top: "66%",
        },
      },
      {
        id: "item-junkrat-flag",
        name: "Bandeira Junkrat",
        type: "special",
        slot: "special_item",
        position: {
          left: "72%",
          top: "40%",
        },
      },
    ],
  },
  {
    id: "island-levi",
    owner: {
      id: "user-levi",
      username: "levi",
      displayName: "Levi",
      title: "Guardião da Ilha",
    },
    backgroundName: "Ilha Tropical",
    collectionStats: {
      totalDucks: 4,
      totalRewards: 9,
      rarestDuck: "Pato Rei",
      ravelboxesUnlocked: 1,
    },
    ducks: [
      {
        id: "duck-basic",
        name: "Pato Clássico",
        level: 3,
        rarity: "common",
        position: {
          left: "38%",
          top: "60%",
        },
      },
      {
        id: "duck-king",
        name: "Pato Rei",
        level: 1,
        rarity: "legendary",
        position: {
          left: "58%",
          top: "57%",
        },
      },
    ],
    items: [
      {
        id: "item-tree",
        name: "Coqueiro",
        type: "decoration",
        slot: "right_decoration",
        position: {
          left: "76%",
          top: "55%",
        },
      },
    ],
  },
  {
    id: "island-guilherme",
    owner: {
      id: "user-guilherme",
      username: "guilherme",
      displayName: "Guilherme",
      title: "Caçador de Ravelbox",
    },
    backgroundName: "Ilha Noturna",
    collectionStats: {
      totalDucks: 10,
      totalRewards: 26,
      rarestDuck: "Pato Sombra",
      ravelboxesUnlocked: 4,
    },
    ducks: [
      {
        id: "duck-shadow",
        name: "Pato Sombra",
        level: 6,
        rarity: "legendary",
        position: {
          left: "45%",
          top: "56%",
        },
      },
      {
        id: "duck-junkrat",
        name: "Pato Junkrat",
        level: 5,
        rarity: "epic",
        position: {
          left: "62%",
          top: "61%",
        },
      },
      {
        id: "duck-basic",
        name: "Pato Clássico",
        level: 2,
        rarity: "common",
        position: {
          left: "28%",
          top: "64%",
        },
      },
    ],
    items: [
      {
        id: "item-moon-banner",
        name: "Estandarte Lunar",
        type: "special",
        slot: "special_item",
        position: {
          left: "70%",
          top: "42%",
        },
      },
      {
        id: "item-rock",
        name: "Pedra Mística",
        type: "decoration",
        slot: "left_decoration",
        position: {
          left: "22%",
          top: "67%",
        },
      },
    ],
  },
  {
    id: "island-player123",
    owner: {
      id: "user-player123",
      username: "player123",
      displayName: "Player123",
      title: "Novo Colecionador",
    },
    backgroundName: "Ilha Inicial",
    collectionStats: {
      totalDucks: 2,
      totalRewards: 3,
      rarestDuck: "Pato Clássico",
      ravelboxesUnlocked: 0,
    },
    ducks: [
      {
        id: "duck-basic",
        name: "Pato Clássico",
        level: 1,
        rarity: "common",
        position: {
          left: "48%",
          top: "60%",
        },
      },
    ],
    items: [
      {
        id: "item-small-tree",
        name: "Árvore Pequena",
        type: "decoration",
        slot: "left_decoration",
        position: {
          left: "30%",
          top: "62%",
        },
      },
    ],
  },
];
