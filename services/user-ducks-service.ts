import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import {
  CollectionDuckView,
  DuckDocument,
  UserDuckDocument,
} from "@/types/database";
import { timestampToDate } from "@/lib/firebase/firestore-utils";
import { calculateLevelFromXp } from "@/lib/leveling";
import { getDuckById } from "./ducks-service";
import { listRewardsByDuckId } from "./duck-rewards-service";

export function makeUserDuckId(userId: string, duckId: string) {
  return `${userId}_${duckId}`;
}

export async function getUserDuck(userId: string, duckId: string) {
  const userDuckId = makeUserDuckId(userId, duckId);
  const userDuckRef = doc(db, "userDucks", userDuckId);
  const snapshot = await getDoc(userDuckRef);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();

  return {
    ...data,
    id: snapshot.id,
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
  } as UserDuckDocument;
}

export async function unlockDuckOrConvertDuplicateToXp(input: {
  userId: string;
  duckId: string;
  duplicateXp: number;
}) {
  const userDuckId = makeUserDuckId(input.userId, input.duckId);
  const userDuckRef = doc(db, "userDucks", userDuckId);

  const result = await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(userDuckRef);

    if (!snapshot.exists()) {
      transaction.set(userDuckRef, {
        id: userDuckId,
        userId: input.userId,
        duckId: input.duckId,
        level: 1,
        xp: 0,
        unlockedRewards: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return {
        wasCreated: true,
        previousLevel: 0,
        newLevel: 1,
        newXp: 0,
      };
    }

    const data = snapshot.data() as UserDuckDocument;
    const newXp = (data.xp ?? 0) + input.duplicateXp;
    const newLevel = calculateLevelFromXp(newXp);

    transaction.update(userDuckRef, {
      xp: newXp,
      level: newLevel,
      updatedAt: serverTimestamp(),
    });

    return {
      wasCreated: false,
      previousLevel: data.level,
      newLevel,
      newXp,
    };
  });

  return result;
}

export async function unlockOrAddXpToDuck(input: {
  userId: string;
  duckId: string;
  xpToAdd: number;
}) {
  const userDuckId = makeUserDuckId(input.userId, input.duckId);
  const userDuckRef = doc(db, "userDucks", userDuckId);

  const result = await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(userDuckRef);

    if (!snapshot.exists()) {
      const initialXp = Math.max(input.xpToAdd, 0);
      const level = calculateLevelFromXp(initialXp);

      transaction.set(userDuckRef, {
        id: userDuckId,
        userId: input.userId,
        duckId: input.duckId,
        level,
        xp: initialXp,
        unlockedRewards: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return {
        wasCreated: true,
        previousLevel: 0,
        newLevel: level,
        newXp: initialXp,
      };
    }

    const data = snapshot.data() as UserDuckDocument;
    const newXp = (data.xp ?? 0) + input.xpToAdd;
    const newLevel = calculateLevelFromXp(newXp);

    transaction.update(userDuckRef, {
      xp: newXp,
      level: newLevel,
      updatedAt: serverTimestamp(),
    });

    return {
      wasCreated: false,
      previousLevel: data.level,
      newLevel,
      newXp,
    };
  });

  return result;
}

export async function updateUnlockedRewards(input: {
  userId: string;
  duckId: string;
  rewardIds: string[];
}) {
  const userDuckId = makeUserDuckId(input.userId, input.duckId);
  const userDuckRef = doc(db, "userDucks", userDuckId);

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(userDuckRef);

    if (!snapshot.exists()) {
      return;
    }

    const data = snapshot.data() as UserDuckDocument;

    const mergedRewards = Array.from(
      new Set([...(data.unlockedRewards ?? []), ...input.rewardIds])
    );

    transaction.update(userDuckRef, {
      unlockedRewards: mergedRewards,
      updatedAt: serverTimestamp(),
    });
  });
}

export async function listUserDucks(userId: string) {
  const userDucksRef = collection(db, "userDucks");
  const userDucksQuery = query(userDucksRef, where("userId", "==", userId));

  const snapshot = await getDocs(userDucksQuery);

  return snapshot.docs.map((userDuckDocument) => {
    const data = userDuckDocument.data();

    return {
      ...data,
      id: userDuckDocument.id,
      createdAt: timestampToDate(data.createdAt),
      updatedAt: timestampToDate(data.updatedAt),
    } as UserDuckDocument;
  });
}

export async function listUserCollection(userId: string) {
  const userDucks = await listUserDucks(userId);

  const collection = await Promise.all(
    userDucks.map(async (userDuck) => {
      const duck = await getDuckById(userDuck.duckId);
      const rewards = await listRewardsByDuckId(userDuck.duckId);

      if (!duck) {
        return null;
      }

      return {
        userDuck,
        duck: duck as DuckDocument,
        rewards,
      } as CollectionDuckView;
    })
  );

  return collection.filter(
    (item): item is CollectionDuckView => Boolean(item)
  );
}
