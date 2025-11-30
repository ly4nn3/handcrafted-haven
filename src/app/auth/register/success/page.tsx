"use client";

import { useSearchParams, useRouter } from "next/navigation";
import styles from "@/app/auth/register/Register.module.css";

export default function ResgisterSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const role = searchParams.get("role") || "user";

  return (
    <div className={styles.registerContainer}>
      <h2>Registration Success</h2>

      {role === "seller" ? (
        <p className={styles.successMessage}>
          Your seller account has been created!
          <br />
          Log in and start setting up your shop.
        </p>
      ) : (
        <p className={styles.successMessage}>
          Your account has been created!
          <br />
          Happy browsing on Handcrafted Haven.
        </p>
      )}

      <button
        onClick={() => router.push("/auth/login")}
        className={styles.successButton}
      >
        Go to Login
      </button>
    </div>
  );
}
