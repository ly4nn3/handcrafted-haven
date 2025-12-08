"use client";

import { ReactNode } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import styles from "./DashboardLayout.module.css";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <div className={styles.dashboardLayout}>
        <div className={styles.dashboardContainer}>{children}</div>
      </div>
    </ProtectedRoute>
  );
}
