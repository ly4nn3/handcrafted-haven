import { NextRequest, NextResponse } from "next/server";
import { withDB } from "@backend/middleware/dbConnection";
import { withRole } from "@backend/middleware/auth";
import {
  getProductById,
  updateProduct,
  deleteProduct,
} from "@backend/controllers/productController";
import { validateUpdateProduct } from "@backend/utils/productValidation";
import { successResponse, errorResponse } from "@backend/utils/apiResponse";
import { DecodedToken } from "@backend/types/auth.types";
import { ProductResponse } from "@backend/types/product.types";

/**
 * GET /api/products/[productId] - Get single product (public)
 */
async function handleGetProduct(
  req: NextRequest,
  context: { params: { productId: string } }
): Promise<NextResponse> {
  try {
    const { productId } = context.params;
    const product = await getProductById(productId);

    const responseData: ProductResponse = {
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
      seller: (product.sellerId as any).shopName
        ? {
            id: (product.sellerId as any)._id.toString(),
            shopName: (product.sellerId as any).shopName,
            userId: (product.sellerId as any).userId?.toString(),
          }
        : undefined,
    };

    return successResponse(responseData);
  } catch (error) {
    return errorResponse(error, "Failed to fetch product");
  }
}

/**
 * PUT /api/products/[productId] - Update product (seller only)
 */
async function handleUpdateProduct(
  req: NextRequest,
  user: DecodedToken,
  context: { params: { productId: string } }
): Promise<NextResponse> {
  try {
    const { productId } = context.params;
    const body = await req.json();
    const validatedData = validateUpdateProduct(body);

    const product = await updateProduct(user.userId, productId, validatedData);

    const responseData: ProductResponse = {
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
    };

    return successResponse(responseData, "Product updated successfully");
  } catch (error) {
    return errorResponse(error, "Failed to update product");
  }
}

/**
 * DELETE /api/products/[productId] - Delete product (seller only)
 */
async function handleDeleteProduct(
  req: NextRequest,
  user: DecodedToken,
  context: { params: { productId: string } }
): Promise<NextResponse> {
  try {
    const { productId } = context.params;
    await deleteProduct(user.userId, productId);

    return successResponse(null, "Product deleted successfully");
  } catch (error) {
    return errorResponse(error, "Failed to delete product");
  }
}

export const GET = withDB(handleGetProduct);
export const PUT = withDB(
  withRole<[{ params: { productId: string } }]>(["seller"], handleUpdateProduct)
);
export const DELETE = withDB(
  withRole<[{ params: { productId: string } }]>(["seller"], handleDeleteProduct)
);
