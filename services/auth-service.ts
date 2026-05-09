import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { createUserProfile } from "./users-service";

interface RegisterInput {
  email: string;
  password: string;
  displayName: string;
  username: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export async function registerWithEmail(input: RegisterInput) {
  const credential = await createUserWithEmailAndPassword(
    auth,
    input.email,
    input.password
  );

  await createUserProfile({
    id: credential.user.uid,
    email: input.email,
    displayName: input.displayName,
    username: input.username,
    role: "user",
  });

  return credential.user;
}

export async function loginWithEmail(input: LoginInput) {
  const credential = await signInWithEmailAndPassword(
    auth,
    input.email,
    input.password
  );

  return credential.user;
}

export async function logout() {
  await signOut(auth);
}
