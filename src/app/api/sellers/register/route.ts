import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@backend/utils/mongo";
import { registerSeller } from "@backend/controllers/sellerController";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const body = await req.json();
    const seller = await registerSeller(body);

    return NextResponse.json(
      { success: true, sellerId: seller._id },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
