"use client";

import { useAuthContext } from "@/hooks/useAuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname(); // Get current page
  const { user, authIsReady } = useAuthContext();

  useEffect(() => {
    if (!authIsReady) return;

    if (!user && pathname !== "/login" && pathname !== "/signup") {
      // Redirect only if not logged in & not already on login
      router.replace("/login"); 
    } else if (user && (pathname === "/login" || pathname === "/signup")) {
      // Prevent logged-in users from staying on login page
      router.replace("/"); 
    }
  }, [user, authIsReady, pathname, router]);

  return <>{children}</>;
}
