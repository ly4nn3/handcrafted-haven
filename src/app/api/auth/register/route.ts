import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@backend/controllers/authController";
import { validateRegisterRequest } from "@backend/utils/validation";
import {
  successResponse,
  errorResponse,
  setAuthCookie,
} from "@backend/utils/apiResponse";
import { withDB } from "@backend/middleware/dbConnection";
import { AuthResponse } from "@backend/types/api.types";

async function handleRegister(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();

    // Validate request body
    const validatedData = validateRegisterRequest(body);

    // Register user
    const { user, seller, token } = await registerUser(validatedData);

    const responseData: AuthResponse = {
      user: {
        id: user._id.toString(),
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
      },
      seller: seller
        ? {
            id: seller._id.toString(),
            shopName: seller.shopName,
            description: seller.description || "",
          }
        : null,
    };

    const response = successResponse(responseData, "Registration successful");

    setAuthCookie(response, token);

    return response;
  } catch (error) {
    return errorResponse(error, "Registration failed");
  }
}

export const POST = withDB(handleRegister);
