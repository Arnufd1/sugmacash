import { CHAINS, type ChainId } from '@/lib/chains';

export function ChainPill({ chain }: { chain: ChainId }) {
  const c = CHAINS[chain];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border bg-white/[0.02] px-2.5 py-1 text-[11px] font-semibold text-cream-muted"
      style={{ borderColor: `${c.color}55` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: c.color }} />
      {c.name}
    </span>
  );
}
