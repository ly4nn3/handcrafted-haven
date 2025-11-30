import mongoose, { Document, Schema, Model } from "mongoose";
import { ISeller } from "./Seller";

export interface IProduct extends Document {
  sellerId: ISeller["_id"];
  name: string;
  description?: string;
  price: number;
  images: string[];
  categories: string[];
  createdAt: Date;
  updatedAt: Date;
}

const productSchema: Schema<IProduct> = new Schema(
  {
    sellerId: { type: Schema.Types.ObjectId, ref: "Seller", required: true },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    images: [{ type: String }],
    categories: [{ type: String }],
  },
  { timestamps: true }
);

const Product: Model<IProduct> = mongoose.model<IProduct>(
  "Product",
  productSchema
);

export default Product;
