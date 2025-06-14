"use client";

import { useAuthContext } from "@/hooks/useAuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

// List of public routes
const publicRoutes = ["/", "/login", "/signup", "/posts"];

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname(); // current route
  const { userInfo, authIsReady } = useAuthContext();

  useEffect(() => {
    if (!authIsReady) return;

    const isPublicRoute =
      publicRoutes.includes(pathname) || pathname.startsWith("/profile/");

    if (!userInfo && !isPublicRoute) {
      router.replace("/login");
    }

    if (userInfo && (pathname === "/login" || pathname === "/signup")) {
      router.replace("/");
    }
  }, [userInfo, authIsReady, pathname, router]);

  return <>{children}</>;
}
