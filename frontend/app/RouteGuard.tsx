'use client'

import { useAuthContext } from "@/hooks/useAuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, authIsReady } = useAuthContext();

  useEffect(() => {
    if (!user) {
      // router.push("/signup");
      router.push("/login"); // Redirect to login only after auth is ready
    }
    if (user){
      router.push("/");
    }
  }, [user, router]);

  return <>{children}</>;
}
