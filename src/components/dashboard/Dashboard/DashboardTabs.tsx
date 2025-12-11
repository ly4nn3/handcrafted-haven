"use client";

import { ReactNode } from "react";
import styles from "./DashboardTabs.module.css";

interface DashboardTabsProps {
  tabs: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children: ReactNode;
}

export default function DashboardTabs({
  tabs,
  activeTab,
  setActiveTab,
  children,
}: DashboardTabsProps) {
  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.tabsHeader}>
        <nav className={styles.tabs} role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${styles.tab} ${
                activeTab === tab ? styles.activeTab : ""
              }`}
              role="tab"
              aria-selected={activeTab === tab}
              aria-controls={`${tab}-panel`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div
        className={styles.tabContent}
        role="tabpanel"
        id={`${activeTab}-panel`}
      >
        {children}
      </div>
    </div>
  );
}
