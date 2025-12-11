import { ApiResponse } from "@/types/frontend.types";
import { CreateOrderDTO } from "@/types/order.types";

const API_BASE = "/api/orders";

export class OrderService {
  /**
   * Create new orders
   */
  static async createOrders(
    orderData: CreateOrderDTO
  ): Promise<ApiResponse<any>> {
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
   * Get user's orders
   */
  static async getMyOrders(
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(
        `${API_BASE}/my-orders?page=${page}&limit=${limit}`,
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
  static async getOrderById(orderId: string | null): Promise<ApiResponse<any>> {
    if (!orderId) {
      return {
        success: false,
        error: "Invalid order ID",
      };
    }

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
   * Update order status
   */
  static async updateOrderStatus(
    orderId: string,
    data: {
      status: string;
      trackingNumber?: string;
      note?: string;
    }
  ): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE}/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const resData = await response.json();
      return resData;
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
  ): Promise<ApiResponse<any>> {
    try {
      const query = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (status) query.append("status", status);

      const response = await fetch(`${API_BASE}/seller?${query.toString()}`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return { success: false, error: "Network error. Please try again." };
    }
  }

  /**
   * Get seller stats
   */
  static async getSellerStats(): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE}/seller/stats`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return { success: false, error: "Network error. Please try again." };
    }
  }

  /**
   * Cancel an order
   */
  static async cancelOrder(
    orderId: string,
    reason?: string
  ): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE}/${orderId}/cancel`, {
        method: "PATCH",
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
}
