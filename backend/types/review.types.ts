export interface CreateReviewDTO {
  productId: string;
  rating: number;
  comment: string;
}

export interface UpdateReviewDTO {
  rating?: number;
  comment?: string;
}

export interface ReviewResponse {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    firstname: string;
    lastname: string;
  };
  product?: {
    name: string;
    images: string[];
  };
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}
