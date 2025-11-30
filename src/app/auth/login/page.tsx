"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./Login.module.css";
import { useUser } from "@/app/context/UserContext";

export default function LoginPage() {
  const { login } = useUser();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!data.success) {
      alert(data.message);
      return;
    }

    login({
      userId: data.userId,
      firstname: data.firstname,
      role: data.role,
    });

    if (data.role === "seller") {
      router.push("/dashboard/seller");
    } else {
      router.push("/");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h1>Login</h1>

      <form onSubmit={handleLogin} className={styles.loginForm}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>

      <p className={styles.bottomText}>
        New user? <Link href="/auth/register">Register here</Link>
      </p>
    </div>
  );
}
