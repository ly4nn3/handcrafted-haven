import { compare } from "bcryptjs";
import User, { IUser } from "../models/User";
import { hashPassword, comparePassword } from "../utils/hash";

export const registerUser = async (userData: {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}) => {
  const { firstname, lastname, email, password } = userData;

  const passwordHash = await hashPassword(password);

  const user: IUser = new User({
    firstname,
    lastname,
    email,
    passwordHash,
    role: "user",
  });

  await user.save();
  return user;
};

// Login user
export const loginUser = async (data: { email: string; password: string }) => {
  const { email, password } = data;

  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const isMatch = await comparePassword(password, user.passwordHash);
  if (!isMatch) throw new Error("Invalid credentials");

  return user;
};
