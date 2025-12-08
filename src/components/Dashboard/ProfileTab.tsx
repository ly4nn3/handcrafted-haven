"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/app/context/UserContext";
import { UserService } from "@/lib/api/userService";
import { UserProfile, SellerProfile } from "@/types/frontend.types";
import LoadingButton from "@/components/ui/LoadingButton";
import styles from "./ProfileTab.module.css";

interface ProfileTabProps {
  type: "user" | "seller";
}

export default function ProfileTab({ type }: ProfileTabProps) {
  const { user } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [sellerProfile, setSellerProfile] = useState<SellerProfile | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        if (type === "user") {
          const result = await UserService.getMyProfile();
          if (result.success) {
            setProfile(result.data as UserProfile);
          } else {
            setError(result.error);
          }
        } else {
          const result = await UserService.getMySellerProfile();
          if (result.success) {
            setSellerProfile(result.data as SellerProfile);
          } else {
            setError(result.error);
          }
        }
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [type]);

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
        <LoadingButton onClick={() => window.location.reload()}>
          Retry
        </LoadingButton>
      </div>
    );
  }

  if (type === "seller" && sellerProfile) {
    return (
      <div className={styles.profileContainer}>
        <h2 className={styles.title}>Seller Profile</h2>

        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <div className={styles.avatar}>
              {sellerProfile.user?.firstname[0] || "S"}
            </div>
            <div className={styles.headerInfo}>
              <h3 className={styles.shopName}>{sellerProfile.shopName}</h3>
              <p className={styles.userInfo}>
                {sellerProfile.user?.firstname} {sellerProfile.user?.lastname}
              </p>
            </div>
          </div>

          <div className={styles.profileInfo}>
            <div className={styles.infoRow}>
              <span className={styles.label}>Email:</span>
              <span className={styles.value}>{sellerProfile.user?.email}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Description:</span>
              <span className={styles.value}>
                {sellerProfile.description || "No description"}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Products:</span>
              <span className={styles.value}>
                {sellerProfile.products?.length || 0}
              </span>
            </div>
          </div>

          <div className={styles.actions}>
            <LoadingButton>Edit Profile</LoadingButton>
          </div>
        </div>
      </div>
    );
  }

  if (profile) {
    return (
      <div className={styles.profileContainer}>
        <h2 className={styles.title}>My Profile</h2>

        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <div className={styles.avatar}>{profile.firstname[0]}</div>
            <div className={styles.headerInfo}>
              <h3 className={styles.userName}>
                {profile.firstname} {profile.lastname}
              </h3>
              <p className={styles.userRole}>
                {profile.role === "seller" ? "Seller" : "Customer"}
              </p>
            </div>
          </div>

          <div className={styles.profileInfo}>
            <div className={styles.infoRow}>
              <span className={styles.label}>Email:</span>
              <span className={styles.value}>{profile.email}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Member since:</span>
              <span className={styles.value}>
                {profile.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          </div>

          <div className={styles.actions}>
            <LoadingButton>Edit Profile</LoadingButton>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
