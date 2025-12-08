import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@backend/controllers/authController";
import { validateLoginRequest } from "@backend/utils/validation";
import {
  successResponse,
  errorResponse,
  setAuthCookie,
} from "@backend/utils/apiResponse";
import { withDB } from "@backend/middleware/dbConnection";
import { AuthResponse } from "@backend/types/api.types";

async function handleLogin(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();

    // Validate request body
    const validatedData = validateLoginRequest(body);

    // Authenticate user
    const { user, token } = await loginUser(validatedData);

    const responseData: AuthResponse = {
      user: {
        id: user._id.toString(),
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
      },
    };

    const response = successResponse(responseData, "Login successful");

    setAuthCookie(response, token);

    return response;
  } catch (error) {
    return errorResponse(error, "Login failed");
  }
}

export const POST = withDB(handleLogin);
