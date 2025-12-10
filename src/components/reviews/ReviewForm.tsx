"use client";

import { useState, FormEvent } from "react";
import { CreateReviewDTO, UpdateReviewDTO } from "@backend/types/review.types";
import LoadingButton from "@/components/ui/LoadingButton";
import styles from "./ReviewForm.module.css";

interface ReviewFormProps {
  productId: string;
  initialData?: {
    rating: number;
    comment: string;
  };
  onSubmit: (data: CreateReviewDTO | UpdateReviewDTO) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  isLoading?: boolean;
}

export default function ReviewForm({
  productId,
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Submit Review",
  isLoading = false,
}: ReviewFormProps) {
  const [rating, setRating] = useState(initialData?.rating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState(initialData?.comment || "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (rating === 0) {
      newErrors.rating = "Please select a rating";
    }

    if (!comment.trim()) {
      newErrors.comment = "Review comment is required";
    } else if (comment.trim().length < 10) {
      newErrors.comment = "Review must be at least 10 characters";
    } else if (comment.length > 1000) {
      newErrors.comment = "Review must be 1000 characters or less";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const reviewData: CreateReviewDTO = {
      productId,
      rating,
      comment: comment.trim(),
    };

    await onSubmit(reviewData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.reviewForm} noValidate>
      {/* Rating Selector */}
      <div className={styles.formField}>
        <label className={styles.label}>
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
              disabled={isLoading}
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
        {errors.rating && (
          <span className={styles.errorText}>{errors.rating}</span>
        )}
      </div>

      {/* Comment */}
      <div className={styles.formField}>
        <label className={styles.label}>
          Your Review <span className={styles.required}>*</span>
        </label>
        <textarea
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
            if (errors.comment) {
              setErrors((prev) => ({ ...prev, comment: "" }));
            }
          }}
          placeholder="Share your experience with this product..."
          className={`${styles.textarea} ${errors.comment ? styles.error : ""}`}
          rows={6}
          maxLength={1000}
          disabled={isLoading}
        />
        <div className={styles.textareaFooter}>
          <span className={styles.charCount}>
            {comment.length}/1000 characters
          </span>
          {errors.comment && (
            <span className={styles.errorText}>{errors.comment}</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className={styles.cancelButton}
            disabled={isLoading}
          >
            Cancel
          </button>
        )}
        <LoadingButton type="submit" loading={isLoading} disabled={isLoading}>
          {submitLabel}
        </LoadingButton>
      </div>
    </form>
  );
}
