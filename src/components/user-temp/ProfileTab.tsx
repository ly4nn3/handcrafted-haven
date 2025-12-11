"use client";

import { useState } from "react";
import { useUserProfile } from "@/app/hooks/useUserProfile";
import { UserService } from "@/lib/api/userService";
import LoadingButton from "@/components/ui/LoadingButton";
import ProfileEditModal from "@/components/dashboard/ProfileEditModal";

export default function ProfileTab() {
  const { user, loading, refetch } = useUserProfile();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async (updatedData: any) => {
    try {
      const result = await UserService.updateMyProfile(updatedData);
      if (result.success) {
        setIsEditModalOpen(false);
        refetch(); // Refetch the profile data
      } else {
        throw new Error(result.error || "Failed to update profile");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
      throw err;
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>Failed to load profile.</p>;

  return (
    <div style={{ lineHeight: 1.7 }}>
      <h2>User Profile</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <p>
        <strong>Name:</strong> {user.firstname} {user.lastname}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>

      <LoadingButton onClick={handleEditClick}>Edit Profile</LoadingButton>

      {isEditModalOpen && (
        <ProfileEditModal
          type="user"
          data={user}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveProfile}
        />
      )}
    </div>
  );
}
