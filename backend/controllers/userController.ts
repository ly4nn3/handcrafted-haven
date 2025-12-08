import User from "@backend/models/User";

/**
 * Fetch user profile by userId
 */
export const getUserProfile = async (userId: string) => {
  const user = await User.findById(userId).select(
    "firstname lastname email role createdAt updatedAt"
  );

  if (!user) throw new Error("User profile not found");

  return user;
};

/**
 * Get authenticated user's own profile
 */
export const getMyProfile = async (userId: string) => {
  return getUserProfile(userId);
};
