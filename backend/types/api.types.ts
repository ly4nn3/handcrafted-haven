export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: "user" | "seller";
  shopName?: string;
  description?: string;
}

export interface UserResponse {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: "user" | "seller";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SellerResponse {
  id: string;
  shopName: string;
  description: string;
  bannerImage?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  user?: UserResponse;
  products?: string[];
}

export interface AuthResponse {
  user: UserResponse;
  seller?: SellerResponse | null;
}
