"use client";

import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase/client";

export function useAuthUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: Boolean(user),
  };
}
