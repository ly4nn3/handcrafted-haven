"use client";

import { useState } from "react";
import { UserProfile, SellerProfile } from "@/types/frontend.types";
import LoadingButton from "@/components/ui/LoadingButton";
import styles from "./ProfileEditModal.module.css";

interface ProfileEditModalProps {
  type: "user" | "seller";
  data: UserProfile | SellerProfile;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

export default function ProfileEditModal({
  type,
  data,
  onClose,
  onSave,
}: ProfileEditModalProps) {
  const [formData, setFormData] = useState(() => {
    if (type === "user") {
      const userProfile = data as UserProfile;
      return {
        firstname: userProfile.firstname || "",
        lastname: userProfile.lastname || "",
        email: userProfile.email || "",
      };
    } else {
      const sellerProfile = data as SellerProfile;
      return {
        shopName: sellerProfile.shopName || "",
        description: sellerProfile.description || "",
        firstname: sellerProfile.user?.firstname || "",
        lastname: sellerProfile.user?.lastname || "",
      };
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await onSave(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Edit Profile</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.errorMessage}>{error}</div>}

          {type === "user" ? (
            <>
              <div className={styles.formGroup}>
                <label htmlFor="firstname" className={styles.formLabel}>
                  First Name
                </label>
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  required
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="lastname" className={styles.formLabel}>
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  required
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.formLabel}>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled
                  className={`${styles.formInput} ${styles.formInputDisabled}`}
                />
                <small className={styles.formHint}>
                  Email cannot be changed
                </small>
              </div>
            </>
          ) : (
            <>
              <div className={styles.formGroup}>
                <label htmlFor="shopName" className={styles.formLabel}>
                  Shop Name
                </label>
                <input
                  type="text"
                  id="shopName"
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleChange}
                  required
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description" className={styles.formLabel}>
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className={styles.formTextarea}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="firstname" className={styles.formLabel}>
                  First Name
                </label>
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  required
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="lastname" className={styles.formLabel}>
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  required
                  className={styles.formInput}
                />
              </div>
            </>
          )}

          <div className={styles.formActions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <LoadingButton type="submit" loading={isSubmitting}>
              Save Changes
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
}
