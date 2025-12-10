"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import ProfileTab from "@/components/Seller/ProfileTab";
import ProductsTab from "@/components/Seller/ProductsTab";

export default function SellerDashboardPage() {
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState(tabFromUrl || "Profile");

  // Update tab when URL changes
  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  const tabs = ["Profile", "Products", "Statistics", "Purchases", "Reviews"];

  return (
    <DashboardTabs
      tabs={tabs}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {activeTab === "Profile" && <ProfileTab />}
      {activeTab === "Products" && <ProductsTab />}
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
