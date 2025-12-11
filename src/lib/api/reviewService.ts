import { ApiResponse } from "@/types/frontend.types";
import {
  ReviewResponse,
  CreateReviewDTO,
  UpdateReviewDTO,
  ReviewStats,
} from "@backend/types/review.types";

const API_BASE = "/api/reviews";

export interface PaginatedReviews {
  reviews: ReviewResponse[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export class ReviewService {
  /**
   * Create a new review
   */
  static async createReview(
    reviewData: CreateReviewDTO
  ): Promise<ApiResponse<ReviewResponse>> {
    try {
      const response = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(reviewData),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: "Network error. Please try again.",
      };
    }
  }

  /**
   * Get reviews for a product
   */
  static async getProductReviews(
    productId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<PaginatedReviews>> {
    try {
      const response = await fetch(
        `${API_BASE}/product/${productId}?page=${page}&limit=${limit}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: "Network error. Please try again.",
      };
    }
  }

  /**
   * Get review statistics for a product
   */
  static async getReviewStats(
    productId: string
  ): Promise<ApiResponse<ReviewStats>> {
    try {
      const response = await fetch(`${API_BASE}/product/${productId}/stats`, {
        method: "GET",
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: "Network error. Please try again.",
      };
    }
  }

  /**
   * Get current user's review for a product
   */
  static async getUserProductReview(
    productId: string
  ): Promise<ApiResponse<ReviewResponse | null>> {
    try {
      const response = await fetch(`${API_BASE}/product/${productId}/user`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: "Network error. Please try again.",
      };
    }
  }

  /**
   * Get all reviews by the current user
   */
  static async getMyReviews(
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<PaginatedReviews>> {
    try {
      const response = await fetch(
        `${API_BASE}/user/my-reviews?page=${page}&limit=${limit}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: "Network error. Please try again.",
      };
    }
  }

  /**
   * Get all reviews for seller's products
   */
  static async getSellerProductReviews(
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<PaginatedReviews>> {
    try {
      const response = await fetch(
        `${API_BASE}/seller/product-reviews?page=${page}&limit=${limit}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: "Network error. Please try again.",
      };
    }
  }

  /**
   * Update a review
   */
  static async updateReview(
    reviewId: string,
    updates: UpdateReviewDTO
  ): Promise<ApiResponse<ReviewResponse>> {
    try {
      const response = await fetch(`${API_BASE}/${reviewId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      return data;
    } catch (error) {
      return {
        success: false,
        error: "Network error. Please try again.",
      };
    }
  }

  /**
   * Delete a review
   */
  static async deleteReview(reviewId: string): Promise<ApiResponse<null>> {
    try {
      const response = await fetch(`${API_BASE}/${reviewId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: "Network error. Please try again.",
      };
    }
  }
}
