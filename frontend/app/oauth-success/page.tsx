"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthContext } from "@/hooks/useAuthContext";

export default function OAuthSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { dispatch } = useAuthContext();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      const userInfo = { token }; // you can fetch profile if needed
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      dispatch({ type: "LOGIN", payload: userInfo });
      router.push("/");
    }
  }, [searchParams, router, dispatch]);

  return <p>Logging you in...</p>;
}
