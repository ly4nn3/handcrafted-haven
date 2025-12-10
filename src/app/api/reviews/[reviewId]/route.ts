import { NextRequest, NextResponse } from "next/server";
import { withDB } from "@backend/middleware/dbConnection";
import { withAuth } from "@backend/middleware/auth";
import {
  getReviewById,
  updateReview,
  deleteReview,
} from "@backend/controllers/reviewController";
import { validateUpdateReview } from "@backend/utils/reviewValidation";
import { successResponse, errorResponse } from "@backend/utils/apiResponse";
import { DecodedToken } from "@backend/types/auth.types";
import { ReviewResponse } from "@backend/types/review.types";

/**
 * GET /api/reviews/[reviewId] - Get single review
 */
async function handleGetReview(
  req: NextRequest,
  context: { params: { reviewId: string } }
): Promise<NextResponse> {
  try {
    const { reviewId } = context.params;
    const review = await getReviewById(reviewId);

    const responseData: ReviewResponse = {
      id: review._id.toString(),
      productId: review.productId.toString(),
      userId: review.userId.toString(),
      rating: review.rating,
      comment: review.comment,
      isVerifiedPurchase: review.isVerifiedPurchase,
      helpfulCount: review.helpfulCount,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      user: (review.userId as any).firstname
        ? {
            id: (review.userId as any)._id.toString(),
            firstname: (review.userId as any).firstname,
            lastname: (review.userId as any).lastname,
          }
        : undefined,
    };

    return successResponse(responseData);
  } catch (error) {
    return errorResponse(error, "Failed to fetch review");
  }
}

/**
 * PUT /api/reviews/[reviewId] - Update review (must own)
 */
async function handleUpdateReview(
  req: NextRequest,
  user: DecodedToken,
  context: { params: { reviewId: string } }
): Promise<NextResponse> {
  try {
    const { reviewId } = context.params;
    const body = await req.json();
    const validatedData = validateUpdateReview(body);

    const review = await updateReview(user.userId, reviewId, validatedData);

    const responseData: ReviewResponse = {
      id: review._id.toString(),
      productId: review.productId.toString(),
      userId: review.userId.toString(),
      rating: review.rating,
      comment: review.comment,
      isVerifiedPurchase: review.isVerifiedPurchase,
      helpfulCount: review.helpfulCount,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      user: (review.userId as any).firstname
        ? {
            id: (review.userId as any)._id.toString(),
            firstname: (review.userId as any).firstname,
            lastname: (review.userId as any).lastname,
          }
        : undefined,
    };

    return successResponse(responseData, "Review updated successfully");
  } catch (error) {
    return errorResponse(error, "Failed to update review");
  }
}

/**
 * DELETE /api/reviews/[reviewId] - Delete review (must own)
 */
async function handleDeleteReview(
  req: NextRequest,
  user: DecodedToken,
  context: { params: { reviewId: string } }
): Promise<NextResponse> {
  try {
    const { reviewId } = context.params;
    await deleteReview(user.userId, reviewId);

    return successResponse(null, "Review deleted successfully");
  } catch (error) {
    return errorResponse(error, "Failed to delete review");
  }
}

export const GET = withDB(handleGetReview);
export const PUT = withDB(
  withAuth<[{ params: { reviewId: string } }]>(handleUpdateReview)
);
export const DELETE = withDB(
  withAuth<[{ params: { reviewId: string } }]>(handleDeleteReview)
);
