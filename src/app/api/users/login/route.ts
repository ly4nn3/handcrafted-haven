import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@backend/utils/mongo";
import { loginUser } from "@backend/controllers/userController";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const body = await req.json();
    const user = await loginUser(body);

    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
