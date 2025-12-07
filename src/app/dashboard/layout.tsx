import { ReactNode } from "react";
import DashboardTabs from "@/app/components/Dashboard";
import styles from "./DashboardLayout.module.css";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return <div className={styles.dashboardContent}>{children}</div>;
}
