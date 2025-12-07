"use client";

import { useState } from "react";
import DashboardTabs from "@/app/components/Dashboard";

export default function UserDashboardPage() {
  const [activeTab, setActiveTab] = useState("Profile");

  const userTabs = ["Profile", "Purchases", "Reviews"];

  return (
    <div>
      <h1>User Dashboard</h1>
      <DashboardTabs
        tabs={userTabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div style={{ marginTop: "2rem" }}>
        {activeTab === "Profile" && <p>Your profile settings go here.</p>}
        {activeTab === "Purchases" && <p>Past purchases list goes here.</p>}
        {activeTab === "Reviews" && <p>Your product reviews go here.</p>}
      </div>
    </div>
  );
}
