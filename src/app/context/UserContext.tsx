"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { UserService } from "@/lib/api/userService";
import { UserContextData } from "@/types/frontend.types";

interface UserContextType {
  user: UserContextData | null;
  setUser: (userData: UserContextData | null) => void;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  loading: true,
  refreshUser: async () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<UserContextData | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Refresh user from backend session
   */
  const refreshUser = useCallback(async () => {
    setLoading(true);
    try {
      const result = await UserService.getMyProfile();

      if (result.success) {
        const userData: UserContextData = {
          userId: result.data.id,
          firstname: result.data.firstname,
          lastname: result.data.lastname,
          email: result.data.email,
          role: result.data.role,
        };
        setUserState(userData);
        // Sync with localStorage
        safeSetLocalStorage("user", JSON.stringify(userData));
      } else {
        // Session invalid, clear user
        setUserState(null);
        safeRemoveLocalStorage("user");
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
      setUserState(null);
      safeRemoveLocalStorage("user");
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Initialize user from localStorage and verify with backend
   */
  useEffect(() => {
    const initUser = async () => {
      // First try localStorage for immediate UI
      const stored = safeGetLocalStorage("user");
      if (stored) {
        try {
          const parsedUser = JSON.parse(stored);
          setUserState(parsedUser);
        } catch (error) {
          console.error("Failed to parse stored user:", error);
        }
      }

      // Then verify with backend
      await refreshUser();
    };

    initUser();
  }, [refreshUser]);

  /**
   * Set user (called after login/register)
   */
  const setUser = useCallback((userData: UserContextData | null) => {
    setUserState(userData);
    if (userData) {
      safeSetLocalStorage("user", JSON.stringify(userData));
    } else {
      safeRemoveLocalStorage("user");
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

/**
 * Safe localStorage operations (handles errors and SSR)
 */
const safeGetLocalStorage = (key: string): string | null => {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error("localStorage.getItem error:", error);
    return null;
  }
};

const safeSetLocalStorage = (key: string, value: string): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error("localStorage.setItem error:", error);
  }
};

const safeRemoveLocalStorage = (key: string): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("localStorage.removeItem error:", error);
  }
};
