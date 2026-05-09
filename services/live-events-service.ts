import {
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import {
  LiveEventDocument,
  LiveEventRarity,
  LiveEventType,
} from "@/types/live-event";
import { timestampToDate } from "@/lib/firebase/firestore-utils";
import { getUserProfile } from "./users-service";

interface CreateLiveEventInput {
  userId?: string;
  username: string;
  displayName: string;
  type: LiveEventType;
  title: string;
  description: string;
  rarity?: LiveEventRarity;
  icon: string;
}

export async function createLiveEvent(input: CreateLiveEventInput) {
  const eventRef = doc(collection(db, "liveEvents"));

  await setDoc(eventRef, {
    id: eventRef.id,
    userId: input.userId ?? null,
    username: input.username,
    displayName: input.displayName,
    type: input.type,
    title: input.title,
    description: input.description,
    rarity: input.rarity ?? null,
    icon: input.icon,
    consumed: false,
    createdAt: serverTimestamp(),
  });

  return eventRef.id;
}

interface CreateLiveEventForUserInput {
  userId: string;
  type: LiveEventType;
  title: string;
  description: string;
  rarity?: LiveEventRarity;
  icon: string;
}

export async function createLiveEventForUser(
  input: CreateLiveEventForUserInput
) {
  const userProfile = await getUserProfile(input.userId);

  await createLiveEvent({
    userId: input.userId,
    username: userProfile?.username ?? "user",
    displayName: userProfile?.displayName ?? "Usuário",
    type: input.type,
    title: input.title,
    description: input.description,
    rarity: input.rarity,
    icon: input.icon,
  });
}

export async function listLatestLiveEvents(maxItems = 10) {
  const eventsRef = collection(db, "liveEvents");

  const eventsQuery = query(
    eventsRef,
    orderBy("createdAt", "desc"),
    limit(maxItems)
  );

  const snapshot = await getDocs(eventsQuery);

  return snapshot.docs.map((eventDocument) => {
    const data = eventDocument.data();

    return {
      ...data,
      id: eventDocument.id,
      rarity: data.rarity ?? undefined,
      createdAt: timestampToDate(data.createdAt),
    } as LiveEventDocument;
  });
}

export function subscribeToLatestLiveEvents(
  callback: (events: LiveEventDocument[]) => void,
  maxItems = 10
) {
  const eventsRef = collection(db, "liveEvents");

  const eventsQuery = query(
    eventsRef,
    orderBy("createdAt", "desc"),
    limit(maxItems)
  );

  const unsubscribe = onSnapshot(eventsQuery, (snapshot) => {
    const events = snapshot.docs.map((eventDocument) => {
      const data = eventDocument.data();

      return {
        ...data,
        id: eventDocument.id,
        rarity: data.rarity ?? undefined,
        createdAt: timestampToDate(data.createdAt),
      } as LiveEventDocument;
    });

    callback(events);
  });

  return unsubscribe;
}

export async function markLiveEventAsConsumed(eventId: string) {
  const eventRef = doc(db, "liveEvents", eventId);

  await updateDoc(eventRef, {
    consumed: true,
  });
}
