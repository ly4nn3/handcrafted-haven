"use client";

import { useState } from "react";
import { ReviewResponse, UpdateReviewDTO } from "@backend/types/review.types";
import LoadingButton from "@/components/ui/LoadingButton";
import styles from "./ReviewEditModal.module.css";

interface ReviewEditModalProps {
  review: ReviewResponse;
  onClose: () => void;
  onSave: (reviewId: string, data: UpdateReviewDTO) => Promise<void>;
}

export default function ReviewEditModal({
  review,
  onClose,
  onSave,
}: ReviewEditModalProps) {
  const [rating, setRating] = useState(review.rating);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState(review.comment);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      setError("Review comment is required");
      return;
    }

    if (comment.trim().length < 10) {
      setError("Review must be at least 10 characters");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSave(review.id, {
        rating,
        comment: comment.trim(),
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Edit Review</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            type="button"
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.errorMessage}>{error}</div>}

          {/* Product Info */}
          {review.product && (
            <div className={styles.productInfo}>
              {review.product.images?.[0] && (
                <img
                  src={review.product.images[0]}
                  alt={review.product.name}
                  className={styles.productImage}
                />
              )}
              <span className={styles.productName}>{review.product.name}</span>
            </div>
          )}

          {/* Rating Selector */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Your Rating <span className={styles.required}>*</span>
            </label>
            <div className={styles.starRating}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className={`${styles.star} ${
                    star <= (hoveredRating || rating) ? styles.filled : ""
                  }`}
                  disabled={isSubmitting}
                >
                  ★
                </button>
              ))}
              {rating > 0 && (
                <span className={styles.ratingText}>
                  {rating} {rating === 1 ? "star" : "stars"}
                </span>
              )}
            </div>
          </div>

          {/* Comment */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Your Review <span className={styles.required}>*</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Share your experience with this product..."
              className={styles.formTextarea}
              rows={6}
              maxLength={1000}
              disabled={isSubmitting}
            />
            <div className={styles.charCount}>
              {comment.length}/1000 characters
            </div>
          </div>

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
              Update Review
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
}
