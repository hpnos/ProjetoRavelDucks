import { Pack, PackCardReward } from "@/types/pack";

export const mockPacks: Pack[] = [
  {
    id: "pack-live-001",
    name: "Pacote da Live",
    description: "Pacote liberado durante a live do Ravel.",
    cardsQuantity: 4,
    status: "available",
    source: "live_purchase",
    createdAt: "2026-05-09",
  },
  {
    id: "pack-event-001",
    name: "Pacote Evento Especial",
    description: "Recompensa especial por participação no evento.",
    cardsQuantity: 3,
    status: "available",
    source: "event_reward",
    createdAt: "2026-05-09",
  },
  {
    id: "pack-opened-001",
    name: "Pacote Antigo",
    description: "Pacote já aberto anteriormente.",
    cardsQuantity: 3,
    status: "opened",
    source: "manual_bonus",
    createdAt: "2026-05-08",
  },
];

export const mockCardPool: PackCardReward[] = [
  {
    id: "card-duck-junkrat",
    name: "Pato Junkrat",
    description: "Desbloqueia o Pato Junkrat ou vira XP se já estiver na coleção.",
    type: "duck",
    rarity: "epic",
    duckId: "duck-junkrat",
  },
  {
    id: "card-xp-junkrat",
    name: "XP Junkrat +100",
    description: "Adiciona 100 XP ao Pato Junkrat.",
    type: "duck_xp",
    rarity: "rare",
    duckId: "duck-junkrat",
    xpAmount: 100,
  },
  {
    id: "card-island-barrel",
    name: "Barril Explosivo",
    description: "Acessório temático para decorar sua ilha.",
    type: "island_item",
    rarity: "rare",
    duckId: "duck-junkrat",
  },
  {
    id: "card-border-junkrat",
    name: "Borda Junkrat",
    description: "Borda temática para o perfil.",
    type: "border",
    rarity: "rare",
    duckId: "duck-junkrat",
  },
  {
    id: "card-pin-junkrat",
    name: "Pin Junkrat",
    description: "Pin colecionável do Pato Junkrat.",
    type: "pin",
    rarity: "common",
    duckId: "duck-junkrat",
  },
  {
    id: "card-ravelbox",
    name: "Ravelbox",
    description: "Recompensa especial que fica pendente para o Ravel entregar.",
    type: "ravelbox",
    rarity: "legendary",
  },
  {
    id: "card-duck-king",
    name: "Pato Rei",
    description: "Desbloqueia o Pato Rei ou vira XP se já estiver na coleção.",
    type: "duck",
    rarity: "legendary",
    duckId: "duck-king",
  },
  {
    id: "card-digital-art",
    name: "Arte HD Pato Junkrat",
    description: "Arte digital em alta definição do Pato Junkrat.",
    type: "digital_art",
    rarity: "epic",
    duckId: "duck-junkrat",
  },
];

export function openMockPack(cardsQuantity: number): PackCardReward[] {
  const shuffled = [...mockCardPool].sort(() => Math.random() - 0.5);

  return shuffled.slice(0, cardsQuantity).map((card, index) => {
    if (index === 0 && card.type === "duck") {
      return {
        ...card,
        isDuplicate: true,
        description:
          "Carta duplicada: será convertida em XP para este pato futuramente.",
      };
    }

    return card;
  });
}
