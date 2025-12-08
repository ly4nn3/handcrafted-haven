import mongoose, { Document, Schema, Model } from "mongoose";

export interface IUser extends Document {
  firstname: string;
  lastname: string;
  email: string;
  passwordHash: string;
  role: "user" | "seller";
  createdAt: Date;
  updatedAt: Date;
  fullName: string;
}

const userSchema: Schema<IUser> = new Schema(
  {
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["user", "seller"], default: "user" },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual("fullName").get(function (this: IUser) {
  return `${this.firstname} ${this.lastname}`;
});

userSchema.index({ email: 1 });

const User: Model<IUser> =
  mongoose.models.User || mongoose.model("User", userSchema);

export default User;
