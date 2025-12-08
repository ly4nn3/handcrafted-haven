import { ApiResponse } from "@/types/frontend.types";
import { UserResponse, SellerResponse } from "@backend/types/api.types";

const API_BASE = "/api";

export class UserService {
  /**
   * Get current user profile
   */
  static async getMyProfile(): Promise<ApiResponse<UserResponse>> {
    try {
      const response = await fetch(`${API_BASE}/users/me`, {
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

  /**
   * Get current seller profile
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
