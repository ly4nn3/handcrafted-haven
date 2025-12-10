"use client";

import { useState } from "react";
import { ReviewResponse } from "@backend/types/review.types";
import ReviewCard from "./ReviewCard";
import Pagination from "@/components/products/Pagination";
import styles from "./ReviewList.module.css";

interface ReviewListProps {
  reviews: ReviewResponse[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onEdit?: (review: ReviewResponse) => void;
  onDelete?: (reviewId: string) => void;
  loading?: boolean;
}

export default function ReviewList({
  reviews,
  totalPages,
  currentPage,
  onPageChange,
  onEdit,
  onDelete,
  loading = false,
}: ReviewListProps) {
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Loading reviews...</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No reviews yet. Be the first to review this product!</p>
      </div>
    );
  }

  return (
    <div className={styles.reviewList}>
      <div className={styles.reviews}>
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
