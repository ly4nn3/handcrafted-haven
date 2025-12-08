"use client";

import { useEffect, useState, useCallback } from "react";
import { UserService } from "@/lib/api/userService";
import { SellerProfile } from "@/types/frontend.types";

interface UseSellerProfileReturn {
  seller: SellerProfile | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useSellerProfile(): UseSellerProfileReturn {
  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSeller = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await UserService.getMySellerProfile();

      if (result.success) {
        setSeller(result.data as SellerProfile);
      } else {
        setError(result.error);
        setSeller(null);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load seller profile";
      console.error("Failed to load seller profile:", err);
      setError(errorMessage);
      setSeller(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSeller();
  }, [fetchSeller]);

  return { seller, loading, error, refetch: fetchSeller };
}
