import Seller from "../models/Seller";
import User from "../models/User";

export const registerSeller = async (data: {
  userId: string;
  shopName: string;
  description?: string;
}) => {
  const { userId, shopName, description } = data;

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const seller = new Seller({
    userId,
    shopName,
    description,
    products: [],
  });

  await seller.save();

  return seller;
};
