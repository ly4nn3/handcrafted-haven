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
export const withAuth = <T extends any[] = []>(
  handler: (
    req: NextRequest,
    user: DecodedToken,
    ...args: T
  ) => Promise<NextResponse>
) => {
  return async (req: NextRequest, ...args: T): Promise<NextResponse> => {
    try {
      const user = getAuthUser(req);
      return await handler(req, user, ...args);
    } catch (error) {
      if (error instanceof JWTError) {
        return NextResponse.json(
          {
            success: false,
            error: error.message,
          },
          { status: ErrorType.UNAUTHORIZED }
        );
      }
      return errorResponse(error, "Authentication failed");
    }
  };
};

/**
 * Role-based authorization middleware
 */
export const withRole = <T extends any[] = []>(
  allowedRoles: ("user" | "seller")[],
  handler: (
    req: NextRequest,
    user: DecodedToken,
    ...args: T
  ) => Promise<NextResponse>
) => {
  return withAuth(async (req: NextRequest, user: DecodedToken, ...args: T) => {
    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json(
        {
          success: false,
          error: "Access denied: insufficient permissions",
        },
        { status: ErrorType.FORBIDDEN }
      );
    }

    return await handler(req, user, ...args);
  });
};
