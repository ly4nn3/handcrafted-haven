"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/app/context/UserContext";
import { AuthService } from "@/lib/api/authService";
import {
  validateEmail,
  validatePassword,
  validateName,
} from "@/lib/validation/authValidation";
import FormField from "@/components/ui/FormField";
import PasswordField from "@/components/ui/PasswordField";
import LoadingButton from "@/components/ui/LoadingButton";
import styles from "./Register.module.css";

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useUser();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    role: "user" as "user" | "seller",
    shopName: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    shopName: "",
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = (): boolean => {
    const errors = {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      shopName: "",
    };

    const firstnameValidation = validateName(formData.firstname, "First name");
    if (!firstnameValidation.isValid) {
      errors.firstname = firstnameValidation.error || "";
    }

    const lastnameValidation = validateName(formData.lastname, "Last name");
    if (!lastnameValidation.isValid) {
      errors.lastname = lastnameValidation.error || "";
    }

    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.error || "";
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.error || "";
    }

    if (formData.role === "seller" && !formData.shopName.trim()) {
      errors.shopName = "Shop name is required for sellers";
    }

    setFieldErrors(errors);

    return !Object.values(errors).some((error) => error !== "");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await AuthService.register(formData);

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

      // Redirect to success page
      router.push(`/auth/register/success?role=${formData.role}`);
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registerContainer}>
      <h2>Register</h2>

      {error && (
        <div className={styles.errorBanner} role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.registerForm} noValidate>
        <FormField
          label="First Name"
          value={formData.firstname}
          onChange={(val) => updateField("firstname", val)}
          error={fieldErrors.firstname}
          placeholder="John"
          required
          disabled={loading}
        />

        <FormField
          label="Last Name"
          value={formData.lastname}
          onChange={(val) => updateField("lastname", val)}
          error={fieldErrors.lastname}
          placeholder="Doe"
          required
          disabled={loading}
        />

        <FormField
          label="Email"
          type="email"
          value={formData.email}
          onChange={(val) => updateField("email", val)}
          error={fieldErrors.email}
          placeholder="your@email.com"
          required
          disabled={loading}
        />

        <PasswordField
          label="Password"
          value={formData.password}
          onChange={(val) => updateField("password", val)}
          error={fieldErrors.password}
          showStrength
          required
          disabled={loading}
        />

        <div className={styles.roleOptions}>
          <label className={styles.roleLabel}>
            <input
              type="radio"
              name="role"
              checked={formData.role === "user"}
              onChange={() => updateField("role", "user")}
              disabled={loading}
            />
            <span>User - Browse and buy products</span>
          </label>
          <label className={styles.roleLabel}>
            <input
              type="radio"
              name="role"
              checked={formData.role === "seller"}
              onChange={() => updateField("role", "seller")}
              disabled={loading}
            />
            <span>Seller - Create and sell products</span>
          </label>
        </div>

        {formData.role === "seller" && (
          <div className={styles.sellerFields}>
            <FormField
              label="Shop Name"
              value={formData.shopName}
              onChange={(val) => updateField("shopName", val)}
              error={fieldErrors.shopName}
              placeholder="My Awesome Shop"
              required
              disabled={loading}
            />

            <div className={styles.formField}>
              <label className={styles.label}>
                Description <span className={styles.optional}>(Optional)</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Tell customers about your shop..."
                className={styles.textarea}
                rows={4}
                disabled={loading}
              />
            </div>
          </div>
        )}

        <LoadingButton type="submit" loading={loading} disabled={loading}>
          Create Account
        </LoadingButton>
      </form>

      <p className={styles.bottomText}>
        Already have an account? <Link href="/auth/login">Login</Link>
      </p>
    </div>
  );
}
