import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@backend/middleware/auth";
import { withDB } from "@backend/middleware/dbConnection";
import {
  getMyProfile,
  updateMyProfile,
} from "@backend/controllers/userController";
import { successResponse, errorResponse } from "@backend/utils/apiResponse";
import { DecodedToken } from "@backend/types/auth.types";
import { UserResponse } from "@backend/types/api.types";

async function handleGetMyProfile(
  req: NextRequest,
  user: DecodedToken
): Promise<NextResponse> {
  try {
    const userProfile = await getMyProfile(user.userId);

    const responseData: UserResponse = {
      id: userProfile._id.toString(),
      firstname: userProfile.firstname,
      lastname: userProfile.lastname,
      email: userProfile.email,
      role: userProfile.role,
      createdAt: userProfile.createdAt,
      updatedAt: userProfile.updatedAt,
    };

    return successResponse(responseData);
  } catch (error) {
    return errorResponse(error, "Failed to fetch user profile");
  }
}

async function handleUpdateMyProfile(
  req: NextRequest,
  user: DecodedToken
): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { firstname, lastname } = body;

    // Validate input
    if (!firstname || !lastname) {
      return NextResponse.json(
        {
          success: false,
          error: "First name and last name are required",
        },
        { status: 400 }
      );
    }

    const updatedUser = await updateMyProfile(user.userId, {
      firstname,
      lastname,
    });

    const responseData: UserResponse = {
      id: updatedUser._id.toString(),
      firstname: updatedUser.firstname,
      lastname: updatedUser.lastname,
      email: updatedUser.email,
      role: updatedUser.role,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };

    return successResponse(responseData);
  } catch (error) {
    return errorResponse(error, "Failed to update user profile");
  }
}

export const GET = withDB(withAuth(handleGetMyProfile));
export const PATCH = withDB(withAuth(handleUpdateMyProfile));
