import { NextRequest, NextResponse } from "next/server";
import { withDB } from "@backend/middleware/dbConnection";
import { getProductReviews } from "@backend/controllers/reviewController";
import { successResponse, errorResponse } from "@backend/utils/apiResponse";
import { ReviewResponse } from "@backend/types/review.types";

/**
 * GET /api/reviews/product/[productId] - Get all reviews for a product
 */
async function handleGetProductReviews(
  req: NextRequest,
  context: { params: Promise<{ productId: string }> } // Changed to Promise
): Promise<NextResponse> {
  try {
    const { productId } = await context.params; // Added await
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const result = await getProductReviews(productId, page, limit);

    const reviews: ReviewResponse[] = result.reviews.map((review) => ({
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
    }));

    return successResponse({
      reviews,
      pagination: result.pagination,
    });
  } catch (error) {
    return errorResponse(error, "Failed to fetch reviews");
  }
}

export const GET = withDB(handleGetProductReviews);
