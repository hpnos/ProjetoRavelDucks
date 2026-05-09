import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import {
  GrantedPackDocument,
  PackStatus,
  ResolvedGrantedPack,
} from "@/types/database";
import { timestampToDate } from "@/lib/firebase/firestore-utils";
import { getPackById } from "./packs-service";

interface GrantPackInput {
  userId: string;
  packId: string;
  reason: "live_purchase" | "event_reward" | "manual_bonus" | "admin";
  grantedBy: string;
}

export async function grantPackToUser(input: GrantPackInput) {
  const grantedPackRef = doc(collection(db, "grantedPacks"));

  await setDoc(grantedPackRef, {
    id: grantedPackRef.id,
    userId: input.userId,
    packId: input.packId,
    status: "available",
    reason: input.reason,
    grantedBy: input.grantedBy,
    createdAt: serverTimestamp(),
  });

  return grantedPackRef.id;
}

export async function listGrantedPacksByUser(userId: string) {
  const grantedPacksRef = collection(db, "grantedPacks");

  const grantedPacksQuery = query(
    grantedPacksRef,
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(grantedPacksQuery);

  const grantedPacks = snapshot.docs.map((grantedPackDocument) => {
    const data = grantedPackDocument.data();

    return {
      ...data,
      id: grantedPackDocument.id,
      createdAt: timestampToDate(data.createdAt),
      openedAt: data.openedAt ? timestampToDate(data.openedAt) : undefined,
    } as GrantedPackDocument;
  });

  const resolvedPacks = await Promise.all(
    grantedPacks.map(async (grantedPack) => {
      const pack = await getPackById(grantedPack.packId);

      if (!pack) {
        return null;
      }

      return {
        ...grantedPack,
        pack,
      } as ResolvedGrantedPack;
    })
  );

  return resolvedPacks.filter(
    (pack): pack is ResolvedGrantedPack => Boolean(pack)
  );
}

export async function updateGrantedPackStatus(
  grantedPackId: string,
  status: PackStatus
) {
  const grantedPackRef = doc(db, "grantedPacks", grantedPackId);

  await updateDoc(grantedPackRef, {
    status,
    openedAt: status === "opened" ? serverTimestamp() : null,
  });
}
