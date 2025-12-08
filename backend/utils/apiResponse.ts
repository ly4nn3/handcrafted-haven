import { NextResponse } from "next/server";
import { ApiResponse } from "@backend/types/api.types";
import { ValidationError } from "./validation";
import { JWTError } from "./jwt";
import { config } from "@backend/config/env.config";

/**
 * Standard error types with HTTP status codes
 */
export enum ErrorType {
  VALIDATION = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  SERVER_ERROR = 500,
}

/**
 * Create a success response
 */
export const successResponse = <T>(
  data: T,
  message?: string
): NextResponse<ApiResponse<T>> => {
  return NextResponse.json({
    success: true,
    data,
    message,
  });
};

/**
 * Create an error response with appropriate status code
 */
export const errorResponse = (
  error: unknown,
  defaultMessage: string = "An error occurred"
): NextResponse<ApiResponse> => {
  // Log error in development
  if (config.NODE_ENV === "development") {
    console.error("API Error:", error);
  }

  // Handle known error types
  if (error instanceof ValidationError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: ErrorType.VALIDATION }
    );
  }

  if (error instanceof JWTError) {
    const statusCode =
      error.code === "TOKEN_EXPIRED" || error.code === "NO_TOKEN"
        ? ErrorType.UNAUTHORIZED
        : ErrorType.UNAUTHORIZED;

    return NextResponse.json(
      {
        success: false,
        error:
          error.code === "TOKEN_EXPIRED"
            ? "Session expired"
            : "Invalid session",
      },
      { status: statusCode }
    );
  }

  // Handle MongoDB duplicate key error
  if (error instanceof Error && error.message.includes("duplicate key")) {
    return NextResponse.json(
      {
        success: false,
        error: "Email already exists",
      },
      { status: ErrorType.CONFLICT }
    );
  }

  // Handle "not found" errors
  if (
    error instanceof Error &&
    error.message.toLowerCase().includes("not found")
  ) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: ErrorType.NOT_FOUND }
    );
  }

  // Handle generic errors
  if (error instanceof Error) {
    const message =
      config.NODE_ENV === "development" ? error.message : defaultMessage;

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: ErrorType.SERVER_ERROR }
    );
  }

  // Unknown error
  return NextResponse.json(
    {
      success: false,
      error: defaultMessage,
    },
    { status: ErrorType.SERVER_ERROR }
  );
};

/**
 * Set authentication cookie
 */
export const setAuthCookie = (response: NextResponse, token: string): void => {
  response.cookies.set({
    name: "token",
    value: token,
    httpOnly: true,
    path: "/",
    maxAge: config.COOKIE_MAX_AGE,
    sameSite: "strict",
    secure: config.NODE_ENV === "production",
  });
};

/**
 * Clear authentication cookie
 */
export const clearAuthCookie = (response: NextResponse): void => {
  response.cookies.set({
    name: "token",
    value: "",
    path: "/",
    maxAge: 0,
  });
};
