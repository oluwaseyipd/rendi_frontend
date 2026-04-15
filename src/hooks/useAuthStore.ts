import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";
import { tokenStorage } from "@/lib/api";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isChecking: boolean; // Tracks initial validation
  _hasHydrated: boolean; // Tracks if persist has finished loading from storage
  setUser: (user: User) => void;
  setAuth: (user: User, access: string, refresh: string) => void;
  logout: () => void;
  updateUser: (partial: Partial<User>) => void;
  finishChecking: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isChecking: true,
      _hasHydrated: false,

      setUser: (user) => set({ user, isAuthenticated: true, isChecking: false }),

      setAuth: (user, access, refresh) => {
        tokenStorage.set(access, refresh);
        set({ user, isAuthenticated: true, isChecking: false });
      },

      logout: () => {
        tokenStorage.clear();
        // Clear cookie as well
        if (typeof document !== "undefined") {
          document.cookie = "rendi_access=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        }
        set({ user: null, isAuthenticated: false, isChecking: false });
      },

      updateUser: (partial) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partial } : null,
        })),

      finishChecking: () => set({ isChecking: false }),
      
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: "rendi-auth",
      // We only persist the user and auth status
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
      // This ensures the store knows when it's done loading from LocalStorage
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
