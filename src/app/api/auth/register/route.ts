import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@backend/utils/mongo";
import { registerUser } from "@backend/controllers/authController";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const body = await req.json();
    const { user, seller, token } = await registerUser(body);

    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
      },
      seller: seller
        ? {
            id: seller._id,
            shopName: seller.shopName,
            description: seller.description,
          }
        : null,
    });

    // Set JWT cookie
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Registration failed" },
      { status: 400 }
    );
  }
}
