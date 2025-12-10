"use client";

import { useState, useEffect } from "react";
import { ReviewService } from "@/lib/api/reviewService";
import {
  ReviewResponse,
  ReviewStats as ReviewStatsType,
  CreateReviewDTO,
  UpdateReviewDTO,
} from "@backend/types/review.types";
import { useUser } from "@/app/context/UserContext";
import ReviewStats from "./ReviewStats";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";
import LoadingButton from "@/components/ui/LoadingButton";
import styles from "./ReviewsSection.module.css";

interface ReviewsSectionProps {
  productId: string;
}

export default function ReviewsSection({ productId }: ReviewsSectionProps) {
  const { user } = useUser();

  const [stats, setStats] = useState<ReviewStatsType | null>(null);
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [userReview, setUserReview] = useState<ReviewResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState<ReviewResponse | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
    fetchReviews();
    if (user) {
      fetchUserReview();
    }
  }, [productId, currentPage, user]);

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const result = await ReviewService.getReviewStats(productId);
      if (result.success) {
        setStats(result.data as ReviewStatsType);
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await ReviewService.getProductReviews(
        productId,
        currentPage,
        5
      );

      if (result.success) {
        const data = result.data as any;
        setReviews(data.reviews);
        setTotalPages(data.pagination.totalPages);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserReview = async () => {
    try {
      const result = await ReviewService.getUserProductReview(productId);
      if (result.success && result.data) {
        setUserReview(result.data as ReviewResponse);
      }
    } catch (err) {
      console.error("Failed to fetch user review:", err);
    }
  };

  const handleSubmitReview = async (
    data: CreateReviewDTO | UpdateReviewDTO
  ) => {
    setSubmitting(true);
    setError(null);

    try {
      let result;

      if (editingReview) {
        // Update existing review
        result = await ReviewService.updateReview(
          editingReview.id,
          data as UpdateReviewDTO
        );
      } else {
        // Create new review
        result = await ReviewService.createReview(data as CreateReviewDTO);
      }

      if (result.success) {
        // Refresh data
        await Promise.all([fetchStats(), fetchReviews(), fetchUserReview()]);

        // Reset form
        setShowForm(false);
        setEditingReview(null);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (review: ReviewResponse) => {
    setEditingReview(review);
    setShowForm(true);
    // Scroll to form
    window.scrollTo({
      top: document.getElementById("review-form")?.offsetTop,
      behavior: "smooth",
    });
  };

  const handleDelete = async (reviewId: string) => {
    setError(null);

    try {
      const result = await ReviewService.deleteReview(reviewId);

      if (result.success) {
        // Refresh data
        await Promise.all([fetchStats(), fetchReviews(), fetchUserReview()]);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to delete review");
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingReview(null);
  };

  return (
    <div className={styles.reviewsSection}>
      <h2 className={styles.title}>Customer Reviews</h2>

      {/* Error Banner */}
      {error && (
        <div className={styles.errorBanner} role="alert">
          {error}
        </div>
      )}

      <div className={styles.content}>
        {/* Stats Column */}
        <div className={styles.statsColumn}>
          {statsLoading ? (
            <div className={styles.statsLoading}>
              <div className={styles.spinner} />
            </div>
          ) : stats ? (
            <ReviewStats stats={stats} />
          ) : null}
        </div>

        {/* Reviews Column */}
        <div className={styles.reviewsColumn}>
          {/* User Review Form/CTA */}
          {user ? (
            <div id="review-form" className={styles.userReviewSection}>
              {userReview && !showForm ? (
                <div className={styles.hasReviewBanner}>
                  <p>You've already reviewed this product</p>
                  <LoadingButton onClick={() => handleEdit(userReview)}>
                    Edit Your Review
                  </LoadingButton>
                </div>
              ) : showForm ? (
                <ReviewForm
                  productId={productId}
                  initialData={
                    editingReview
                      ? {
                          rating: editingReview.rating,
                          comment: editingReview.comment,
                        }
                      : undefined
                  }
                  onSubmit={handleSubmitReview}
                  onCancel={handleCancelForm}
                  submitLabel={
                    editingReview ? "Update Review" : "Submit Review"
                  }
                  isLoading={submitting}
                />
              ) : (
                <div className={styles.writeReviewCTA}>
                  <p>Share your experience with this product</p>
                  <LoadingButton onClick={() => setShowForm(true)}>
                    Write a Review
                  </LoadingButton>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.loginPrompt}>
              <p>Please log in to write a review</p>
            </div>
          )}

          {/* Reviews List */}
          <div className={styles.reviewsList}>
            <h3 className={styles.reviewsListTitle}>All Reviews</h3>
            <ReviewList
              reviews={reviews}
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              onEdit={handleEdit}
              onDelete={handleDelete}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
