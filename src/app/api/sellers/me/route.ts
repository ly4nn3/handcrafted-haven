import { NextRequest, NextResponse } from "next/server";
import { withRole } from "@backend/middleware/auth";
import { withDB } from "@backend/middleware/dbConnection";
import { getMySellerProfile } from "@backend/controllers/sellerController";
import { successResponse, errorResponse } from "@backend/utils/apiResponse";
import { DecodedToken } from "@backend/types/auth.types";
import { SellerResponse, UserResponse } from "@backend/types/api.types";

async function handleGetMySellerProfile(
  req: NextRequest,
  user: DecodedToken
): Promise<NextResponse> {
  try {
    const seller = await getMySellerProfile(user.userId);

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
            email: populatedUser.email,
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

export const GET = withDB(withRole(["seller"], handleGetMySellerProfile));
