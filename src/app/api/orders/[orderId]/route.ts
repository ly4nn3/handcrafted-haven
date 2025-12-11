import { NextRequest, NextResponse } from "next/server";
import { getOrderById } from "@backend/controllers/orderController";
import { withAuth } from "@backend/middleware/auth";
import { DecodedToken } from "@backend/types/auth.types";

async function handleGetOrder(
  req: NextRequest,
  user: DecodedToken,
  context: { params: { orderId: string } }
): Promise<NextResponse> {
  const { orderId } = context.params;

  try {
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

export const GET = withAuth<{ params: { orderId: string } }>(handleGetOrder);
