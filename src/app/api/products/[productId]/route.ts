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

// Build consistent product response
function buildProductResponse(product: any): ProductResponse {
  return {
    id: product._id.toString(),
    sellerId: product.sellerId._id
      ? product.sellerId._id.toString()
      : product.sellerId.toString(),
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

    seller: product.sellerId?.shopName
      ? {
          id: product.sellerId._id.toString(),
          shopName: product.sellerId.shopName,
          userId: product.sellerId.userId?.toString(),
        }
      : undefined,
  };
}

/**
 * GET /api/products/[productId]
 * Public route
 */
async function handleGetProduct(
  req: NextRequest,
  context: { params: { productId: string } }
) {
  try {
    const { productId } = context.params;

    const product = await getProductById(productId);
    if (!product) return errorResponse("Product not found");

    return successResponse(buildProductResponse(product));
  } catch (error) {
    return errorResponse(error, "Failed to fetch product");
  }
}

/**
 * PUT /api/products/[productId]
 * Seller only
 */
async function handleUpdateProduct(
  req: NextRequest,
  context: { params: { productId: string } },
  user: DecodedToken
) {
  try {
    const { productId } = context.params;

    const body = await req.json();
    const validatedData = validateUpdateProduct(body);

    const product = await updateProduct(user.userId, productId, validatedData);

    return successResponse(
      buildProductResponse(product),
      "Product updated successfully"
    );
  } catch (error) {
    return errorResponse(error, "Failed to update product");
  }
}

/**
 * DELETE /api/products/[productId]
 * Seller only
 */
async function handleDeleteProduct(
  req: NextRequest,
  context: { params: { productId: string } },
  user: DecodedToken
) {
  try {
    const { productId } = context.params;

    await deleteProduct(user.userId, productId);

    return successResponse(null, "Product deleted successfully");
  } catch (error) {
    return errorResponse(error, "Failed to delete product");
  }
}

// Export routes
export const GET = withDB(handleGetProduct);

export const PUT = withDB(
  withRole<{ params: { productId: string } }>(["seller"], handleUpdateProduct)
);

export const DELETE = withDB(
  withRole<{ params: { productId: string } }>(["seller"], handleDeleteProduct)
);
