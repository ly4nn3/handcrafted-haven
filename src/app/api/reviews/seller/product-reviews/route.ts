import { NextRequest, NextResponse } from "next/server";
import { getSellerProductReviews } from "@backend/controllers/reviewController";
import { withRole } from "@backend/middleware/auth";

export const GET = withRole(["seller"], async (req: NextRequest, user) => {
  try {
    console.log("=== SELLER PRODUCT REVIEWS API ===");
    console.log("Seller ID:", user.userId);

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const result = await getSellerProductReviews(user.userId, page, limit);

    console.log("Reviews found:", result.reviews.length);
    console.log("Total reviews:", result.pagination.total);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("Error fetching seller product reviews:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
});
