import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@backend/utils/mongo";
import Seller from "@backend/models/Seller";
import { verifyJWT } from "@backend/utils/jwt";

export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const token = req.cookies.get("token")?.value;
    if (!token) throw new Error("Unauthorized");

    const decoded = verifyJWT(token);

    if (decoded.role !== "seller") {
      throw new Error("Access denied: not a seller");
    }

    const seller = await Seller.findOne({ userId: decoded.userId }).populate(
      "userId",
      "firstname lastname email role"
    );

    if (!seller) throw new Error("Seller profile not found");

    return NextResponse.json({
      success: true,
      seller: {
        id: seller._id,
        shopName: seller.shopName,
        description: seller.description,
        user: seller.userId,
        products: seller.products,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch seller" },
      { status: 401 }
    );
  }
}
