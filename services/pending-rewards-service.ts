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
import { timestampToDate } from "@/lib/firebase/firestore-utils";
import { PendingRewardDocument, PendingRewardStatus } from "@/types/database";
import { getUserProfile } from "./users-service";

interface CreatePendingRewardInput {
  userId: string;
  rewardName: string;
  source: "duck_level" | "collection_milestone" | "event" | "admin";
  sourceId?: string;
}

export async function createPendingRavelbox(input: CreatePendingRewardInput) {
  const rewardRef = doc(collection(db, "pendingRewards"));

  await setDoc(rewardRef, {
    id: rewardRef.id,
    userId: input.userId,
    rewardType: "ravelbox",
    rewardName: input.rewardName,
    source: input.source,
    sourceId: input.sourceId,
    status: "pending",
    createdAt: serverTimestamp(),
  });

  return rewardRef.id;
}

export async function listPendingRewards() {
  const rewardsRef = collection(db, "pendingRewards");
  const rewardsQuery = query(rewardsRef, orderBy("createdAt", "desc"));

  const snapshot = await getDocs(rewardsQuery);

  return snapshot.docs.map((rewardDocument) => {
    const data = rewardDocument.data();

    return {
      ...data,
      id: rewardDocument.id,
      createdAt: timestampToDate(data.createdAt),
      deliveredAt: data.deliveredAt
        ? timestampToDate(data.deliveredAt)
        : undefined,
    } as PendingRewardDocument;
  });
}

export async function listPendingRavelboxes() {
  const rewardsRef = collection(db, "pendingRewards");

  const rewardsQuery = query(
    rewardsRef,
    where("rewardType", "==", "ravelbox"),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(rewardsQuery);

  return snapshot.docs.map((rewardDocument) => {
    const data = rewardDocument.data();

    return {
      ...data,
      id: rewardDocument.id,
      createdAt: timestampToDate(data.createdAt),
      deliveredAt: data.deliveredAt
        ? timestampToDate(data.deliveredAt)
        : undefined,
    } as PendingRewardDocument;
  });
}

export async function updatePendingRewardStatus(
  rewardId: string,
  status: PendingRewardStatus
) {
  const rewardRef = doc(db, "pendingRewards", rewardId);

  await updateDoc(rewardRef, {
    status,
    deliveredAt: status === "delivered" ? serverTimestamp() : null,
  });
}

export async function listPendingRewardsWithUsers() {
  const rewards = await listPendingRewards();

  const enrichedRewards = await Promise.all(
    rewards.map(async (reward) => {
      const user = await getUserProfile(reward.userId);

      return {
        reward,
        user,
      };
    })
  );

  return enrichedRewards;
}
