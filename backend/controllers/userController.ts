import User from "../models/User";
import { hashPassword, comparePassword } from "../utils/hash";

export const registerUser = async (data: {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}) => {
  const { firstname, lastname, email, password } = data;

  const passwordHash = await hashPassword(password);

  const user = new User({
    firstname,
    lastname,
    email,
    passwordHash,
    role: "user",
  });

  await user.save();
  return user;
};

export const loginUser = async (data: { email: string; password: string }) => {
  const { email, password } = data;

  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) throw new Error("Invalid credentials");

  return user;
};
