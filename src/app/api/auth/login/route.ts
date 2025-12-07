import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@backend/utils/mongo";
import { loginUser } from "@backend/controllers/authController";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const body = await req.json();
    const { user, token } = await loginUser(body);

    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Login failed" },
      { status: 400 }
    );
  }
}
