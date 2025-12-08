"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/app/context/UserContext";
import { AuthService } from "@/lib/api/authService";
import {
  validateEmail,
  validatePassword,
} from "@/lib/validation/authValidation";
import FormField from "@/components/ui/FormField";
import PasswordField from "@/components/ui/PasswordField";
import LoadingButton from "@/components/ui/LoadingButton";
import styles from "./Login.module.css";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Field-level errors
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setEmailError("");
    setPasswordError("");

    // Client-side validation
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error || "");
      return;
    }

    if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.error || "");
      return;
    }

    setLoading(true);

    try {
      const result = await AuthService.login(email, password);

      if (!result.success) {
        setError(result.error);
        return;
      }

      setUser({
        userId: result.data.user.id,
        firstname: result.data.user.firstname,
        lastname: result.data.user.lastname,
        email: result.data.user.email,
        role: result.data.user.role,
      });

      // Redirect based on role
      if (result.data.user.role === "seller") {
        router.push("/dashboard/seller");
      } else {
        router.push("/dashboard/user");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h1>Login</h1>

      {error && (
        <div className={styles.errorBanner} role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.loginForm} noValidate>
        <FormField
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          error={emailError}
          placeholder="your@email.com"
          required
          disabled={loading}
        />

        <PasswordField
          label="Password"
          value={password}
          onChange={setPassword}
          error={passwordError}
          required
          disabled={loading}
        />

        <LoadingButton type="submit" loading={loading} disabled={loading}>
          Login
        </LoadingButton>
      </form>

      <p className={styles.bottomText}>
        New user? <Link href="/auth/register">Register here</Link>
      </p>
    </div>
  );
}
