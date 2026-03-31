"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/hooks/useAuthStore";
import { tokenStorage } from "@/lib/api";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const token = tokenStorage.getAccess();
    if (!isAuthenticated || !token) {
      router.replace("/auth/login");
    }
    // Sync token to cookie so middleware can read it
    if (token) {
      document.cookie = `rendi_access=${token}; path=/; max-age=3600; SameSite=Lax`;
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;
  return <>{children}</>;
}
