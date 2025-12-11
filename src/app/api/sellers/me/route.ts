import { NextRequest, NextResponse } from "next/server";
import { withRole } from "@backend/middleware/auth";
import { withDB } from "@backend/middleware/dbConnection";
import {
  getMySellerProfile,
  updateMySellerProfile,
} from "@backend/controllers/sellerController";
import { successResponse, errorResponse } from "@backend/utils/apiResponse";
import { DecodedToken } from "@backend/types/auth.types";
import { SellerResponse } from "@backend/types/api.types";

async function handleGetMySellerProfile(
  req: NextRequest,
  context: { params: Record<string, string> },
  user: DecodedToken
): Promise<NextResponse> {
  try {
    const seller = await getMySellerProfile(user.userId);

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

async function handleUpdateMySellerProfile(
  req: NextRequest,
  context: { params: Record<string, string> },
  user: DecodedToken
): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { shopName, description, firstname, lastname } = body;

    const updatedSeller = await updateMySellerProfile(user.userId, {
      shopName,
      description,
      firstname,
      lastname,
    });

    const populatedUser = updatedSeller.userId as any;

    const responseData: SellerResponse = {
      id: updatedSeller._id.toString(),
      shopName: updatedSeller.shopName,
      description: updatedSeller.description || "",
      bannerImage: updatedSeller.bannerImage,
      user: populatedUser._id
        ? {
            id: populatedUser._id.toString(),
            firstname: populatedUser.firstname,
            lastname: populatedUser.lastname,
            email: populatedUser.email,
            role: populatedUser.role,
          }
        : undefined,
      products: updatedSeller.products.map((p) => p.toString()),
    };

    return successResponse(responseData);
  } catch (error) {
    return errorResponse(error, "Failed to update seller profile");
  }
}

export const GET = withDB(withRole(["seller"], handleGetMySellerProfile));
export const PATCH = withDB(withRole(["seller"], handleUpdateMySellerProfile));
