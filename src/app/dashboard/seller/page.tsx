"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import ProfileTab from "@/components/Seller/ProfileTab";
import ProductsTab from "@/components/Seller/ProductsTab";
import ReviewsTab from "@/components/Seller/ReviewsTab";

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

  const tabs = ["Profile", "Products", "Reviews"];

  return (
    <DashboardTabs
      tabs={tabs}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {activeTab === "Profile" && <ProfileTab />}
      {activeTab === "Products" && <ProductsTab />}
      {activeTab === "Reviews" && <ReviewsTab />}
    </DashboardTabs>
  );
}
