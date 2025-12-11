import { NextRequest, NextResponse } from "next/server";
import { getOrderById } from "@backend/controllers/orderController";
import { withAuth } from "@backend/middleware/auth";

export const GET = withAuth(
  async (
    req: NextRequest,
    context: { params: Promise<{ orderId: string }> }, // Promise required in Next.js 16
    user
  ) => {
    try {
      const { orderId } = await context.params; // Must await

      const order = await getOrderById(orderId, user.userId);

      return NextResponse.json({
        success: true,
        data: order,
      });
    } catch (error: any) {
      const status = error.message === "Unauthorized" ? 403 : 404;
      return NextResponse.json(
        { success: false, error: error.message },
        { status }
      );
    }
  }
);
