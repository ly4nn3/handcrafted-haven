"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./Register.module.css";

export default function RegisterPage() {
  const router = useRouter();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "seller">("user");
  const [shopName, setShopName] = useState("");
  const [description, setDescription] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const endpoint =
      role === "seller" ? "/api/sellers/register" : "/api/users/register";

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstname,
        lastname,
        email,
        password,
        ...(role === "seller" && { shopName, description }),
      }),
    });

    const data = await res.json();

    if (data.success) {
      router.push(`/auth/register/success?role=${role}`);
    } else {
      alert(data.message);
    }
  };

  return (
    <div className={styles.registerContainer}>
      <h2>Register</h2>

      <form onSubmit={handleRegister} className={styles.registerForm}>
        <input
          placeholder="First Name"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
          required
        />
        <input
          placeholder="Last Name"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          required
        />

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

        <div className={styles.roleOptions}>
          <label>
            <input
              type="radio"
              name="role"
              checked={role === "user"}
              onChange={() => setRole("user")}
            />{" "}
            User
          </label>

          <label>
            <input
              type="radio"
              name="role"
              checked={role === "seller"}
              onChange={() => setRole("seller")}
            />{" "}
            Seller
          </label>
        </div>

        {role === "seller" && (
          <>
            <input
              placeholder="Shop Name"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              required
            />

            <input
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </>
        )}

        <button type="submit">Register</button>
      </form>

      <p className={styles.bottomText}>
        Already have an account? <Link href="/auth/login">Login</Link>
      </p>
    </div>
  );
}
