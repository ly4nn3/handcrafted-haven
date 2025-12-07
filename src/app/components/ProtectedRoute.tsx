"use client";

import { useEffect, ReactNode } from "react";
import { useUser } from "@/app/context/UserContext";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: ReactNode;
  role?: "user" | "seller";
}

export const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      // redirect to login if not authenticated
      router.push("/auth/login");
    } else if (role && user.role !== role) {
      // redirect if role does not match
      router.push("/");
    }
  }, [user, router, role]);

  // While checking auth, show a loading message
  if (!user) return <p>Loading...</p>;

  return <>{children}</>;
};
