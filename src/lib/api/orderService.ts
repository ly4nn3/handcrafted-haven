import { ApiResponse } from "@/types/frontend.types";
import {
  OrderResponse,
  CreateOrderDTO,
  UpdateOrderStatusDTO,
  PaginatedOrders,
  OrderStats,
} from "@/types/order.types";

const API_BASE = "/api/orders";

export class OrderService {
  /**
   * Create a new order (checkout)
   */
  static async createOrder(
    orderData: CreateOrderDTO
  ): Promise<ApiResponse<OrderResponse>> {
    try {
      const response = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(orderData),
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
   * Get user's orders (buyer view)
   */
  static async getUserOrders(
    page: number = 1,
    limit: number = 10,
    status?: string
  ): Promise<ApiResponse<PaginatedOrders>> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.set("page", page.toString());
      queryParams.set("limit", limit.toString());
      if (status) queryParams.set("status", status);

      const response = await fetch(
        `${API_BASE}/user?${queryParams.toString()}`,
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
   * Get seller's orders
   */
  static async getSellerOrders(
    page: number = 1,
    limit: number = 10,
    status?: string
  ): Promise<ApiResponse<PaginatedOrders>> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.set("page", page.toString());
      queryParams.set("limit", limit.toString());
      if (status) queryParams.set("status", status);

      const response = await fetch(
        `${API_BASE}/seller?${queryParams.toString()}`,
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
   * Get order by ID
   */
  static async getOrderById(
    orderId: string
  ): Promise<ApiResponse<OrderResponse>> {
    try {
      const response = await fetch(`${API_BASE}/${orderId}`, {
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
   * Update order status (seller only)
   */
  static async updateOrderStatus(
    orderId: string,
    statusData: UpdateOrderStatusDTO
  ): Promise<ApiResponse<OrderResponse>> {
    try {
      const response = await fetch(`${API_BASE}/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(statusData),
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
   * Cancel order (buyer)
   */
  static async cancelOrder(
    orderId: string,
    reason?: string
  ): Promise<ApiResponse<OrderResponse>> {
    try {
      const response = await fetch(`${API_BASE}/${orderId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ reason }),
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
   * Get seller order statistics
   */
  static async getSellerStats(): Promise<ApiResponse<OrderStats>> {
    try {
      const response = await fetch(`${API_BASE}/seller/stats`, {
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
