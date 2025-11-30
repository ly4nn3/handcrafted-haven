import mongoose, { Document, Schema, Model } from "mongoose";

export interface IUser extends Document {
  firstname: string;
  lastname: string;
  email: string;
  passwordHash: string;
  role: "user" | "seller";
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema<IUser> = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "seller"], default: "user" },
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
