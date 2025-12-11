import { NextRequest, NextResponse } from "next/server";
import { createOrders } from "@backend/controllers/orderController";
import { withAuth } from "@backend/middleware/auth";
import { CreateOrderDTO } from "@/types/order.types";

export const POST = withAuth(async (req: NextRequest, context, user) => {
  try {
    const body: CreateOrderDTO = await req.json();

    console.log("Creating orders for user:", user.userId);

    const orders = await createOrders(user.userId, body);

    console.log("Orders created:", orders.length);

    // Transform orders to plain objects with id field
    const transformedOrders = orders.map((order) => {
      const orderObj = order.toObject();
      return {
        ...orderObj,
        id: orderObj._id.toString(),
        _id: orderObj._id.toString(),
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        orders: transformedOrders,
        message: `Successfully created ${orders.length} order(s)`,
      },
    });
  } catch (error: any) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
});
