"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/hooks/useAuthStore";
import { tokenStorage, authApi } from "@/lib/api";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isChecking, _hasHydrated, setUser, logout, finishChecking } = useAuthStore();

  useEffect(() => {
    // Wait for Zustand to finish loading from LocalStorage
    if (!_hasHydrated) return;

    const validateSession = async () => {
      const token = tokenStorage.getAccess();

      if (!token) {
        logout();
        router.replace("/auth/login");
        return;
      }

      // If we have a token but state says not authenticated (the refresh case)
      // or if we just want to verify the token is still valid on refresh
      try {
        const { data } = await authApi.getProfile();
        setUser(data);
        // Sync cookie for middleware
        document.cookie = `rendi_access=${token}; path=/; max-age=3600; SameSite=Lax`;
      } catch (error) {
        logout();
        router.replace("/auth/login");
      } finally {
        finishChecking();
      }
    };

    validateSession();
  }, [_hasHydrated, isAuthenticated, router, setUser, logout, finishChecking]);

  // Prevent UI rendering during hydration or while checking API
  if (!_hasHydrated || isChecking) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
