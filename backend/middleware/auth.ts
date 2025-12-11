import { NextRequest, NextResponse } from "next/server";
import { verifyJWT, JWTError } from "@backend/utils/jwt";
import { errorResponse, ErrorType } from "@backend/utils/apiResponse";
import { DecodedToken } from "@backend/types/auth.types";

/**
 * Extract and verify JWT from request cookies
 */
export const getAuthUser = (req: NextRequest): DecodedToken => {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    throw new JWTError("No authentication token provided", "NO_TOKEN");
  }

  try {
    return verifyJWT(token);
  } catch (error) {
    throw error;
  }
};

/**
 * Authentication middleware - verifies JWT and attaches user to request
 */
export function withAuth<Context extends { params: Record<string, string> }>(
  handler: (
    req: NextRequest,
    context: Context,
    user: DecodedToken
  ) => Promise<NextResponse>
) {
  return async (req: NextRequest, context: Context): Promise<NextResponse> => {
    try {
      const user = getAuthUser(req);
      return await handler(req, context, user);
    } catch (error) {
      if (error instanceof JWTError) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: ErrorType.UNAUTHORIZED }
        );
      }
      return errorResponse(error, "Authentication failed");
    }
  };
}

/**
 * Role-based authorization middleware
 */
export function withRole<Context extends { params: Record<string, string> }>(
  allowedRoles: ("user" | "seller")[],
  handler: (
    req: NextRequest,
    context: Context,
    user: DecodedToken
  ) => Promise<NextResponse>
) {
  return withAuth<Context>(async (req, context, user) => {
    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json(
        {
          success: false,
          error: "Access denied: insufficient permissions",
        },
        { status: ErrorType.FORBIDDEN }
      );
    }

    return await handler(req, context, user);
  });
}
