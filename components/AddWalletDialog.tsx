'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardPaste, X } from 'lucide-react';
import { CHAIN_ORDER, CHAINS, type ChainId } from '@/lib/chains';
import { useSigmaStore } from '@/lib/store';

function validate(chain: ChainId, addr: string): string | null {
  if (!addr) return 'Address required';
  const kind = CHAINS[chain].kind;
  if (kind === 'evm' && !/^0x[a-fA-F0-9]{40}$/.test(addr))
    return 'Invalid EVM address (0x + 40 hex)';
  if (kind === 'solana' && !/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(addr))
    return 'Invalid Solana address';
  if (kind === 'bitcoin' && !/^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,80}$/.test(addr))
    return 'Invalid Bitcoin address';
  return null;
}

export function AddWalletDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const addWallet = useSigmaStore((s) => s.addWallet);
  const [chain, setChain] = useState<ChainId>('ethereum');
  const [address, setAddress] = useState('');
  const [label, setLabel] = useState('');
  const [group, setGroup] = useState('Personal');
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setAddress('');
      setLabel('');
      setErr(null);
    }
  }, [open]);

  const submit = () => {
    const e = validate(chain, address.trim());
    if (e) {
      setErr(e);
      return;
    }
    addWallet({
      chain,
      address: address.trim(),
      label: label.trim() || `${CHAINS[chain].name} wallet`,
      group: group.trim() || 'Personal',
    });
    onClose();
  };

  const paste = async () => {
    try {
      const txt = await navigator.clipboard.readText();
      if (txt) setAddress(txt.trim());
    } catch {
      /* user denied */
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed inset-x-0 bottom-0 z-[70] safe-bottom"
          >
            <div className="glass mx-auto max-w-md rounded-t-[28px] rounded-b-none p-6">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-bold">Add wallet</h2>
                <button
                  onClick={onClose}
                  className="tap rounded-full border border-white/10 p-1.5 text-cream-muted"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>

              <Field label="Chain">
                <div className="no-scrollbar -mx-2 flex gap-2 overflow-x-auto px-2 pb-1">
                  {CHAIN_ORDER.map((c) => (
                    <button
                      key={c}
                      onClick={() => setChain(c)}
                      className={`tap flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
                        chain === c
                          ? 'border-gold bg-gold/10 text-gold'
                          : 'border-white/10 bg-white/[0.02] text-cream'
                      }`}
                    >
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ background: CHAINS[c].color }}
                      />
                      {CHAINS[c].name}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Address">
                <div className="flex gap-2">
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck={false}
                    placeholder="0x… / bc1… / Solana"
                    className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 font-mono text-sm placeholder:text-cream-dim focus:border-gold/50 focus:outline-none"
                  />
                  <button
                    onClick={paste}
                    className="tap flex items-center gap-1.5 rounded-xl border border-gold/40 px-3 text-sm font-semibold text-gold"
                  >
                    <ClipboardPaste size={14} />
                    Paste
                  </button>
                </div>
              </Field>

              <Field label="Label">
                <input
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="e.g. Client A · Hot wallet"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm placeholder:text-cream-dim focus:border-gold/50 focus:outline-none"
                />
              </Field>

              <Field label="Group">
                <input
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                  placeholder="Personal / Clients / RISE Arb"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm placeholder:text-cream-dim focus:border-gold/50 focus:outline-none"
                />
              </Field>

              {err && <p className="mt-3 text-sm text-red-400">{err}</p>}

              <button
                onClick={submit}
                className="tap mt-5 w-full rounded-full bg-gold-gradient py-3.5 text-sm font-extrabold tracking-wide text-[#1a1300]"
              >
                Save wallet
              </button>
              <button
                onClick={onClose}
                className="tap mt-2 w-full py-3 text-sm text-cream-muted"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-4 first:mt-0">
      <label className="mb-2 block text-[11px] font-bold tracking-[0.18em] text-cream-muted">
        {label.toUpperCase()}
      </label>
      {children}
    </div>
  );
}
