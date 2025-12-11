"use client";

import { useState, useEffect } from "react";
import { ReviewService } from "@/lib/api/reviewService";
import { ReviewResponse, UpdateReviewDTO } from "@backend/types/review.types";
import ReviewCard from "@/components/reviews/ReviewCard";
import ReviewEditModal from "@/components/reviews/ReviewEditModal";
import Pagination from "@/components/products/Pagination";
import styles from "./ReviewsTab.module.css";

export default function ReviewsTab() {
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingReview, setEditingReview] = useState<ReviewResponse | null>(
    null
  );

  useEffect(() => {
    fetchReviews();
  }, [currentPage]);

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await ReviewService.getMyReviews(currentPage, 10);

      if (result.success) {
        const data = result.data as any;
        setReviews(data.reviews);
        setTotalPages(data.pagination.totalPages);
      } else {
        setError(result.error || "Failed to load reviews");
      }
    } catch (err) {
      setError("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (review: ReviewResponse) => {
    setEditingReview(review);
  };

  const handleSaveEdit = async (reviewId: string, data: UpdateReviewDTO) => {
    setError(null);

    try {
      const result = await ReviewService.updateReview(reviewId, data);

      if (result.success) {
        setEditingReview(null);
        await fetchReviews(); // Refresh the list
      } else {
        throw new Error(result.error || "Failed to update review");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update review");
      throw err; // Re-throw so modal can handle it
    }
  };

  const handleDelete = async (reviewId: string) => {
    setError(null);

    try {
      const result = await ReviewService.deleteReview(reviewId);

      if (result.success) {
        await fetchReviews(); // Refresh the list
      } else {
        setError(result.error || "Failed to delete review");
      }
    } catch (err) {
      setError("Failed to delete review");
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Loading your reviews...</p>
      </div>
    );
  }

  return (
    <div className={styles.reviewsContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>My Reviews</h2>
        <p className={styles.subtitle}>
          Manage all your product reviews in one place
        </p>
      </div>

      {error && (
        <div className={styles.errorBanner} role="alert">
          {error}
        </div>
      )}

      {reviews.length === 0 ? (
        <div className={styles.emptyState}>
          <p>You haven't written any reviews yet.</p>
          <p>Purchase products and share your experience!</p>
        </div>
      ) : (
        <>
          <div className={styles.reviewsList}>
            {reviews.map((review) => (
              <div key={review.id} className={styles.reviewItem}>
                {/* Product Info */}
                {review.product && (
                  <div className={styles.productInfo}>
                    {review.product.images &&
                      review.product.images.length > 0 && (
                        <img
                          src={review.product.images[0]}
                          alt={review.product.name}
                          className={styles.productImage}
                        />
                      )}
                    <a
                      href={`/products/${review.productId}`}
                      className={styles.productName}
                    >
                      {review.product.name}
                    </a>
                  </div>
                )}

                {/* Review Card */}
                <ReviewCard
                  review={review}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}

      {/* Edit Modal */}
      {editingReview && (
        <ReviewEditModal
          review={editingReview}
          onClose={() => setEditingReview(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}
