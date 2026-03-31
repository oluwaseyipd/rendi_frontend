import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AssessmentResponse } from "@/types";

type Store = {
  result: AssessmentResponse | null;
  setResult: (data: AssessmentResponse) => void;
  clearResult: () => void;
};

export const useAssessmentStore = create<Store>()(
  persist(
    (set) => ({
      result: null,
      setResult: (data) => set({ result: data }),
      clearResult: () => set({ result: null }),
    }),
    {
      name: "assessment-storage", // Unique name for localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);