import mongoose, { Document, Schema, Model } from "mongoose";
import { IUser } from "./User";
import { ISeller } from "./Seller";

export interface IProduct extends Document {
  sellerId: ISeller["_id"];
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
}

const productSchema: Schema<IProduct> = new Schema(
  {
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Jewelry",
        "Home Decor",
        "Clothing",
        "Accessories",
        "Art",
        "Pottery",
        "Woodwork",
        "Textiles",
        "Other",
      ],
      index: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    images: {
      type: [String],
      validate: {
        validator: function (images: string[]) {
          return images.length > 0 && images.length <= 10;
        },
        message: "Product must have between 1 and 10 images",
      },
    },
    tags: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for performance
productSchema.index({ sellerId: 1, createdAt: -1 });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ averageRating: -1 });
productSchema.index({ name: "text", description: "text" }); // Text search

// Virtual for seller details
productSchema.virtual("seller", {
  ref: "Seller",
  localField: "sellerId",
  foreignField: "_id",
  justOne: true,
});

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
