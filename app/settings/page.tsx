'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/GlassCard';
import { useSigmaStore } from '@/lib/store';

export default function SettingsPage() {
  const currency = useSigmaStore((s) => s.currency);
  const setCurrency = useSigmaStore((s) => s.setCurrency);
  const privacy = useSigmaStore((s) => s.privacyMode);
  const togglePrivacy = useSigmaStore((s) => s.togglePrivacy);
  const fxRate = useSigmaStore((s) => s.fxRate);
  const setFxRate = useSigmaStore((s) => s.setFxRate);
  const [fxInput, setFxInput] = useState(String(fxRate));

  return (
    <div className="safe-top px-4 pt-3">
      <h1 className="mb-4 text-3xl font-extrabold tracking-tight">Settings</h1>

      <GlassCard className="mb-4">
        <p className="mb-4 text-[11px] font-bold tracking-[0.2em] text-cream-muted">
          DISPLAY
        </p>

        <Row label="Currency">
          <div className="flex rounded-full border border-white/10 bg-white/[0.04] p-1">
            {(['USD', 'EUR'] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`tap rounded-full px-4 py-1.5 text-xs font-bold transition ${
                  currency === c ? 'bg-gold-gradient text-[#1a1300]' : 'text-cream-muted'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </Row>

        <Row label="Privacy mode">
          <button
            onClick={togglePrivacy}
            className={`tap relative h-7 w-12 rounded-full transition ${
              privacy ? 'bg-gold' : 'bg-white/15'
            }`}
            aria-pressed={privacy}
          >
            <span
              className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${
                privacy ? 'left-[22px]' : 'left-0.5'
              }`}
            />
          </button>
        </Row>

        <Row label="EUR per USD">
          <input
            value={fxInput}
            onChange={(e) => setFxInput(e.target.value)}
            onBlur={() => {
              const n = Number(fxInput);
              if (Number.isFinite(n) && n > 0) setFxRate(n);
              else setFxInput(String(fxRate));
            }}
            inputMode="decimal"
            className="w-20 rounded-lg border border-gold/30 bg-white/[0.04] px-2 py-1 text-right font-mono text-sm text-gold focus:border-gold focus:outline-none"
          />
        </Row>
      </GlassCard>

      <GlassCard className="mb-4">
        <p className="mb-3 text-[11px] font-bold tracking-[0.2em] text-cream-muted">
          DATA SOURCES
        </p>
        <p className="text-sm text-cream-muted">
          Configured at build time via Vercel environment variables:
        </p>
        <ul className="mt-3 space-y-1 font-mono text-xs text-gold">
          <li>NEXT_PUBLIC_ALCHEMY_KEY</li>
          <li>NEXT_PUBLIC_HELIUS_KEY</li>
          <li>NEXT_PUBLIC_RISE_RPC</li>
          <li>NEXT_PUBLIC_RISE_TOKEN_ARBITRUM</li>
        </ul>
        <p className="mt-3 text-xs text-cream-dim">
          Bitcoin uses Blockstream (no key needed). Prices via CoinGecko free tier.
        </p>
      </GlassCard>

      <GlassCard>
        <p className="mb-3 text-[11px] font-bold tracking-[0.2em] text-cream-muted">
          ABOUT
        </p>
        <p className="text-sm">SigmaCash · v1.0.0</p>
        <p className="mt-2 text-xs text-cream-muted">
          Read-only crypto net-worth tracker. Wallet addresses are stored only in your
          browser&apos;s local storage. No server, no analytics.
        </p>
      </GlassCard>
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-sm">{label}</span>
      {children}
    </div>
  );
}
