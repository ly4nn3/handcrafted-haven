"use client";

import { useUserProfile } from "@/app/hooks/useUserProfile";

export default function ProfileTab() {
  const { user, loading } = useUserProfile();

  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>Failed to load profile.</p>;

  return (
    <div style={{ lineHeight: 1.7 }}>
      <h2>User Profile</h2>

      <p>
        <strong>Name:</strong> {user.firstname} {user.lastname}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
    </div>
  );
}
