"use client";

import { useState } from "react";
import { ReviewResponse } from "@backend/types/review.types";
import { useUser } from "@/app/context/UserContext";
import styles from "./ReviewCard.module.css";

interface ReviewCardProps {
  review: ReviewResponse;
  onEdit?: (review: ReviewResponse) => void;
  onDelete?: (reviewId: string) => void;
}

export default function ReviewCard({
  review,
  onEdit,
  onDelete,
}: ReviewCardProps) {
  const { user } = useUser();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const currentUserId = user?.userId?.toString();
  const reviewUserId =
    typeof review.userId === "string"
      ? review.userId
      : (review.userId as any)?.id || (review.userId as any)?._id;

  const isOwnReview = currentUserId === reviewUserId?.toString();

  const reviewUser = review.user || (review.userId as any);

  const reviewDate = new Date(review.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleDelete = () => {
    if (onDelete) {
      onDelete(review.id);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className={styles.reviewCard}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            {reviewUser?.firstname?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <p className={styles.userName}>
              {reviewUser?.firstname} {reviewUser?.lastname}
            </p>
            <p className={styles.reviewDate}>{reviewDate}</p>
          </div>
        </div>

        {/* Rating */}
        <div className={styles.rating}>
          <div className={styles.stars}>
            {Array.from({ length: review.rating }, (_, i) => (
              <span key={`filled-${i}`}>★</span>
            ))}
            {Array.from({ length: 5 - review.rating }, (_, i) => (
              <span key={`empty-${i}`}>☆</span>
            ))}
          </div>
        </div>
      </div>

      {/* Comment */}
      <p className={styles.comment}>{review.comment}</p>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.badges}>
          {review.isVerifiedPurchase && (
            <span className={styles.verifiedBadge}>✓ Verified Purchase</span>
          )}
        </div>

        {isOwnReview && (onEdit || onDelete) && (
          <div className={styles.actions}>
            {onEdit && (
              <button
                onClick={() => onEdit(review)}
                className={styles.editButton}
              >
                Edit
              </button>
            )}
            {onDelete && (
              <>
                {showDeleteConfirm ? (
                  <div className={styles.deleteConfirm}>
                    <span>Are you sure?</span>
                    <button
                      onClick={handleDelete}
                      className={styles.confirmButton}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className={styles.cancelButton}
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className={styles.deleteButton}
                  >
                    Delete
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
