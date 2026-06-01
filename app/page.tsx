'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, RefreshCw } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { ChainPill } from '@/components/ChainPill';
import { Skeleton } from '@/components/Skeleton';
import { useSigmaStore } from '@/lib/store';
import { usePortfolio } from '@/lib/usePortfolio';
import { fmtCurrency, fmtUsd, timeAgo, cx } from '@/lib/format';
import { sortChains } from '@/lib/services/portfolio';

export default function PortfolioPage() {
  const wallets = useSigmaStore((s) => s.wallets);
  const snapshot = useSigmaStore((s) => s.snapshot);
  const privacy = useSigmaStore((s) => s.privacyMode);
  const togglePrivacy = useSigmaStore((s) => s.togglePrivacy);
  const currency = useSigmaStore((s) => s.currency);
  const fxRate = useSigmaStore((s) => s.fxRate);
  const hasHydrated = useSigmaStore((s) => s.hasHydrated);

  const { isFetching, refresh } = usePortfolio();
  const [spin, setSpin] = useState(false);

  const total = snapshot?.totalUsd ?? 0;
  const formatted = fmtCurrency(total, currency, fxRate);

  const handleRefresh = () => {
    setSpin(true);
    refresh();
    setTimeout(() => setSpin(false), 1000);
  };

  return (
    <div className="safe-top px-4 pt-3">
      {/* Brand row */}
      <header className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-11 w-11 overflow-hidden rounded-2xl bg-black ring-1 ring-gold/40">
            <Image
              src="/icon.png"
              alt="SigmaCash"
              fill
              sizes="44px"
              priority
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="wordmark text-lg leading-none">
              SIGMA<span className="text-gold">CASH</span>
            </h1>
            <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-cream-dim">
              Apex Net Worth
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="tap rounded-full border border-gold/30 p-2 text-gold"
            aria-label="Refresh"
          >
            <RefreshCw size={14} className={cx(spin && 'animate-spin')} />
          </button>
          <button
            onClick={togglePrivacy}
            className="tap flex items-center gap-1.5 rounded-full border border-gold/30 px-3 py-1.5 text-[11px] font-bold tracking-wider text-gold"
          >
            {privacy ? <EyeOff size={12} /> : <Eye size={12} />}
            {privacy ? 'SHOW' : 'HIDE'}
          </button>
        </div>
      </header>

      {/* Hero balance */}
      <GlassCard className="mb-4 px-6 py-8" padded={false}>
        <p className="text-[10px] tracking-[0.3em] text-cream-dim">TOTAL NET WORTH</p>
        <div className="mt-2 min-h-[64px]">
          {!hasHydrated ? (
            <Skeleton height={56} width="60%" />
          ) : (
            <motion.div
              key={`${formatted}-${privacy}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={cx(
                'gold-text font-display text-[56px] font-extrabold leading-none tracking-tight',
                privacy && 'privacy-blur',
              )}
            >
              {privacy ? '€••••••' : formatted}
            </motion.div>
          )}
        </div>
        <div className="mt-4 flex items-center justify-between text-[11px] text-cream-muted">
          <span>
            {wallets.length} {wallets.length === 1 ? 'wallet' : 'wallets'}
          </span>
          <span>{snapshot ? `Synced ${timeAgo(snapshot.fetchedAt)}` : 'Not synced'}</span>
        </div>
      </GlassCard>

      {/* Empty state */}
      {hasHydrated && wallets.length === 0 && (
        <GlassCard className="mb-4 py-10 text-center">
          <p className="text-base font-semibold">No wallets yet</p>
          <p className="mt-1 text-sm text-cream-muted">
            Add a wallet address to track your apex.
          </p>
          <Link
            href="/wallets"
            className="tap mt-5 inline-block rounded-full bg-gold-gradient px-6 py-3 text-sm font-extrabold text-[#1a1300]"
          >
            Add first wallet
          </Link>
        </GlassCard>
      )}

      {/* Loading skeletons */}
      {wallets.length > 0 && !snapshot && (
        <GlassCard className="mb-4">
          <p className="mb-3 text-[11px] font-bold tracking-[0.2em] text-cream-muted">
            LOADING
          </p>
          <div className="space-y-3">
            <Skeleton height={20} />
            <Skeleton height={20} width="70%" />
            <Skeleton height={20} width="85%" />
          </div>
        </GlassCard>
      )}

      {/* By Group */}
      {snapshot && Object.keys(snapshot.byGroup).length > 0 && (
        <GlassCard className="mb-4">
          <p className="mb-3 text-[11px] font-bold tracking-[0.2em] text-cream-muted">
            BY GROUP
          </p>
          {Object.entries(snapshot.byGroup)
            .sort(([, a], [, b]) => b - a)
            .map(([group, usd]) => (
              <Row
                key={group}
                left={<span className="font-semibold">{group}</span>}
                right={privacy ? '••••' : fmtCurrency(usd, currency, fxRate)}
              />
            ))}
        </GlassCard>
      )}

      {/* By Chain */}
      {snapshot && (
        <GlassCard className="mb-4">
          <p className="mb-3 text-[11px] font-bold tracking-[0.2em] text-cream-muted">
            BY CHAIN
          </p>
          {sortChains(snapshot.byChain).length === 0 ? (
            <p className="text-sm italic text-cream-dim">No balances detected.</p>
          ) : (
            sortChains(snapshot.byChain).map(([chain, usd]) => (
              <Row
                key={chain}
                left={<ChainPill chain={chain} />}
                right={privacy ? '••••' : fmtCurrency(usd, currency, fxRate)}
              />
            ))
          )}
        </GlassCard>
      )}

      {/* Per wallet */}
      {snapshot &&
        snapshot.wallets.map((w) => {
          const wallet = wallets.find((x) => x.id === w.walletId);
          if (!wallet) return null;
          return (
            <GlassCard key={w.walletId} className="mb-4">
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <p className="text-base font-bold">{wallet.label}</p>
                  <p className="mt-0.5 text-[10px] tracking-[0.2em] text-cream-dim">
                    {wallet.group.toUpperCase()}
                  </p>
                  <div className="mt-2">
                    <ChainPill chain={wallet.chain} />
                  </div>
                </div>
                <p className="font-mono text-base font-bold text-gold tabular-nums">
                  {privacy ? '••••' : fmtCurrency(w.totalUsd, currency, fxRate)}
                </p>
              </div>

              {w.error && <p className="mt-3 text-xs text-red-400">{w.error}</p>}

              {w.tokens
                .filter((t) => (t.usdValue ?? 0) > 0.01 || t.amount > 0)
                .slice(0, 8)
                .map((t, i) => (
                  <div
                    key={`${t.symbol}-${i}`}
                    className="mt-2 flex items-center justify-between border-t border-white/[0.06] pt-2"
                  >
                    <div>
                      <p className="text-sm font-semibold">{t.symbol}</p>
                      <p className="mt-0.5 text-[11px] text-cream-muted">
                        {privacy
                          ? '••••'
                          : t.amount.toLocaleString('en-US', {
                              maximumFractionDigits: 4,
                            })}
                      </p>
                    </div>
                    <p className="font-mono text-sm tabular-nums">
                      {privacy ? '••••' : fmtUsd(t.usdValue ?? 0)}
                    </p>
                  </div>
                ))}
            </GlassCard>
          );
        })}
    </div>
  );
}

function Row({
  left,
  right,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>{left}</div>
      <div className="font-mono text-sm tabular-nums">{right}</div>
    </div>
  );
}
