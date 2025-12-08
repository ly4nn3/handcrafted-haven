import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@backend/middleware/auth";
import { withDB } from "@backend/middleware/dbConnection";
import { getMyProfile } from "@backend/controllers/userController";
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

export const GET = withDB(withAuth(handleGetMyProfile));
