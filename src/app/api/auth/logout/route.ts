import { NextResponse } from "next/server";
import { successResponse, clearAuthCookie } from "@backend/utils/apiResponse";

export async function POST(): Promise<NextResponse> {
  const response = successResponse(null, "Logged out successfully");
  clearAuthCookie(response);
  return response;
}
