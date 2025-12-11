import { NextRequest, NextResponse } from "next/server";
import { withDB } from "@backend/middleware/dbConnection";
import { getPublicSellerProfile } from "@backend/controllers/sellerController";
import { successResponse, errorResponse } from "@backend/utils/apiResponse";
import { SellerResponse } from "@backend/types/api.types";
import mongoose from "mongoose";

/**
 * GET /api/sellers/[sellerId] - Get public seller profile
 */
async function handleGetPublicSeller(
  req: NextRequest,
  context: { params: { sellerId: string } }
): Promise<NextResponse> {
  try {
    // Next.js 16+: context.params may be a Promise
    const params = await context.params;
    const sellerId = params.sellerId;

    // Validate sellerId is a proper ObjectId
    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return errorResponse(`Invalid sellerId: ${sellerId}`, "Seller not found");
    }

    const seller = await getPublicSellerProfile(sellerId);

    if (!seller) {
      return errorResponse("Seller not found", "Seller not found");
    }

    // Type guard for populated userId
    const populatedUser = seller.userId as any;

    const responseData: SellerResponse = {
      id: seller._id.toString(),
      shopName: seller.shopName,
      description: seller.description || "",
      bannerImage: seller.bannerImage,
      createdAt: seller.createdAt,
      updatedAt: seller.updatedAt,
      user: populatedUser?._id
        ? {
            id: populatedUser._id.toString(),
            firstname: populatedUser.firstname,
            lastname: populatedUser.lastname,
            email: populatedUser.email || "",
            role: populatedUser.role,
          }
        : undefined,
      products: Array.isArray(seller.products)
        ? seller.products.map((p) =>
            typeof p === "object" && p._id ? p._id.toString() : p.toString()
          )
        : [],
    };

    return successResponse(responseData);
  } catch (error) {
    return errorResponse(error, "Failed to fetch seller profile");
  }
}

export const GET = withDB(handleGetPublicSeller);
