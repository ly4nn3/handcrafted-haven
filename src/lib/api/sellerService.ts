import { ApiResponse } from "@/types/frontend.types";
import { SellerResponse } from "@backend/types/api.types";

const API_BASE = "/api";

export class SellerService {
  /**
   * Get public seller profile by seller ID
   */
  static async getSellerById(
    sellerId: string
  ): Promise<ApiResponse<SellerResponse>> {
    try {
      const response = await fetch(`${API_BASE}/sellers/${sellerId}`, {
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
   * Get my seller profile (authenticated)
   */
  static async getMySellerProfile(): Promise<ApiResponse<SellerResponse>> {
    try {
      const response = await fetch(`${API_BASE}/sellers/me`, {
        method: "GET",
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
