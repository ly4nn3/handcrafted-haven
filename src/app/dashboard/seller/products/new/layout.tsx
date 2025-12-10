"use client";

import { ReactNode } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function ProductsLayout({ children }: { children: ReactNode }) {
  return <ProtectedRoute role="seller">{children}</ProtectedRoute>;
}
