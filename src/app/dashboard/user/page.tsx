"use client";

import { useState } from "react";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import ProfileTab from "@/components/dashboard/ProfileTab";
import ReviewsTab from "@/components/user/ReviewsTab";

export default function UserDashboardPage() {
  const [activeTab, setActiveTab] = useState("Profile");

  const tabs = ["Profile", "Reviews", "Purchases"];

  return (
    <DashboardTabs
      tabs={tabs}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {activeTab === "Profile" && <ProfileTab type="user" />}
      {activeTab === "Reviews" && <ReviewsTab />}
      {activeTab === "Purchases" && (
        <div style={{ padding: "2rem" }}>
          <h2>My Purchases</h2>
          <p>Your order history will appear here...</p>
        </div>
      )}
    </DashboardTabs>
  );
}
