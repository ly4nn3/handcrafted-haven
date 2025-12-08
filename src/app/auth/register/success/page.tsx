"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingButton from "@/components/ui/LoadingButton";
import styles from "./Success.module.css";

export default function RegisterSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [countdown, setCountdown] = useState(20);

  const role = searchParams.get("role") || "user";

  // Auto-redirect after countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      handleRedirect();
    }
  }, [countdown]);

  const handleRedirect = () => {
    router.push(role === "seller" ? "/dashboard/seller" : "/dashboard/user");
  };

  return (
    <div className={styles.successContainer}>
      <div className={styles.successCard}>
        <div className={styles.successIcon} aria-hidden="true">
          ✓
        </div>

        <h2 className={styles.title}>Registration Successful! 🎉</h2>

        {role === "seller" ? (
          <div className={styles.content}>
            <p className={styles.message}>
              Welcome to <strong>Handcrafted Haven</strong>!
            </p>
            <p className={styles.description}>
              You're now a seller on our platform. Start setting up your shop,
              add products, and begin selling your handcrafted items.
            </p>
            <ul className={styles.nextSteps}>
              <li>✨ Complete your shop profile</li>
              <li>📦 Add your first products</li>
              <li>💰 Start receiving orders</li>
            </ul>
          </div>
        ) : (
          <div className={styles.content}>
            <p className={styles.message}>
              Welcome to <strong>Handcrafted Haven</strong>!
            </p>
            <p className={styles.description}>
              Your account has been created successfully. Start exploring unique
              handcrafted products from talented artisans.
            </p>
            <ul className={styles.nextSteps}>
              <li>🎨 Browse products</li>
              <li>❤️ Save your favorites</li>
              <li>🛒 Start shopping</li>
            </ul>
          </div>
        )}

        <div className={styles.actions}>
          <LoadingButton onClick={handleRedirect}>
            Go to Dashboard
          </LoadingButton>
          <p className={styles.autoRedirect}>
            Redirecting automatically in {countdown} second
            {countdown !== 1 ? "s" : ""}...
          </p>
        </div>
      </div>
    </div>
  );
}
