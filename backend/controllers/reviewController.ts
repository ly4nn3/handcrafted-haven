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

/**
 * Get all reviews by a user
 */
export const getUserReviews = async (
  userId: string,
  page: number = 1,
  limit: number = 10
) => {
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    Review.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "firstname lastname")
      .populate("productId", "name images"),
    Review.countDocuments({ userId }),
  ]);

  // Transform to match expected response format
  const transformedReviews = reviews.map((review) => ({
    ...review.toObject(),
    user: review.userId,
    userId: (review.userId as any)._id.toString(),
    productId: (review.productId as any)._id.toString(),
    product: review.productId,
    id: review._id.toString(),
  }));

  return {
    reviews: transformedReviews,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get all reviews for a seller's products
 */
export const getSellerProductReviews = async (
  userId: string, // This is the User ID, not Seller ID
  page: number = 1,
  limit: number = 10
) => {
  console.log("=== GET SELLER PRODUCT REVIEWS CONTROLLER ===");
  console.log("User ID:", userId);

  const Product = (await import("@backend/models/Product")).default;
  const Seller = (await import("@backend/models/Seller")).default;

  const seller = await Seller.findOne({ userId });

  if (!seller) {
    console.log("No seller profile found for this user");
    return {
      reviews: [],
      pagination: {
        total: 0,
        page,
        limit,
        totalPages: 0,
      },
    };
  }

  console.log("Seller found:", seller._id.toString());

  const products = await Product.find({ sellerId: seller._id });
  console.log("Products found:", products.length);

  if (products.length > 0) {
    console.log("Sample product:", products[0].name);
  }

  const productIds = products.map((p) => p._id);
  console.log(
    "Product IDs:",
    productIds.map((id) => id.toString())
  );

  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    Review.find({ productId: { $in: productIds } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "firstname lastname")
      .populate("productId", "name images"),
    Review.countDocuments({ productId: { $in: productIds } }),
  ]);

  console.log("Reviews found:", reviews.length);
  console.log("Total review count:", total);

  const transformedReviews = reviews.map((review) => {
    const reviewObj = review.toObject() as any;

    return {
      ...reviewObj,
      id: reviewObj._id.toString(),
      _id: reviewObj._id.toString(),
      user: reviewObj.userId,
      userId:
        typeof reviewObj.userId === "object"
          ? reviewObj.userId._id.toString()
          : reviewObj.userId.toString(),
      product: reviewObj.productId,
      productId:
        typeof reviewObj.productId === "object"
          ? reviewObj.productId._id.toString()
          : reviewObj.productId.toString(),
    };
  });

  return {
    reviews: transformedReviews,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};
