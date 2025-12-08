import User from "@backend/models/User";
import Seller from "@backend/models/Seller";
import { hashPassword, comparePassword } from "@backend/utils/hash";
import { signJWT } from "@backend/utils/jwt";

// ----------------------
// DTOs
// ----------------------
interface RegisterDTO {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: "user" | "seller";
  shopName?: string;
  description?: string;
}

interface LoginDTO {
  email: string;
  password: string;
}

// ----------------------
// Register a new user (and seller if role is seller)
// ----------------------
export const registerUser = async (data: RegisterDTO) => {
  const { firstname, lastname, email, password, role, shopName, description } =
    data;

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) throw new Error("Email already in use");

  const passwordHash = await hashPassword(password);

  const user = new User({
    firstname,
    lastname,
    email: email.toLowerCase(),
    passwordHash,
    role,
  });
  await user.save();

  let seller = null;

  if (role === "seller") {
    if (!shopName) throw new Error("Shop name is required for sellers");

    seller = new Seller({
      userId: user._id,
      shopName,
      description: description || "",
      products: [],
    });

    await seller.save();
    await seller.populate("userId", "firstname lastname email role");
  }

  const token = signJWT({ userId: user._id.toString(), role: user.role });

  return { user, seller, token };
};

// ----------------------
// Login existing user
// ----------------------
export const loginUser = async (data: LoginDTO) => {
  const { email, password } = data;

  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+passwordHash"
  );
  if (!user) throw new Error("User not found");

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) throw new Error("Invalid credentials");

  const token = signJWT({ userId: user._id.toString(), role: user.role });

  return { user, token };
};
