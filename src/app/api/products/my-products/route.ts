import { NextRequest, NextResponse } from "next/server";
import { withDB } from "@backend/middleware/dbConnection";
import { withRole } from "@backend/middleware/auth";
import { getProductsBySeller } from "@backend/controllers/productController";
import { successResponse, errorResponse } from "@backend/utils/apiResponse";
import { DecodedToken } from "@backend/types/auth.types";
import { ProductResponse } from "@backend/types/product.types";

/**
 * GET /api/products/my-products - Get logged-in seller's products
 */
async function handleGetMyProducts(
  req: NextRequest,
  context: { params: Promise<Record<string, string>> },
  user: DecodedToken
): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const includeInactive = searchParams.get("includeInactive") === "true";

    const products = await getProductsBySeller(user.userId, includeInactive);

    const responseData: ProductResponse[] = products.map((product) => ({
      id: product._id.toString(),
      sellerId: product.sellerId.toString(),
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      images: product.images,
      tags: product.tags,
      isActive: product.isActive,
      averageRating: product.averageRating,
      totalReviews: product.totalReviews,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }));

    return successResponse(responseData);
  } catch (error) {
    return errorResponse(error, "Failed to fetch your products");
  }
}

export const GET = withDB(
  withRole<{ params: Promise<Record<string, string>> }>(
    ["seller"],
    handleGetMyProducts
  )
);
