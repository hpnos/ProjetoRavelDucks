import {
  collection,
  doc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { CardDocument } from "@/types/database";
import { getCardsByIds } from "./cards-service";
import { applyPackResultToCollection } from "./pack-results-service";
import { createLiveEventForUser } from "./live-events-service";

interface OpenGrantedPackInput {
  userId: string;
  grantedPackId: string;
}

function shuffleArray<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

export async function openGrantedPack(input: OpenGrantedPackInput) {
  const grantedPackRef = doc(db, "grantedPacks", input.grantedPackId);
  const openingRef = doc(collection(db, "packOpenings"));

  const result = await runTransaction(db, async (transaction) => {
    const grantedPackSnapshot = await transaction.get(grantedPackRef);

    if (!grantedPackSnapshot.exists()) {
      throw new Error("Pacote liberado não encontrado.");
    }

    const grantedPack = grantedPackSnapshot.data();

    if (grantedPack.userId !== input.userId) {
      throw new Error("Este pacote não pertence ao usuário autenticado.");
    }

    if (grantedPack.status !== "available") {
      throw new Error("Este pacote não está disponível para abertura.");
    }

    const packRef = doc(db, "packs", grantedPack.packId);
    const packSnapshot = await transaction.get(packRef);

    if (!packSnapshot.exists()) {
      throw new Error("Modelo de pacote não encontrado.");
    }

    const pack = packSnapshot.data();

    if (!pack.active) {
      throw new Error("Este modelo de pacote está inativo.");
    }

    const cardPool: string[] = pack.cardPool ?? [];
    const cardsQuantity: number = pack.cardsQuantity ?? 3;

    if (cardPool.length === 0) {
      throw new Error("Este pacote não possui cartas configuradas.");
    }

    const selectedCardIds = shuffleArray(cardPool).slice(0, cardsQuantity);

    transaction.set(openingRef, {
      id: openingRef.id,
      userId: input.userId,
      packId: grantedPack.packId,
      grantedPackId: input.grantedPackId,
      cardsReceived: selectedCardIds,
      createdAt: serverTimestamp(),
    });

    transaction.update(grantedPackRef, {
      status: "opened",
      openedAt: serverTimestamp(),
    });

    return {
      openingId: openingRef.id,
      cardIds: selectedCardIds,
    };
  });

  const cards = await getCardsByIds(result.cardIds);

  const applicationResult = await applyPackResultToCollection({
    userId: input.userId,
    cards,
  });

  await createLiveEventForUser({
    userId: input.userId,
    type: "pack_opened",
    title: "Pacote aberto!",
    description: `Um pacote foi aberto e revelou ${cards.length} cartas.`,
    rarity: "rare",
    icon: "🎴",
  });

  const rareCards = cards.filter(
    (card) => card.rarity === "epic" || card.rarity === "legendary"
  );

  for (const card of rareCards) {
    await createLiveEventForUser({
      userId: input.userId,
      type: "rare_card",
      title:
        card.rarity === "legendary"
          ? "Carta lendária revelada!"
          : "Carta épica revelada!",
      description: `A carta ${card.name} apareceu na abertura do pacote.`,
      rarity: card.rarity,
      icon: card.rarity === "legendary" ? "👑" : "✨",
    });
  }

  return {
    openingId: result.openingId,
    cards: cards as CardDocument[],
    messages: applicationResult.messages,
  };
}
