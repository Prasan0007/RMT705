"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STARTER_VAULT } from "./mock-data";
import { cardById } from "./card-catalog";
import type { VaultItem } from "./types";

interface RipHistoryEntry {
  id: string;
  cardId: string;
  grade: number;
  timestamp: string;
}

interface AppState {
  tokens: number;
  vault: VaultItem[];
  streamerMode: boolean;
  chromaKey: boolean;
  ripHistory: RipHistoryEntry[];
  addTokens: (amount: number) => void;
  spendTokens: (amount: number) => boolean;
  addVaultItems: (items: VaultItem[]) => void;
  sellBack: (instanceId: string) => void;
  toggleShowcase: (instanceId: string) => void;
  toggleStreamerMode: () => void;
  toggleChromaKey: () => void;
  pushRipHistory: (entry: RipHistoryEntry) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      tokens: 3200,
      vault: STARTER_VAULT,
      streamerMode: false,
      chromaKey: false,
      ripHistory: [],

      addTokens: (amount) => set((s) => ({ tokens: s.tokens + amount })),

      spendTokens: (amount) => {
        if (get().tokens < amount) return false;
        set((s) => ({ tokens: s.tokens - amount }));
        return true;
      },

      addVaultItems: (items) => set((s) => ({ vault: [...items, ...s.vault] })),

      sellBack: (instanceId) => {
        const item = get().vault.find((v) => v.instanceId === instanceId);
        if (!item) return;
        const card = cardById(item.cardId);
        const offer = Math.round(card.value * (0.55 + item.grade / 40));
        set((s) => ({
          vault: s.vault.filter((v) => v.instanceId !== instanceId),
          tokens: s.tokens + offer,
        }));
      },

      toggleShowcase: (instanceId) =>
        set((s) => ({
          vault: s.vault.map((v) =>
            v.instanceId === instanceId ? { ...v, showcased: !v.showcased } : v
          ),
        })),

      toggleStreamerMode: () => set((s) => ({ streamerMode: !s.streamerMode })),
      toggleChromaKey: () => set((s) => ({ chromaKey: !s.chromaKey })),

      pushRipHistory: (entry) =>
        set((s) => ({ ripHistory: [entry, ...s.ripHistory].slice(0, 25) })),
    }),
    { name: "foilfall-state" }
  )
);

export function sellBackOffer(cardValue: number, grade: number): number {
  return Math.round(cardValue * (0.55 + grade / 40));
}
