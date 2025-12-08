"use client";

import { ReactNode } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function UserDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <ProtectedRoute role="user">{children}</ProtectedRoute>;
}
