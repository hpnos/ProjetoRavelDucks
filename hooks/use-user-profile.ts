"use client";

import { useEffect, useState } from "react";
import { AppUser } from "@/types/database";
import { getUserProfile } from "@/services/users-service";

export function useUserProfile(userId?: string) {
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      if (!userId) {
        setProfile(null);
        setIsLoadingProfile(false);
        return;
      }

      try {
        setIsLoadingProfile(true);

        const userProfile = await getUserProfile(userId);

        setProfile(userProfile);
      } catch (error) {
        console.error(error);
        setProfile(null);
      } finally {
        setIsLoadingProfile(false);
      }
    }

    loadProfile();
  }, [userId]);

  return {
    profile,
    isLoadingProfile,
  };
}
