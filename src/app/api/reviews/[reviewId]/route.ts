import { NextRequest, NextResponse } from "next/server";
import {
  updateReview,
  deleteReview,
  getReviewById,
} from "@backend/controllers/reviewController";
import { withAuth } from "@backend/middleware/auth";
import { UpdateReviewDTO } from "@backend/types/review.types";

/**
 * GET /api/reviews/[reviewId]
 * Get a single review by ID
 */
export const GET = async (
  req: NextRequest,
  context: { params: Promise<{ reviewId: string }> }
) => {
  try {
    const params = await context.params; // Await params
    const review = await getReviewById(params.reviewId);

    return NextResponse.json({
      success: true,
      data: review,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 404 }
    );
  }
};

/**
 * PUT /api/reviews/[reviewId]
 * Update a review (user must own the review)
 */
export const PUT = withAuth(
  async (
    req: NextRequest,
    user,
    context: { params: Promise<{ reviewId: string }> }
  ) => {
    try {
      const params = await context.params; // Await params
      const body: UpdateReviewDTO = await req.json();

      const updatedReview = await updateReview(
        user.userId,
        params.reviewId,
        body
      );

      return NextResponse.json({
        success: true,
        data: updatedReview,
      });
    } catch (error: any) {
      console.error("Update error:", error.message);
      const statusCode = error.message.includes("Unauthorized") ? 403 : 400;
      return NextResponse.json(
        { success: false, error: error.message },
        { status: statusCode }
      );
    }
  }
);

/**
 * DELETE /api/reviews/[reviewId]
 * Delete a review (user must own the review)
 */
export const DELETE = withAuth(
  async (
    req: NextRequest,
    user,
    context: { params: Promise<{ reviewId: string }> }
  ) => {
    try {
      const params = await context.params; // Await params

      await deleteReview(user.userId, params.reviewId);

      return NextResponse.json({
        success: true,
        data: null,
      });
    } catch (error: any) {
      console.error("Delete error:", error.message);
      const statusCode = error.message.includes("Unauthorized") ? 403 : 400;
      return NextResponse.json(
        { success: false, error: error.message },
        { status: statusCode }
      );
    }
  }
);
