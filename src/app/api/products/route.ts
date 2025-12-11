import { NextRequest, NextResponse } from "next/server";
import { withDB } from "@backend/middleware/dbConnection";
import { withRole } from "@backend/middleware/auth";
import {
  createProduct,
  getProducts,
} from "@backend/controllers/productController";
import { validateCreateProduct } from "@backend/utils/productValidation";
import { successResponse, errorResponse } from "@backend/utils/apiResponse";
import { DecodedToken } from "@backend/types/auth.types";
import { ProductResponse } from "@backend/types/product.types";

/**
 * GET /api/products - Get all products (public)
 */
async function handleGetProducts(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);

    // Parse filters
    const filter: any = {};
    if (searchParams.get("category")) {
      filter.category = searchParams.get("category");
    }
    if (searchParams.get("minPrice")) {
      filter.minPrice = parseFloat(searchParams.get("minPrice")!);
    }
    if (searchParams.get("maxPrice")) {
      filter.maxPrice = parseFloat(searchParams.get("maxPrice")!);
    }
    if (searchParams.get("search")) {
      filter.search = searchParams.get("search");
    }
    if (searchParams.get("sellerId")) {
      filter.sellerId = searchParams.get("sellerId");
    }

    filter.isActive = true; // Only show active products publicly

    // Parse sorting
    const sortField = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("order") || "desc";

    // Parse pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const result = await getProducts(
      filter,
      { field: sortField as any, order: sortOrder as any },
      page,
      limit
    );

    const products: ProductResponse[] = result.products.map((product) => ({
      id: product._id.toString(),
      sellerId: (product.sellerId as any)._id
        ? (product.sellerId as any)._id.toString()
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
      seller: (product.sellerId as any).shopName
        ? {
            id: (product.sellerId as any)._id.toString(),
            shopName: (product.sellerId as any).shopName,
            userId: (product.sellerId as any).userId?.toString(),
          }
        : undefined,
    }));

    return successResponse({
      products,
      pagination: result.pagination,
    });
  } catch (error) {
    return errorResponse(error, "Failed to fetch products");
  }
}

/**
 * POST /api/products - Create product (sellers only)
 */
async function handleCreateProduct(
  req: NextRequest,
  context: { params: Record<string, string> }, // empty for routes with no params
  user: DecodedToken
): Promise<NextResponse> {
  try {
    const body = await req.json();
    const validatedData = validateCreateProduct(body);

    const product = await createProduct(user.userId, validatedData);

    const responseData: ProductResponse = {
      id: product._id.toString(),
      sellerId: (product.sellerId as any)._id
        ? (product.sellerId as any)._id.toString()
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
      seller: (product.sellerId as any).shopName
        ? {
            id: (product.sellerId as any)._id.toString(),
            shopName: (product.sellerId as any).shopName,
            userId: (product.sellerId as any).userId?.toString(),
          }
        : undefined,
    };

    return successResponse(responseData, "Product created successfully");
  } catch (error) {
    return errorResponse(error, "Failed to create product");
  }
}

export const GET = withDB(handleGetProducts);
export const POST = withDB(
  withRole<{ params: Record<string, string> }>(["seller"], handleCreateProduct)
);
