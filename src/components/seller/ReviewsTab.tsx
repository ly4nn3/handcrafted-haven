"use client";

import { useState, useEffect } from "react";
import { ReviewService } from "@/lib/api/reviewService";
import { ReviewResponse } from "@backend/types/review.types";
import ReviewCard from "@/components/reviews/ReviewCard";
import ReviewEditModal from "@/components/reviews/ReviewEditModal";
import Pagination from "@/components/products/Pagination";
import styles from "./ReviewsTab.module.css";

type TabType = "my-reviews" | "product-reviews";

export default function ReviewsTab() {
  const [activeTab, setActiveTab] = useState<TabType>("product-reviews");

  // My Reviews (as a customer)
  const [myReviews, setMyReviews] = useState<ReviewResponse[]>([]);
  const [myReviewsLoading, setMyReviewsLoading] = useState(false);
  const [myReviewsPage, setMyReviewsPage] = useState(1);
  const [myReviewsTotalPages, setMyReviewsTotalPages] = useState(1);
  const [editingReview, setEditingReview] = useState<ReviewResponse | null>(
    null
  );

  // Product Reviews (from customers)
  const [productReviews, setProductReviews] = useState<ReviewResponse[]>([]);
  const [productReviewsLoading, setProductReviewsLoading] = useState(false);
  const [productReviewsPage, setProductReviewsPage] = useState(1);
  const [productReviewsTotalPages, setProductReviewsTotalPages] = useState(1);
  const [filterRating, setFilterRating] = useState<number | null>(null);

  const [error, setError] = useState<string | null>(null);

  // Fetch my reviews (as customer)
  useEffect(() => {
    if (activeTab === "my-reviews") {
      fetchMyReviews();
    }
  }, [myReviewsPage, activeTab]);

  // Fetch product reviews (reviews on my products as seller)
  useEffect(() => {
    if (activeTab === "product-reviews") {
      fetchProductReviews();
    }
  }, [productReviewsPage, activeTab]);

  const fetchMyReviews = async () => {
    setMyReviewsLoading(true);
    setError(null);

    try {
      const result = await ReviewService.getMyReviews(myReviewsPage, 10);

      if (result.success) {
        const data = result.data as any;
        setMyReviews(data.reviews);
        setMyReviewsTotalPages(data.pagination.totalPages);
      } else {
        setError(result.error || "Failed to load your reviews");
      }
    } catch (err) {
      setError("Failed to load your reviews");
    } finally {
      setMyReviewsLoading(false);
    }
  };

  const fetchProductReviews = async () => {
    setProductReviewsLoading(true);
    setError(null);

    try {
      const result = await ReviewService.getSellerProductReviews(
        productReviewsPage,
        10
      );

      if (result.success) {
        const data = result.data as any;
        setProductReviews(data.reviews);
        setProductReviewsTotalPages(data.pagination.totalPages);
      } else {
        setError(result.error || "Failed to load product reviews");
      }
    } catch (err) {
      setError("Failed to load product reviews");
    } finally {
      setProductReviewsLoading(false);
    }
  };

  const handleEdit = (review: ReviewResponse) => {
    setEditingReview(review);
  };

  const handleSaveEdit = async (reviewId: string, data: any) => {
    setError(null);

    try {
      const result = await ReviewService.updateReview(reviewId, data);

      if (result.success) {
        setEditingReview(null);
        await fetchMyReviews();
      } else {
        throw new Error(result.error || "Failed to update review");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update review");
      throw err;
    }
  };

  const handleDelete = async (reviewId: string) => {
    setError(null);

    try {
      const result = await ReviewService.deleteReview(reviewId);

      if (result.success) {
        await fetchMyReviews();
      } else {
        setError(result.error || "Failed to delete review");
      }
    } catch (err) {
      setError("Failed to delete review");
    }
  };

  const filteredProductReviews = filterRating
    ? productReviews.filter((r) => r.rating === filterRating)
    : productReviews;

  const loading =
    activeTab === "my-reviews" ? myReviewsLoading : productReviewsLoading;

  return (
    <div className={styles.reviewsContainer}>
      {/* Tab Switcher */}
      <div className={styles.tabSwitcher}>
        <button
          className={`${styles.tabButton} ${
            activeTab === "product-reviews" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("product-reviews")}
        >
          Reviews on My Products
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === "my-reviews" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("my-reviews")}
        >
          My Reviews as Customer
        </button>
      </div>

      {error && (
        <div className={styles.errorBanner} role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <p>Loading reviews...</p>
        </div>
      ) : (
        <>
          {/* Product Reviews Tab */}
          {activeTab === "product-reviews" && (
            <div className={styles.tabContent}>
              <div className={styles.header}>
                <h2 className={styles.title}>Reviews on My Products</h2>
                <p className={styles.subtitle}>
                  Reviews from customers who purchased your products
                </p>
              </div>

              {productReviews.length > 0 && (
                <div className={styles.filters}>
                  <label className={styles.filterLabel}>
                    Filter by rating:
                  </label>
                  <select
                    value={filterRating || ""}
                    onChange={(e) =>
                      setFilterRating(
                        e.target.value ? Number(e.target.value) : null
                      )
                    }
                    className={styles.filterSelect}
                  >
                    <option value="">All ratings</option>
                    <option value="5">5 stars</option>
                    <option value="4">4 stars</option>
                    <option value="3">3 stars</option>
                    <option value="2">2 stars</option>
                    <option value="1">1 star</option>
                  </select>
                </div>
              )}

              {filteredProductReviews.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>No reviews yet for your products.</p>
                  <p>Reviews will appear here once customers leave feedback.</p>
                </div>
              ) : (
                <>
                  <div className={styles.reviewsList}>
                    {filteredProductReviews.map((review) => (
                      <div key={review.id} className={styles.reviewItem}>
                        {review.product && (
                          <div className={styles.productInfo}>
                            {review.product.images?.[0] && (
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
                        <ReviewCard review={review} />
                      </div>
                    ))}
                  </div>

                  {productReviewsTotalPages > 1 && (
                    <Pagination
                      currentPage={productReviewsPage}
                      totalPages={productReviewsTotalPages}
                      onPageChange={setProductReviewsPage}
                    />
                  )}
                </>
              )}
            </div>
          )}

          {/* My Reviews Tab */}
          {activeTab === "my-reviews" && (
            <div className={styles.tabContent}>
              <div className={styles.header}>
                <h2 className={styles.title}>My Reviews as Customer</h2>
                <p className={styles.subtitle}>
                  Reviews you've written when purchasing products
                </p>
              </div>

              {myReviews.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>You haven't written any reviews yet.</p>
                  <p>Purchase products and share your experience!</p>
                </div>
              ) : (
                <>
                  <div className={styles.reviewsList}>
                    {myReviews.map((review) => (
                      <div key={review.id} className={styles.reviewItem}>
                        {review.product && (
                          <div className={styles.productInfo}>
                            {review.product.images?.[0] && (
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
                        <ReviewCard
                          review={review}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      </div>
                    ))}
                  </div>

                  {myReviewsTotalPages > 1 && (
                    <Pagination
                      currentPage={myReviewsPage}
                      totalPages={myReviewsTotalPages}
                      onPageChange={setMyReviewsPage}
                    />
                  )}
                </>
              )}
            </div>
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
