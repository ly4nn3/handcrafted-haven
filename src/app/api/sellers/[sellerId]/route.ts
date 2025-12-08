import { NextRequest, NextResponse } from "next/server";
import { withDB } from "@backend/middleware/dbConnection";
import { getPublicSellerProfile } from "@backend/controllers/sellerController";
import { successResponse, errorResponse } from "@backend/utils/apiResponse";
import { SellerResponse } from "@backend/types/api.types";

async function handleGetPublicSeller(
  req: NextRequest,
  context: { params: { sellerId: string } }
): Promise<NextResponse> {
  try {
    const { sellerId } = context.params;
    const seller = await getPublicSellerProfile(sellerId);

    // Type guard for populated userId
    const populatedUser = seller.userId as any;

    const responseData: SellerResponse = {
      id: seller._id.toString(),
      shopName: seller.shopName,
      description: seller.description || "",
      bannerImage: seller.bannerImage,
      user: populatedUser._id
        ? {
            id: populatedUser._id.toString(),
            firstname: populatedUser.firstname,
            lastname: populatedUser.lastname,
            email: "",
            role: populatedUser.role,
          }
        : undefined,
      products: seller.products.map((p) => p.toString()),
    };

    return successResponse(responseData);
  } catch (error) {
    return errorResponse(error, "Failed to fetch seller profile");
  }
}

export const GET = withDB(handleGetPublicSeller);
