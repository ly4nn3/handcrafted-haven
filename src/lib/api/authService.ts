import { ApiResponse } from "@/types/frontend.types";
import { AuthResponse } from "@backend/types/api.types";

const API_BASE = "/api/auth";

export class AuthService {
  /**
   * Login user
   */
  static async login(
    email: string,
    password: string
  ): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
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
   * Register new user
   */
  static async register(formData: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    role: "user" | "seller";
    shopName?: string;
    description?: string;
  }): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
   * Logout user
   */
  static async logout(): Promise<ApiResponse<null>> {
    try {
      const response = await fetch(`${API_BASE}/logout`, {
        method: "POST",
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
