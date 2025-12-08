"use client";

import { useState } from "react";
import DashboardTabs from "@/components/Dashboard/DashboardTabs";
import ProfileTab from "@/components/Dashboard/ProfileTab";

export default function SellerDashboardPage() {
  const [activeTab, setActiveTab] = useState("Profile");

  const tabs = ["Profile", "Products", "Statistics", "Purchases", "Reviews"];

  return (
    <DashboardTabs
      tabs={tabs}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {activeTab === "Profile" && <ProfileTab type="seller" />}
      {activeTab === "Products" && (
        <div style={{ padding: "2rem" }}>
          <h2>Manage Products</h2>
          <p>Product management coming soon...</p>
        </div>
      )}
      {activeTab === "Statistics" && (
        <div style={{ padding: "2rem" }}>
          <h2>Sales Statistics</h2>
          <p>Analytics dashboard coming soon...</p>
        </div>
      )}
      {activeTab === "Purchases" && (
        <div style={{ padding: "2rem" }}>
          <h2>Purchase History</h2>
          <p>Order history coming soon...</p>
        </div>
      )}
      {activeTab === "Reviews" && (
        <div style={{ padding: "2rem" }}>
          <h2>Reviews</h2>
          <p>Customer reviews coming soon...</p>
        </div>
      )}
    </DashboardTabs>
  );
}
