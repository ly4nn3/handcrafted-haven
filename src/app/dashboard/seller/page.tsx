"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import ProfileTab from "@/components/seller/ProfileTab";
import ProductsTab from "@/components/seller/ProductsTab";
import ReviewsTab from "@/components/seller/ReviewsTab";

function SellerDashboardContent() {
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

export default function SellerDashboardPage() {
  return (
    <Suspense fallback={<div>Loading dashboard...</div>}>
      <SellerDashboardContent />
    </Suspense>
  );
}
