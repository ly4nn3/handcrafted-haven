"use client";

import { useEffect, useState } from "react";
import { useSellerProfile } from "@/app/hooks/useSellerProfile";
import { SellerService } from "@/lib/api/sellerService";
import LoadingButton from "@/components/ui/LoadingButton";
import ProfileEditModal from "@/components/dashboard/ProfileEditModal";
import styles from "./ProfileTab.module.css";

export default function ProfileTab() {
  const { seller, loading, error, refetch } = useSellerProfile();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async (updatedData: any) => {
    try {
      const result = await SellerService.updateMySellerProfile(updatedData);
      if (result.success) {
        setIsEditModalOpen(false);
        refetch(); // Refetch the profile data
      } else {
        throw new Error(result.error || "Failed to update seller profile");
      }
    } catch (err) {
      setUpdateError(
        err instanceof Error ? err.message : "Failed to update profile"
      );
      throw err;
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.error}>{error}</p>
        <LoadingButton onClick={refetch}>Retry</LoadingButton>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className={styles.errorContainer}>
        <p>No seller profile found</p>
      </div>
    );
  }

  return (
    <div className={styles.profileContainer}>
      <h2 className={styles.title}>Seller Profile</h2>

      {updateError && (
        <div className={styles.errorContainer}>
          <p className={styles.error}>{updateError}</p>
        </div>
      )}

      <div className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <div className={styles.avatar}>
            {seller.shopName[0].toUpperCase()}
          </div>
          <div className={styles.headerInfo}>
            <h3 className={styles.shopName}>{seller.shopName}</h3>
            <p className={styles.userInfo}>
              {seller.user?.firstname} {seller.user?.lastname}
            </p>
          </div>
        </div>

        <div className={styles.profileInfo}>
          <div className={styles.infoRow}>
            <span className={styles.label}>Email:</span>
            <span className={styles.value}>{seller.user?.email || "N/A"}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Description:</span>
            <span className={styles.value}>
              {seller.description || "No description"}
            </span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Products:</span>
            <span className={styles.value}>{seller.products?.length || 0}</span>
          </div>
        </div>

        <div className={styles.actions}>
          <LoadingButton onClick={handleEditClick}>Edit Profile</LoadingButton>
        </div>
      </div>

      {isEditModalOpen && seller && (
        <ProfileEditModal
          type="seller"
          data={seller}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveProfile}
        />
      )}
    </div>
  );
}
