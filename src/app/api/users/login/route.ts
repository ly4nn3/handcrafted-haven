import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@backend/utils/mongo";
import { loginUser } from "@backend/controllers/userController";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const data = await req.json();
    const user = await loginUser(data);

    return NextResponse.json(
      {
        success: true,
        role: user.role,
        userId: user._id,
        firstname: user.firstname,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
