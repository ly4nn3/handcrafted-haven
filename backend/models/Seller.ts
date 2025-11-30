import mongoose, { Document, Schema, Model } from "mongoose";
import { IUser } from "./User";

export interface ISeller extends Document {
  userId: IUser["_id"];
  shopName: string;
  description?: string;
  bannerImage?: string;
  products: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const sellerSchema: Schema<ISeller> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    shopName: { type: String, required: true },
    description: { type: String },
    bannerImage: { type: String },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

const Seller: Model<ISeller> = mongoose.model<ISeller>("Seller", sellerSchema);

export default Seller;
