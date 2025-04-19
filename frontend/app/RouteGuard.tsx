"use client";

import { useAuthContext } from "@/hooks/useAuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname(); // Get current page
  const { user, authIsReady } = useAuthContext();

  useEffect(() => {
    if (!authIsReady) return; // Ensure auth is ready before redirecting

    if (!user && pathname !== "/login") {
      router.replace("/login"); // Redirect only if not logged in & not already on login
    } else if (user && pathname === "/login") {
      router.replace("/"); // Prevent logged-in users from staying on login page
    }
  }, [user, authIsReady, pathname, router]);

  return <>{children}</>;
}
