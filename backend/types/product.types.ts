export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  tags?: string[];
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  stock?: number;
  images?: string[];
  tags?: string[];
  isActive?: boolean;
}

export interface ProductResponse {
  id: string;
  sellerId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  tags: string[];
  isActive: boolean;
  averageRating: number;
  totalReviews: number;
  createdAt: Date;
  updatedAt: Date;
  seller?: {
    id: string;
    shopName: string;
    userId?: string;
  };
}

export interface ProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sellerId?: string;
  isActive?: boolean;
  tags?: string[];
}

export interface ProductSort {
  field: "createdAt" | "price" | "averageRating" | "name";
  order: "asc" | "desc";
}

export interface PaginatedProducts {
  products: ProductResponse[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
