"use client";

import { ReactNode } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function SellerDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <ProtectedRoute role="seller">{children}</ProtectedRoute>;
}
