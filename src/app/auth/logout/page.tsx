"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { AuthService } from "@/lib/api/authService";
import styles from "./Logout.module.css";

export default function LogoutPage() {
  const router = useRouter();
  const { setUser } = useUser(); // Updated
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const doLogout = async () => {
      try {
        await AuthService.logout();
        setUser(null);

        setTimeout(() => {
          router.push("/auth/login");
        }, 1000);
      } catch (err) {
        setError("Failed to logout. Redirecting anyway...");

        // Still logout locally even if API fails
        setUser(null);
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      }
    };

    doLogout();
  }, [setUser, router]);

  return (
    <div className={styles.logoutContainer}>
      <div className={styles.logoutCard}>
        {error ? (
          <>
            <div className={styles.icon}>⚠️</div>
            <h2>Logout Issue</h2>
            <p className={styles.message}>{error}</p>
          </>
        ) : (
          <>
            <div className={styles.spinner} aria-hidden="true" />
            <h2>Logging out...</h2>
            <p className={styles.message}>You'll be redirected shortly.</p>
          </>
        )}
      </div>
    </div>
  );
}
