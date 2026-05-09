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
import { PackDocument } from "@/types/database";
import { timestampToDate } from "@/lib/firebase/firestore-utils";

interface CreatePackInput {
  id: string;
  name: string;
  description: string;
  cardsQuantity: number;
  cardPool: string[];
  imageUrl?: string;
}

export async function createPack(input: CreatePackInput) {
  const packRef = doc(db, "packs", input.id);

  await setDoc(packRef, {
    ...input,
    active: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getPackById(packId: string) {
  const packRef = doc(db, "packs", packId);
  const snapshot = await getDoc(packRef);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();

  return {
    ...data,
    id: snapshot.id,
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
  } as PackDocument;
}

export async function listActivePacks() {
  const packsRef = collection(db, "packs");
  const packsQuery = query(packsRef, where("active", "==", true));

  const snapshot = await getDocs(packsQuery);

  return snapshot.docs.map((packDocument) => {
    const data = packDocument.data();

    return {
      ...data,
      id: packDocument.id,
      createdAt: timestampToDate(data.createdAt),
      updatedAt: timestampToDate(data.updatedAt),
    } as PackDocument;
  });
}

export async function listPacks() {
  const packsRef = collection(db, "packs");
  const snapshot = await getDocs(packsRef);

  return snapshot.docs.map((packDocument) => {
    const data = packDocument.data();

    return {
      ...data,
      id: packDocument.id,
      createdAt: timestampToDate(data.createdAt),
      updatedAt: timestampToDate(data.updatedAt),
    } as PackDocument;
  });
}

export async function updatePackActiveStatus(packId: string, active: boolean) {
  const packRef = doc(db, "packs", packId);

  await updateDoc(packRef, {
    active,
    updatedAt: serverTimestamp(),
  });
}
