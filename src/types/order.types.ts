export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderResponse {
  id: string;
  userId: string;
  sellerId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentStatus: string;
  trackingNumber?: string;
  notes?: string;
  statusHistory: {
    status: OrderStatus;
    timestamp: Date;
    note?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
  seller?: {
    shopName: string;
  };
  user?: {
    firstname: string;
    lastname: string;
    email: string;
  };
}

export interface CreateOrderDTO {
  items: {
    productId: string;
    quantity: number;
  }[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  notes?: string;
}

export interface UpdateOrderStatusDTO {
  status: OrderStatus;
  trackingNumber?: string;
  note?: string;
}

export interface PaginatedOrders {
  orders: OrderResponse[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  ordersByStatus: {
    [key in OrderStatus]: number;
  };
}
