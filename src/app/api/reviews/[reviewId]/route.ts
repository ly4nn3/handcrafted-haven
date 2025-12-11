import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@backend/middleware/auth";
import {
  getReviewById,
  updateReview,
  deleteReview,
} from "@backend/controllers/reviewController";
import { UpdateReviewDTO } from "@backend/types/review.types";

/**
 * GET /api/reviews/[reviewId] (public)
 */
export const GET = async (
  req: NextRequest,
  context: { params: { reviewId: string } }
) => {
  try {
    const { reviewId } = context.params;
    const review = await getReviewById(reviewId);

    return NextResponse.json({ success: true, data: review });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 404 }
    );
  }
};

/**
 * PUT /api/reviews/[reviewId] (authenticated)
 */
export const PUT = withAuth<{ params: { reviewId: string } }>(
  async (req, context, user) => {
    const { reviewId } = context.params;
    const body: UpdateReviewDTO = await req.json();
    const updatedReview = await updateReview(user.userId, reviewId, body);

    return NextResponse.json({ success: true, data: updatedReview });
  }
);

/**
 * DELETE /api/reviews/[reviewId] (authenticated)
 */
export const DELETE = withAuth<{ params: { reviewId: string } }>(
  async (req, context, user) => {
    const { reviewId } = context.params;
    await deleteReview(user.userId, reviewId);
    return NextResponse.json({ success: true, data: null });
  }
);
