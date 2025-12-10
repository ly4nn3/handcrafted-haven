import mongoose, { Document, Schema, Model } from "mongoose";
import { IUser } from "./User";
import { IProduct } from "./Product";

export interface IReview extends Document {
  productId: IProduct["_id"];
  userId: IUser["_id"];
  rating: number;
  comment: string;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema: Schema<IReview> = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
    helpfulCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure one review per user per product
reviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

// Index for fetching reviews by product
reviewSchema.index({ productId: 1, createdAt: -1 });

const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model("Review", reviewSchema);

export default Review;
