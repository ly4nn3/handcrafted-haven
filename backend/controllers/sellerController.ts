import Seller from "@backend/models/Seller";
import User from "@backend/models/User";

/**
 * Fetch seller profile by userId
 * @param userId - The user ID
 * @param populateUser - Whether to populate user details (default: true)
 */
export const getSellerProfile = async (
  userId: string,
  populateUser: boolean = true
) => {
  let query = Seller.findOne({ userId });

  // Conditionally populate user data
  if (populateUser) {
    query = query.populate("userId", "firstname lastname email role");
  }

  const seller = await query;

  if (!seller) throw new Error("Seller profile not found");

  return seller;
};

/**
 * Fetch seller profile by seller ID
 * @param sellerId - The seller ID
 * @param populateUser - Whether to populate user details (default: true)
 */
export const getSellerById = async (
  sellerId: string,
  populateUser: boolean = true
) => {
  let query = Seller.findById(sellerId);

  if (populateUser) {
    query = query.populate("userId", "firstname lastname email role");
  }

  const seller = await query;

  if (!seller) throw new Error("Seller not found");

  return seller;
};

/**
 * Get authenticated seller's own profile
 */
export const getMySellerProfile = async (userId: string) => {
  return getSellerProfile(userId, true);
};

/**
 * Get public seller profile by seller ID
 * @param sellerId - The seller ID
 * @returns Seller with full user information including email
 */
export const getPublicSellerProfile = async (sellerId: string) => {
  const seller = await Seller.findById(sellerId).populate(
    "userId",
    "firstname lastname email role"
  );

  if (!seller) throw new Error("Seller not found");

  return seller;
};

export const updateMySellerProfile = async (
  userId: string,
  data: {
    shopName?: string;
    description?: string;
    firstname?: string;
    lastname?: string;
  }
) => {
  // Find the seller
  const seller = await Seller.findOne({ userId }).populate("userId");

  if (!seller) {
    throw new Error("Seller not found");
  }

  // Update seller fields
  if (data.shopName) seller.shopName = data.shopName;
  if (data.description !== undefined) seller.description = data.description;

  await seller.save();

  // Update user fields if provided
  if (data.firstname || data.lastname) {
    await User.findByIdAndUpdate(
      userId,
      {
        ...(data.firstname && { firstname: data.firstname }),
        ...(data.lastname && { lastname: data.lastname }),
      },
      { runValidators: true }
    );
  }

  // Re-fetch with populated user
  const updatedSeller = await Seller.findById(seller._id).populate("userId");
  return updatedSeller!;
};
