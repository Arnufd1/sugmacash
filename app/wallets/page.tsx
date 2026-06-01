'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { ChainPill } from '@/components/ChainPill';
import { AddWalletDialog } from '@/components/AddWalletDialog';
import { useSigmaStore } from '@/lib/store';
import { shortAddress } from '@/lib/format';

export default function WalletsPage() {
  const wallets = useSigmaStore((s) => s.wallets);
  const removeWallet = useSigmaStore((s) => s.removeWallet);
  const [open, setOpen] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  return (
    <div className="safe-top px-4 pt-3">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold tracking-tight">Wallets</h1>
        <button
          onClick={() => setOpen(true)}
          className="tap flex items-center gap-1.5 rounded-full bg-gold-gradient px-4 py-2 text-sm font-extrabold text-[#1a1300]"
        >
          <Plus size={16} strokeWidth={3} />
          Add
        </button>
      </header>

      {wallets.length === 0 ? (
        <GlassCard className="py-12 text-center">
          <p className="text-cream-muted">No wallets tracked yet.</p>
          <button
            onClick={() => setOpen(true)}
            className="tap mt-4 inline-block rounded-full bg-gold-gradient px-5 py-2.5 text-sm font-extrabold text-[#1a1300]"
          >
            Add first wallet
          </button>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {wallets.map((w) => (
            <GlassCard key={w.id} className="flex items-start gap-3">
              <div className="flex-1">
                <p className="text-base font-bold">{w.label}</p>
                <p className="mt-0.5 text-[10px] tracking-[0.2em] text-cream-dim">
                  {w.group.toUpperCase()}
                </p>
                <div className="mt-2">
                  <ChainPill chain={w.chain} />
                </div>
                <p className="mt-3 font-mono text-xs text-cream-muted">
                  {shortAddress(w.address)}
                </p>
              </div>
              {confirmId === w.id ? (
                <div className="flex gap-1.5">
                  <button
                    onClick={() => {
                      removeWallet(w.id);
                      setConfirmId(null);
                    }}
                    className="tap rounded-full bg-red-500/90 px-3 py-1 text-xs font-bold"
                  >
                    Remove
                  </button>
                  <button
                    onClick={() => setConfirmId(null)}
                    className="tap rounded-full border border-white/15 px-3 py-1 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmId(w.id)}
                  className="tap rounded-full border border-red-400/40 p-1.5 text-red-400"
                  aria-label="Remove"
                >
                  <X size={14} />
                </button>
              )}
            </GlassCard>
          ))}
        </div>
      )}

      <AddWalletDialog open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
