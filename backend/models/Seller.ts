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
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    shopName: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    bannerImage: { type: String, default: "" },
    products: [{ type: Schema.Types.ObjectId, ref: "Product", default: [] }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

sellerSchema.index({ userId: 1 });
sellerSchema.index({ shopName: 1 });

const Seller: Model<ISeller> =
  mongoose.models.Seller || mongoose.model("Seller", sellerSchema);

export default Seller;
