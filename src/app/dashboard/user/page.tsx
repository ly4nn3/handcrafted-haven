"use client";

import { useState } from "react";
import DashboardTabs from "@/components/Dashboard/DashboardTabs";
import ProfileTab from "@/components/Dashboard/ProfileTab";

export default function UserDashboardPage() {
  const [activeTab, setActiveTab] = useState("Profile");

  const tabs = ["Profile", "Purchases", "Reviews"];

  return (
    <DashboardTabs
      tabs={tabs}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {activeTab === "Profile" && <ProfileTab type="user" />}
      {activeTab === "Purchases" && (
        <div style={{ padding: "2rem" }}>
          <h2>My Purchases</h2>
          <p>Your order history will appear here...</p>
        </div>
      )}
      {activeTab === "Reviews" && (
        <div style={{ padding: "2rem" }}>
          <h2>My Reviews</h2>
          <p>Reviews you've written will appear here...</p>
        </div>
      )}
    </DashboardTabs>
  );
}
