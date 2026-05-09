import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { CardDocument, CardType, Rarity } from "@/types/database";
import { timestampToDate } from "@/lib/firebase/firestore-utils";

interface CreateCardInput {
  id: string;
  name: string;
  description: string;
  type: CardType;
  rarity: Rarity;
  duckId?: string;
  xpAmount?: number;
  imageUrl?: string;
}

export async function createCard(input: CreateCardInput) {
  const cardRef = doc(db, "cards", input.id);

  await setDoc(cardRef, {
    ...input,
    active: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getCardById(cardId: string) {
  const cardRef = doc(db, "cards", cardId);
  const snapshot = await getDoc(cardRef);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();

  return {
    ...data,
    id: snapshot.id,
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
  } as CardDocument;
}

export async function listActiveCards() {
  const cardsRef = collection(db, "cards");
  const cardsQuery = query(cardsRef, where("active", "==", true));

  const snapshot = await getDocs(cardsQuery);

  return snapshot.docs.map((cardDocument) => {
    const data = cardDocument.data();

    return {
      ...data,
      id: cardDocument.id,
      createdAt: timestampToDate(data.createdAt),
      updatedAt: timestampToDate(data.updatedAt),
    } as CardDocument;
  });
}

export async function getCardsByIds(cardIds: string[]) {
  const cards = await Promise.all(cardIds.map((cardId) => getCardById(cardId)));

  return cards.filter((card): card is CardDocument => Boolean(card));
}

export async function listCards() {
  const cardsRef = collection(db, "cards");
  const snapshot = await getDocs(cardsRef);

  return snapshot.docs.map((cardDocument) => {
    const data = cardDocument.data();

    return {
      ...data,
      id: cardDocument.id,
      createdAt: timestampToDate(data.createdAt),
      updatedAt: timestampToDate(data.updatedAt),
    } as CardDocument;
  });
}

export async function updateCardActiveStatus(cardId: string, active: boolean) {
  const cardRef = doc(db, "cards", cardId);

  await updateDoc(cardRef, {
    active,
    updatedAt: serverTimestamp(),
  });
}
