import Seller from "@backend/models/Seller";

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
 * @returns Seller with limited user information (no email)
 */
export const getPublicSellerProfile = async (sellerId: string) => {
  const seller = await Seller.findById(sellerId).populate(
    "userId",
    "firstname lastname role"
  );

  if (!seller) throw new Error("Seller not found");

  return seller;
};
