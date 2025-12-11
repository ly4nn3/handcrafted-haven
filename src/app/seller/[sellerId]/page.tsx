"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { SellerService } from "@/lib/api/sellerService";
import { SellerProfile } from "@/types/frontend.types";
import LoadingButton from "@/components/ui/LoadingButton";
import styles from "./SellerPage.module.css";

export default function SellerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const sellerId = params.sellerId as string;

  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSeller();
  }, [sellerId]);

  const fetchSeller = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await SellerService.getSellerById(sellerId);

      if (result.success) {
        setSeller(result.data as SellerProfile);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to load seller profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Loading seller profile...</p>
      </div>
    );
  }

  if (error || !seller) {
    return (
      <div className={styles.errorContainer}>
        <h2>Seller Not Found</h2>
        <p>{error || "The seller you're looking for doesn't exist."}</p>
        <LoadingButton onClick={() => router.push("/shop")}>
          Browse Products
        </LoadingButton>
      </div>
    );
  }

  return (
    <div className={styles.sellerProfileContainer}>
      <div className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <div className={styles.avatar}>
            {seller.shopName[0].toUpperCase()}
          </div>
          <div className={styles.headerInfo}>
            <h1 className={styles.sellerName}>
              {seller.user?.firstname} {seller.user?.lastname}
            </h1>
            <p className={styles.role}>Seller</p>
          </div>
        </div>

        <div className={styles.profileInfo}>
          <div className={styles.infoSection}>
            <h2 className={styles.sectionTitle}>Contact Information</h2>
            <div className={styles.infoRow}>
              <span className={styles.label}>Email:</span>
              <span className={styles.value}>
                {seller.user?.email || "N/A"}
              </span>
            </div>
          </div>

          <div className={styles.infoSection}>
            <h2 className={styles.sectionTitle}>Shop Information</h2>
            <div className={styles.infoRow}>
              <span className={styles.label}>Shop Name:</span>
              <span className={styles.value}>{seller.shopName}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Products:</span>
              <span className={styles.value}>
                {seller.products?.length || 0}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Member Since:</span>
              <span className={styles.value}>
                {seller.createdAt
                  ? new Date(seller.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"}
              </span>
            </div>
          </div>

          {seller.description && (
            <div className={styles.infoSection}>
              <h2 className={styles.sectionTitle}>About</h2>
              <p className={styles.description}>{seller.description}</p>
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <Link href={`/shop/${sellerId}`}>
            <LoadingButton>Visit Shop</LoadingButton>
          </Link>
          <LoadingButton variant="outline" onClick={() => router.back()}>
            Go Back
          </LoadingButton>
        </div>
      </div>
    </div>
  );
}
