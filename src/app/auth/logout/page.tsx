"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";

export default function LogoutPage() {
  const router = useRouter();
  const { logout } = useUser();

  useEffect(() => {
    const doLogout = async () => {
      await fetch("/api/auth/logout", { method: "POST" });
      logout(); // clear context
      router.push("/auth/login");
    };

    doLogout();
  }, [logout, router]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Logging out...</h2>
      <p>Please wait a moment.</p>
    </div>
  );
}
