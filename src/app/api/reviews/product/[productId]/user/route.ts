import { NextRequest, NextResponse } from "next/server";
import { withDB } from "@backend/middleware/dbConnection";
import { withAuth } from "@backend/middleware/auth";
import { getUserProductReview } from "@backend/controllers/reviewController";
import { successResponse, errorResponse } from "@backend/utils/apiResponse";
import { DecodedToken } from "@backend/types/auth.types";
import { ReviewResponse } from "@backend/types/review.types";

/**
 * GET /api/reviews/product/[productId]/user
 * Get current user's review for a product
 */
async function handleGetUserReview(
  req: NextRequest,
  user: DecodedToken,
  context: { params: { productId: string } }
): Promise<NextResponse> {
  const { productId } = context.params;

  try {
    const review = await getUserProductReview(user.userId, productId);

    if (!review) return successResponse(null);

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
    return errorResponse(error, "Failed to fetch user review");
  }
}

// Vercel-safe export: explicit generic ensures params typing
export const GET = withDB(
  withAuth<{ params: { productId: string } }>(handleGetUserReview)
);
