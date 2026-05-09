import {
  collection,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { DuckDocument } from "@/types/database";
import { timestampToDate } from "@/lib/firebase/firestore-utils";

interface CreateDuckInput {
  id: string;
  name: string;
  slug: string;
  theme: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  maxLevel: number;
  imageUrl?: string;
  gifUrl?: string;
}

export async function createDuck(input: CreateDuckInput) {
  const duckRef = doc(db, "ducks", input.id);

  await setDoc(duckRef, {
    ...input,
    active: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function listDucks() {
  const ducksRef = collection(db, "ducks");
  const ducksQuery = query(ducksRef, orderBy("createdAt", "desc"));

  const snapshot = await getDocs(ducksQuery);

  return snapshot.docs.map((duckDocument) => {
    const data = duckDocument.data();

    return {
      ...data,
      id: duckDocument.id,
      createdAt: timestampToDate(data.createdAt),
      updatedAt: timestampToDate(data.updatedAt),
    } as DuckDocument;
  });
}

export async function getDuckById(duckId: string) {
  const duckRef = doc(db, "ducks", duckId);
  const snapshot = await getDoc(duckRef);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();

  return {
    ...data,
    id: snapshot.id,
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
  } as DuckDocument;
}

export async function updateDuckActiveStatus(duckId: string, active: boolean) {
  const duckRef = doc(db, "ducks", duckId);

  await updateDoc(duckRef, {
    active,
    updatedAt: serverTimestamp(),
  });
}
