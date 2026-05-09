import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { DuckRewardDocument, RewardType } from "@/types/database";

interface CreateDuckRewardInput {
  id: string;
  duckId: string;
  level: number;
  name: string;
  type: RewardType;
  description: string;
  imageUrl?: string;
}

export async function createDuckReward(input: CreateDuckRewardInput) {
  const rewardRef = doc(db, "duckRewards", input.id);

  await setDoc(rewardRef, {
    ...input,
    active: true,
  });
}

export async function listRewardsByDuckId(duckId: string) {
  const rewardsRef = collection(db, "duckRewards");

  const rewardsQuery = query(
    rewardsRef,
    where("duckId", "==", duckId),
    where("active", "==", true)
  );

  const snapshot = await getDocs(rewardsQuery);

  return snapshot.docs
    .map((rewardDocument) => {
      const data = rewardDocument.data();

      return {
        ...data,
        id: rewardDocument.id,
      } as DuckRewardDocument;
    })
    .sort((a, b) => a.level - b.level);
}

export async function listRewardsUnlockedByLevel(
  duckId: string,
  level: number
) {
  const rewards = await listRewardsByDuckId(duckId);

  return rewards.filter((reward) => reward.level <= level);
}
