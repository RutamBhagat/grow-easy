"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { ImportResult } from "@/server/ai/crm-schemas";

type ImportStore = {
  result: ImportResult | undefined;
  addImportResult: (result: ImportResult) => void;
  reset: () => void;
};

const useImportStore = create<ImportStore>()(
  persist(
    (set, _get, store) => ({
      result: undefined,
      addImportResult: (result) => {
        set((state) => ({
          result: {
            records: [...(state.result?.records ?? []), ...result.records],
            skippedRecords: [
              ...(state.result?.skippedRecords ?? []),
              ...result.skippedRecords,
            ],
          },
        }));
      },
      reset: () => set(store.getInitialState()),
    }),
    {
      name: "groweasy:import-result",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ result: state.result }),
    },
  ),
);

export { useImportStore };
