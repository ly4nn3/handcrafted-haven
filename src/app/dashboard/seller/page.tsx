"use client";

import { useState } from "react";
import DashboardTabs from "@/app/components/Dashboard";

export default function SellerDashboardPage() {
  const [activeTab, setActiveTab] = useState("Profile");

  const sellerTabs = [
    "Profile",
    "Products",
    "Statistics",
    "Purchases",
    "Reviews",
  ];

  return (
    <div>
      <h1>Seller Dashboard</h1>
      <DashboardTabs
        tabs={sellerTabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div style={{ marginTop: "2rem" }}>
        {activeTab === "Profile" && <p>Account settings & profile info.</p>}
        {activeTab === "Products" && <p>Manage your products here.</p>}
        {activeTab === "Statistics" && <p>Sales & store statistics.</p>}
        {activeTab === "Purchases" && <p>Past purchases as a user.</p>}
        {activeTab === "Reviews" && <p>Product reviews you wrote.</p>}
      </div>
    </div>
  );
}
