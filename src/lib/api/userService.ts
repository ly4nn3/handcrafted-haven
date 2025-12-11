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

  static async updateMyProfile(data: any): Promise<ApiResponse<UserResponse>> {
    try {
      const response = await fetch(`${API_BASE}/users/me`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        error: "Network error. Please try again.",
      };
    }
  }

  static async updateMySellerProfile(
    data: any
  ): Promise<ApiResponse<SellerResponse>> {
    try {
      const response = await fetch(`${API_BASE}/sellers/me`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        error: "Network error. Please try again.",
      };
    }
  }
}
