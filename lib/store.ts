"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RipHistoryEntry {
  id: string;
  cardId: string;
  grade: number;
  timestamp: string;
}

interface UiState {
  streamerMode: boolean;
  chromaKey: boolean;
  ripHistory: RipHistoryEntry[];
  toggleStreamerMode: () => void;
  toggleChromaKey: () => void;
  pushRipHistory: (entry: RipHistoryEntry) => void;
}

/**
 * Client-only UI preferences. Account data (tokens, vault, pull history)
 * lives in Postgres now — see lib/db.ts and the /api routes — and is never
 * cached here, so this store can't drift from the real balance.
 */
export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      streamerMode: false,
      chromaKey: false,
      ripHistory: [],

      toggleStreamerMode: () => set((s) => ({ streamerMode: !s.streamerMode })),
      toggleChromaKey: () => set((s) => ({ chromaKey: !s.chromaKey })),

      pushRipHistory: (entry) =>
        set((s) => ({ ripHistory: [entry, ...s.ripHistory].slice(0, 25) })),
    }),
    { name: "foilfall-ui", partialize: (s) => ({ streamerMode: s.streamerMode, chromaKey: s.chromaKey }) }
  )
);
