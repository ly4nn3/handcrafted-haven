import Review, { IReview } from "@backend/models/Review";
import Product from "@backend/models/Product";
import { CreateReviewDTO, UpdateReviewDTO } from "@backend/types/review.types";

/**
 * Create a new review
 */
export const createReview = async (
  userId: string,
  reviewData: CreateReviewDTO
): Promise<IReview> => {
  const { productId, rating, comment } = reviewData;

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  // Check if user already reviewed this product
  const existingReview = await Review.findOne({ productId, userId });
  if (existingReview) {
    throw new Error("You have already reviewed this product");
  }

  // Create review
  const review = new Review({
    productId,
    userId,
    rating,
    comment,
  });

  await review.save();

  // Update product rating
  await updateProductRating(productId);

  // Populate user info
  await review.populate("userId", "firstname lastname");

  return review;
};

/**
 * Get all reviews for a product
 */
export const getProductReviews = async (
  productId: string,
  page: number = 1,
  limit: number = 10
) => {
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    Review.find({ productId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "firstname lastname"),
    Review.countDocuments({ productId }),
  ]);

  return {
    reviews,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get review statistics for a product
 */
export const getReviewStats = async (productId: string) => {
  const reviews = await Review.find({ productId });

  if (reviews.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      },
    };
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;

  const ratingDistribution = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  return {
    averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
    totalReviews: reviews.length,
    ratingDistribution,
  };
};

/**
 * Get a single review by ID
 */
export const getReviewById = async (reviewId: string): Promise<IReview> => {
  const review = await Review.findById(reviewId).populate(
    "userId",
    "firstname lastname"
  );

  if (!review) {
    throw new Error("Review not found");
  }

  return review;
};

/**
 * Update a review (user can only update their own)
 */
export const updateReview = async (
  userId: string,
  reviewId: string,
  updates: UpdateReviewDTO
): Promise<IReview> => {
  const review = await Review.findById(reviewId);

  if (!review) {
    throw new Error("Review not found");
  }

  // Verify ownership
  if (review.userId.toString() !== userId) {
    throw new Error("Unauthorized: You can only update your own reviews");
  }

  Object.assign(review, updates);
  await review.save();

  // Update product rating if rating changed
  if (updates.rating !== undefined) {
    await updateProductRating(review.productId.toString());
  }

  await review.populate("userId", "firstname lastname");

  return review;
};

/**
 * Delete a review (user can only delete their own)
 */
export const deleteReview = async (
  userId: string,
  reviewId: string
): Promise<void> => {
  const review = await Review.findById(reviewId);

  if (!review) {
    throw new Error("Review not found");
  }

  // Verify ownership
  if (review.userId.toString() !== userId) {
    throw new Error("Unauthorized: You can only delete your own reviews");
  }

  const productId = review.productId.toString();

  await Review.findByIdAndDelete(reviewId);

  // Update product rating
  await updateProductRating(productId);
};

/**
 * Get user's review for a specific product
 */
export const getUserProductReview = async (
  userId: string,
  productId: string
): Promise<IReview | null> => {
  const review = await Review.findOne({ userId, productId }).populate(
    "userId",
    "firstname lastname"
  );

  return review;
};

/**
 * Helper function to update product's average rating and total reviews
 */
async function updateProductRating(productId: string): Promise<void> {
  const stats = await getReviewStats(productId);

  await Product.findByIdAndUpdate(productId, {
    averageRating: stats.averageRating,
    totalReviews: stats.totalReviews,
  });
}

/**
 * Mark review as helpful (increment helpful count)
 */
export const markReviewHelpful = async (reviewId: string): Promise<IReview> => {
  const review = await Review.findByIdAndUpdate(
    reviewId,
    { $inc: { helpfulCount: 1 } },
    { new: true }
  ).populate("userId", "firstname lastname");

  if (!review) {
    throw new Error("Review not found");
  }

  return review;
};
