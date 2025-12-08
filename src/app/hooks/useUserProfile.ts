"use client";

import { useEffect, useState, useCallback } from "react";
import { UserService } from "@/lib/api/userService";
import { UserProfile } from "@/types/frontend.types";

interface UseUserProfileReturn {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useUserProfile(): UseUserProfileReturn {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await UserService.getMyProfile();

      if (result.success) {
        setUser(result.data as UserProfile);
      } else {
        setError(result.error);
        setUser(null);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load user profile";
      console.error("Failed to load user profile:", err);
      setError(errorMessage);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { user, loading, error, refetch: fetchUser };
}
