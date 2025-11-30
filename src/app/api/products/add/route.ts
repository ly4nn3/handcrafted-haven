import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@backend/utils/mongo";
import { addProduct } from "@backend/controllers/productController";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const body = await req.json();
    const product = await addProduct(body);

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
