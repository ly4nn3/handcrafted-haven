import { NextRequest, NextResponse } from "next/server";
import { withDB } from "@backend/middleware/dbConnection";
import { withAuth } from "@backend/middleware/auth";
import { createReview } from "@backend/controllers/reviewController";
import { validateCreateReview } from "@backend/utils/reviewValidation";
import { successResponse, errorResponse } from "@backend/utils/apiResponse";
import { DecodedToken } from "@backend/types/auth.types";
import { ReviewResponse } from "@backend/types/review.types";

/**
 * POST /api/reviews - Create a new review (authenticated users only)
 */
async function handleCreateReview(
  req: NextRequest,
  context: { params: Promise<Record<string, string>> },
  user: DecodedToken
): Promise<NextResponse> {
  try {
    const params = await context.params;
    const body = await req.json();
    const validatedData = validateCreateReview(body);

    const review = await createReview(user.userId, validatedData);

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

    return successResponse(responseData, "Review created successfully");
  } catch (error) {
    return errorResponse(error, "Failed to create review");
  }
}

export const POST = withDB(withAuth(handleCreateReview));
