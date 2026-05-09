import { UserIsland } from "@/types/island";

export const mockIsland: UserIsland = {
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
    {
      id: "duck-basic",
      name: "Pato Clássico",
      level: 1,
      rarity: "common",
      position: {
        left: "27%",
        top: "62%",
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
        left: "18%",
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
        top: "38%",
      },
    },
    {
      id: "item-tree",
      name: "Árvore da Ilha",
      type: "decoration",
      slot: "right_decoration",
      position: {
        left: "78%",
        top: "58%",
      },
    },
  ],
};
