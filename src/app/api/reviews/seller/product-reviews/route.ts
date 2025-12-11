import { NextRequest, NextResponse } from "next/server";
import { getSellerProductReviews } from "@backend/controllers/reviewController";
import { withRole } from "@backend/middleware/auth";
import { DecodedToken } from "@backend/types/auth.types";

export const GET = withRole(
  ["seller"],
  async (
    req: NextRequest,
    context: { params: Record<string, string> },
    user: DecodedToken
  ) => {
    try {
      const { searchParams } = new URL(req.url);
      const page = parseInt(searchParams.get("page") || "1");
      const limit = parseInt(searchParams.get("limit") || "10");

      const result = await getSellerProductReviews(user.userId, page, limit);

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
  }
);
