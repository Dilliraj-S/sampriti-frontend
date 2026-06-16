"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SavedItem {
  id: string;
  name: string;
  price: number;
  image: string;
  subtitle?: string;
}

interface SavedState {
  savedIds: string[];
  savedItems: SavedItem[];
  toggleSave: (item: SavedItem) => void;
  isSaved: (id: string) => boolean;
}

export const useSavedStore = create<SavedState>()(
  persist(
    (set, get) => ({
      savedIds: [],
      savedItems: [],

      toggleSave: (item) =>
        set((state) => {
          const exists = state.savedIds.includes(item.id);
          if (exists) {
            return {
              savedIds: state.savedIds.filter((id) => id !== item.id),
              savedItems: state.savedItems.filter((i) => i.id !== item.id),
            };
          }
          return {
            savedIds: [item.id, ...state.savedIds],
            savedItems: [item, ...state.savedItems],
          };
        }),

      isSaved: (id) => get().savedIds.includes(id),
    }),
    {
      name: "sampriti-saved",
      partialize: (state) => ({
        savedIds: state.savedIds,
        savedItems: state.savedItems,
      }),
    }
  )
);
