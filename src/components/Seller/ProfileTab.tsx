"use client";

import { useEffect, useState } from "react";
import { useSellerProfile } from "@/app/hooks/useSellerProfile";
import LoadingButton from "@/components/ui/LoadingButton";
import styles from "./ProfileTab.module.css";

export default function ProfileTab() {
  const { seller, loading, error, refetch } = useSellerProfile();

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
          <LoadingButton>Edit Profile</LoadingButton>
        </div>
      </div>
    </div>
  );
}
