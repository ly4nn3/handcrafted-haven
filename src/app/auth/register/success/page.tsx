"use client";

import { useSearchParams, useRouter } from "next/navigation";
import styles from "@/app/auth/register/Register.module.css";

export default function RegisterSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const role = searchParams.get("role") || "user";

  const handleRedirect = () => {
    router.push(role === "seller" ? "/dashboard/seller" : "/dashboard/user");
  };

  return (
    <div className={styles.registerContainer}>
      <h2>Registration Success</h2>

      {role === "seller" ? (
        <p className={styles.successMessage}>
          You're now a seller on Handcrafted Haven!
          <br />
          Start setting up your shop and sell your products.
        </p>
      ) : (
        <p className={styles.successMessage}>
          Your account has been created!
          <br />
          Happy browsing on Handcrafted Haven.
        </p>
      )}

      <button onClick={handleRedirect} className={styles.successButton}>
        Go to Dashboard
      </button>
    </div>
  );
}
