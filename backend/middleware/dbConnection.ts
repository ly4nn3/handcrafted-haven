import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@backend/utils/mongo";
import { errorResponse } from "@backend/utils/apiResponse";

/**
 * To wrap API routes with DB connection
 * Supports routes with or without context params
 */
export const withDB = <T extends any[] = []>(
  handler: (req: NextRequest, ...args: T) => Promise<NextResponse>
) => {
  return async (req: NextRequest, ...args: T): Promise<NextResponse> => {
    try {
      await connectToDB();
      return await handler(req, ...args);
    } catch (error) {
      return errorResponse(error, "Database connection failed");
    }
  };
};
