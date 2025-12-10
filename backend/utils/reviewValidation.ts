import { CreateReviewDTO, UpdateReviewDTO } from "@backend/types/review.types";
import { ValidationError } from "./validation";

/**
 * Validate create review data
 */
export const validateCreateReview = (data: any): CreateReviewDTO => {
  if (!data.productId || typeof data.productId !== "string") {
    throw new ValidationError("Product ID is required", "productId");
  }

  if (typeof data.rating !== "number" || data.rating < 1 || data.rating > 5) {
    throw new ValidationError("Rating must be between 1 and 5", "rating");
  }

  if (!Number.isInteger(data.rating)) {
    throw new ValidationError("Rating must be a whole number", "rating");
  }

  if (
    !data.comment ||
    typeof data.comment !== "string" ||
    data.comment.trim().length === 0
  ) {
    throw new ValidationError("Review comment is required", "comment");
  }

  if (data.comment.length > 1000) {
    throw new ValidationError(
      "Review comment must be 1000 characters or less",
      "comment"
    );
  }

  if (data.comment.trim().length < 10) {
    throw new ValidationError(
      "Review comment must be at least 10 characters",
      "comment"
    );
  }

  return {
    productId: data.productId,
    rating: data.rating,
    comment: data.comment.trim(),
  };
};

/**
 * Validate update review data
 */
export const validateUpdateReview = (data: any): UpdateReviewDTO => {
  const updates: UpdateReviewDTO = {};

  if (data.rating !== undefined) {
    if (typeof data.rating !== "number" || data.rating < 1 || data.rating > 5) {
      throw new ValidationError("Rating must be between 1 and 5", "rating");
    }
    if (!Number.isInteger(data.rating)) {
      throw new ValidationError("Rating must be a whole number", "rating");
    }
    updates.rating = data.rating;
  }

  if (data.comment !== undefined) {
    if (typeof data.comment !== "string" || data.comment.trim().length === 0) {
      throw new ValidationError("Review comment cannot be empty", "comment");
    }
    if (data.comment.length > 1000) {
      throw new ValidationError(
        "Review comment must be 1000 characters or less",
        "comment"
      );
    }
    if (data.comment.trim().length < 10) {
      throw new ValidationError(
        "Review comment must be at least 10 characters",
        "comment"
      );
    }
    updates.comment = data.comment.trim();
  }

  if (Object.keys(updates).length === 0) {
    throw new ValidationError("No valid fields to update", "general");
  }

  return updates;
};
