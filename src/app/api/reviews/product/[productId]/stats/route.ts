import { NextRequest, NextResponse } from "next/server";
import { withDB } from "@backend/middleware/dbConnection";
import { getReviewStats } from "@backend/controllers/reviewController";
import { successResponse, errorResponse } from "@backend/utils/apiResponse";

/**
 * GET /api/reviews/product/[productId]/stats - Get review statistics
 */
async function handleGetReviewStats(
  req: NextRequest,
  context: { params: { productId: string } }
): Promise<NextResponse> {
  try {
    const { productId } = context.params;
    const stats = await getReviewStats(productId);

    return successResponse(stats);
  } catch (error) {
    return errorResponse(error, "Failed to fetch review statistics");
  }
}

export const GET = withDB(handleGetReviewStats);
