"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { STORAGE_KEYS } from "@/lib/api/config";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const customerToken = localStorage.getItem(STORAGE_KEYS.USER_TOKEN);
    if (!customerToken) {
      router.push("/");
    }
  }, [router]);

  return <>{children}</>;
}