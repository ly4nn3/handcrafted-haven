import { NextRequest, NextResponse } from "next/server";
import { getUserReviews } from "@backend/controllers/reviewController";
import { withAuth } from "@backend/middleware/auth";
import { DecodedToken } from "@backend/types/auth.types";

export const GET = withAuth(
  async (
    req: NextRequest,
    context: { params: Promise<Record<string, string>> },
    user: DecodedToken
  ) => {
    try {
      const { searchParams } = new URL(req.url);
      const page = parseInt(searchParams.get("page") || "1");
      const limit = parseInt(searchParams.get("limit") || "10");

      const result = await getUserReviews(user.userId, page, limit);

      return NextResponse.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
  }
);
