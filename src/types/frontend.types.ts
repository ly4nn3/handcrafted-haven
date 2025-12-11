export interface UserContextData {
  userId: string;
  firstname: string;
  lastname?: string;
  email?: string;
  role: "user" | "seller";
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: "user" | "seller";
  shopName?: string;
  description?: string;
}

export interface ApiError {
  success: false;
  error: string;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface UserProfile {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: "user" | "seller";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SellerProfile {
  id: string;
  shopName: string;
  description: string;
  bannerImage?: string;
  user?: UserProfile;
  products?: string[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
