"use client";

import { Dispatch, SetStateAction, ReactNode } from "react";
import styles from "./DashboardNav.module.css";

interface DashboardTabsProps {
  tabs: string[];
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
  children: ReactNode; // ← NEW
}

export default function DashboardTabs({
  tabs,
  activeTab,
  setActiveTab,
  children, // ← NEW
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

      <main className={styles.content}>{children}</main>
    </div>
  );
}
