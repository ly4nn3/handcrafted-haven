"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import styles from "./ProtectedRoute.module.css";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: "user" | "seller";
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  role,
  redirectTo = "/auth/login",
}: ProtectedRouteProps) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Not authenticated
      if (!user) {
        router.push(redirectTo);
        return;
      }

      // Role mismatch
      if (role && user.role !== role) {
        // Redirect to appropriate dashboard
        const targetDashboard =
          user.role === "seller" ? "/dashboard/seller" : "/dashboard/user";
        router.push(targetDashboard);
      }
    }
  }, [user, loading, role, redirectTo, router]);

  // Show loading state
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Loading...</p>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return (
      <div className={styles.loadingContainer}>
        <p>Redirecting to login...</p>
      </div>
    );
  }

  // Role mismatch
  if (role && user.role !== role) {
    return (
      <div className={styles.loadingContainer}>
        <p>Redirecting to your dashboard...</p>
      </div>
    );
  }

  return <>{children}</>;
}
