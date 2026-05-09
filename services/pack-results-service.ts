import { CardDocument } from "@/types/database";
import { unlockDuckOrConvertDuplicateToXp, unlockOrAddXpToDuck, updateUnlockedRewards } from "./user-ducks-service";
import { listRewardsUnlockedByLevel } from "./duck-rewards-service";
import { createPendingRavelbox } from "./pending-rewards-service";
import { createLiveEventForUser } from "./live-events-service";

const DUPLICATE_DUCK_XP = 100;

interface ApplyPackResultInput {
  userId: string;
  cards: CardDocument[];
}

export async function applyPackResultToCollection(input: ApplyPackResultInput) {
  const messages: string[] = [];

  for (const card of input.cards) {
    if (card.type === "duck" && card.duckId) {
      const result = await unlockDuckOrConvertDuplicateToXp({
        userId: input.userId,
        duckId: card.duckId,
        duplicateXp: DUPLICATE_DUCK_XP,
      });

      await unlockRewardsForDuck({
        userId: input.userId,
        duckId: card.duckId,
        level: result.newLevel,
      });

      if (result.wasCreated) {
        messages.push(`${card.name} desbloqueado.`);

        await createLiveEventForUser({
          userId: input.userId,
          type: "duck_unlocked",
          title: "Novo pato desbloqueado!",
          description: `${card.name} entrou para a coleção.`,
          rarity: card.rarity,
          icon: "🦆",
        });
      } else {
        messages.push(`${card.name} duplicado: +${DUPLICATE_DUCK_XP} XP.`);

        if (result.newLevel > result.previousLevel) {
          await createLiveEventForUser({
            userId: input.userId,
            type: "level_up",
            title: "Pato subiu de nível!",
            description: `Um pato subiu para o nível ${result.newLevel}.`,
            rarity: "epic",
            icon: "✨",
          });
        }
      }
    }

    if (card.type === "duck_xp" && card.duckId) {
      const xpToAdd = card.xpAmount ?? 0;

      const result = await unlockOrAddXpToDuck({
        userId: input.userId,
        duckId: card.duckId,
        xpToAdd,
      });

      await unlockRewardsForDuck({
        userId: input.userId,
        duckId: card.duckId,
        level: result.newLevel,
      });

      messages.push(`${card.name}: +${xpToAdd} XP.`);

      if (result.newLevel > result.previousLevel) {
        await createLiveEventForUser({
          userId: input.userId,
          type: "level_up",
          title: "Pato subiu de nível!",
          description: `Um pato subiu para o nível ${result.newLevel}.`,
          rarity: "epic",
          icon: "✨",
        });
      }
    }

    if (card.type === "ravelbox") {
      await createPendingRavelbox({
        userId: input.userId,
        rewardName: card.name,
        source: "event",
        sourceId: card.id,
      });

      messages.push(`${card.name} adicionada como recompensa pendente.`);

      await createLiveEventForUser({
        userId: input.userId,
        type: "ravelbox",
        title: "Ravelbox desbloqueada!",
        description: `${card.name} foi adicionada como recompensa pendente.`,
        rarity: "legendary",
        icon: "🎁",
      });
    }
  }

  return {
    messages,
  };
}

async function unlockRewardsForDuck(input: {
  userId: string;
  duckId: string;
  level: number;
}) {
  const unlockedRewards = await listRewardsUnlockedByLevel(
    input.duckId,
    input.level
  );

  await updateUnlockedRewards({
    userId: input.userId,
    duckId: input.duckId,
    rewardIds: unlockedRewards.map((reward) => reward.id),
  });

  const ravelboxRewards = unlockedRewards.filter(
    (reward) => reward.type === "ravelbox"
  );

  for (const reward of ravelboxRewards) {
    await createPendingRavelbox({
      userId: input.userId,
      rewardName: reward.name,
      source: "duck_level",
      sourceId: reward.id,
    });
  }
}
