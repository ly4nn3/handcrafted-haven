"use client";

import { Dispatch, SetStateAction } from "react";
import styles from "./DashboardNav.module.css";

interface DashboardTabsProps {
  tabs: string[];
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
}

export default function DashboardTabs({
  tabs,
  activeTab,
  setActiveTab,
}: DashboardTabsProps) {
  return (
    <div className={styles.dashboardContainer}>
      <aside className={styles.sidebar}>
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`${styles.tabButton} ${
              activeTab === tab ? styles.active : ""
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </aside>

      <main className={styles.content}>
        {/* TODO: Content for active tab goes here */}
      </main>
    </div>
  );
}
