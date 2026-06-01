'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { PortfolioSnapshot, Wallet } from './services/types';

interface SigmaState {
  wallets: Wallet[];
  snapshot: PortfolioSnapshot | null;
  privacyMode: boolean;
  currency: 'USD' | 'EUR';
  fxRate: number;
  hasHydrated: boolean;

  addWallet: (w: Omit<Wallet, 'id' | 'createdAt'>) => void;
  removeWallet: (id: string) => void;
  renameWallet: (id: string, label: string, group: string) => void;
  setSnapshot: (s: PortfolioSnapshot) => void;
  togglePrivacy: () => void;
  setCurrency: (c: 'USD' | 'EUR') => void;
  setFxRate: (r: number) => void;
  setHasHydrated: (b: boolean) => void;
}

export const useSigmaStore = create<SigmaState>()(
  persist(
    (set) => ({
      wallets: [],
      snapshot: null,
      privacyMode: false,
      currency: 'USD',
      fxRate: 0.92,
      hasHydrated: false,

      addWallet: (w) =>
        set((s) => ({
          wallets: [
            ...s.wallets,
            {
              ...w,
              id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
              createdAt: Date.now(),
            },
          ],
        })),
      removeWallet: (id) =>
        set((s) => ({ wallets: s.wallets.filter((w) => w.id !== id) })),
      renameWallet: (id, label, group) =>
        set((s) => ({
          wallets: s.wallets.map((w) => (w.id === id ? { ...w, label, group } : w)),
        })),
      setSnapshot: (snapshot) => set({ snapshot }),
      togglePrivacy: () => set((s) => ({ privacyMode: !s.privacyMode })),
      setCurrency: (currency) => set({ currency }),
      setFxRate: (fxRate) => set({ fxRate }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: 'sigmacash-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        wallets: s.wallets,
        snapshot: s.snapshot,
        privacyMode: s.privacyMode,
        currency: s.currency,
        fxRate: s.fxRate,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
