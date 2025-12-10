import { ApiResponse } from "@/types/frontend.types";
import {
  ProductResponse,
  CreateProductDTO,
  UpdateProductDTO,
  PaginatedProducts,
} from "@backend/types/product.types";

const API_BASE = "/api/products";

export interface GetProductsParams {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sellerId?: string;
  sortBy?: "createdAt" | "price" | "averageRating" | "name";
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export class ProductService {
  /**
   * Get all products with filters
   */
  static async getProducts(
    params: GetProductsParams = {}
  ): Promise<ApiResponse<PaginatedProducts>> {
    try {
      const queryParams = new URLSearchParams();

      if (params.category) queryParams.set("category", params.category);
      if (params.minPrice !== undefined)
        queryParams.set("minPrice", params.minPrice.toString());
      if (params.maxPrice !== undefined)
        queryParams.set("maxPrice", params.maxPrice.toString());
      if (params.search) queryParams.set("search", params.search);
      if (params.sellerId) queryParams.set("sellerId", params.sellerId);
      if (params.sortBy) queryParams.set("sortBy", params.sortBy);
      if (params.order) queryParams.set("order", params.order);
      if (params.page) queryParams.set("page", params.page.toString());
      if (params.limit) queryParams.set("limit", params.limit.toString());

      const response = await fetch(`${API_BASE}?${queryParams.toString()}`, {
        method: "GET",
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: "Network error. Please try again.",
      };
    }
  }

  /**
   * Get single product by ID
   */
  static async getProductById(
    productId: string
  ): Promise<ApiResponse<ProductResponse>> {
    try {
      const response = await fetch(`${API_BASE}/${productId}`, {
        method: "GET",
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: "Network error. Please try again.",
      };
    }
  }

  /**
   * Get my products (seller only)
   */
  static async getMyProducts(
    includeInactive: boolean = false
  ): Promise<ApiResponse<ProductResponse[]>> {
    try {
      const queryParams = new URLSearchParams();
      if (includeInactive) queryParams.set("includeInactive", "true");

      const response = await fetch(
        `${API_BASE}/my-products?${queryParams.toString()}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: "Network error. Please try again.",
      };
    }
  }

  /**
   * Create new product (seller only)
   */
  static async createProduct(
    productData: CreateProductDTO
  ): Promise<ApiResponse<ProductResponse>> {
    try {
      const response = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(productData),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: "Network error. Please try again.",
      };
    }
  }

  /**
   * Update product (seller only)
   */
  static async updateProduct(
    productId: string,
    updates: UpdateProductDTO
  ): Promise<ApiResponse<ProductResponse>> {
    try {
      const response = await fetch(`${API_BASE}/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updates),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: "Network error. Please try again.",
      };
    }
  }

  /**
   * Delete product (seller only)
   */
  static async deleteProduct(productId: string): Promise<ApiResponse<null>> {
    try {
      const response = await fetch(`${API_BASE}/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: "Network error. Please try again.",
      };
    }
  }
}
