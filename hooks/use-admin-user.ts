"use client";

import { useAuthUser } from "./use-auth-user";
import { useUserProfile } from "./use-user-profile";

export function useAdminUser() {
  const { user, isLoading: isLoadingAuth, isAuthenticated } = useAuthUser();
  const { profile, isLoadingProfile } = useUserProfile(user?.uid);

  const isLoading = isLoadingAuth || isLoadingProfile;
  const isAdmin = profile?.role === "admin";

  return {
    user,
    profile,
    isLoading,
    isAuthenticated,
    isAdmin,
  };
}
