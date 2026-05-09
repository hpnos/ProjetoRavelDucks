import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { timestampToDate } from "@/lib/firebase/firestore-utils";
import { AppUser, UserRole } from "@/types/database";

interface CreateUserProfileInput {
  id: string;
  email: string;
  displayName: string;
  username: string;
  role?: UserRole;
}

export async function createUserProfile(input: CreateUserProfileInput) {
  const userRef = doc(db, "users", input.id);

  await setDoc(userRef, {
    id: input.id,
    email: input.email,
    displayName: input.displayName,
    username: input.username,
    role: input.role ?? "user",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getUserProfile(userId: string) {
  const userRef = doc(db, "users", userId);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();

  return {
    ...data,
    id: snapshot.id,
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
  } as AppUser;
}

export async function updateUserRole(userId: string, role: UserRole) {
  const userRef = doc(db, "users", userId);

  await updateDoc(userRef, {
    role,
    updatedAt: serverTimestamp(),
  });
}

export async function listUsers() {
  const usersRef = collection(db, "users");
  const usersQuery = query(usersRef, orderBy("createdAt", "desc"));

  const snapshot = await getDocs(usersQuery);

  return snapshot.docs.map((userDocument) => {
    const data = userDocument.data();

    return {
      ...data,
      id: userDocument.id,
      createdAt: timestampToDate(data.createdAt),
      updatedAt: timestampToDate(data.updatedAt),
    } as AppUser;
  });
}
