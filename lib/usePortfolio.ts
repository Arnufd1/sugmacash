'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useSigmaStore } from './store';
import { loadPortfolio } from './services/portfolio';

export function usePortfolio() {
  const wallets = useSigmaStore((s) => s.wallets);
  const setSnapshot = useSigmaStore((s) => s.setSnapshot);
  const hasHydrated = useSigmaStore((s) => s.hasHydrated);
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['portfolio', wallets.map((w) => `${w.chain}:${w.address}`).join('|')],
    enabled: hasHydrated && wallets.length > 0,
    queryFn: () => loadPortfolio(wallets),
    refetchInterval: 60_000,
    staleTime: 30_000,
  });

  useEffect(() => {
    if (query.data) setSnapshot(query.data);
  }, [query.data, setSnapshot]);

  return {
    ...query,
    refresh: () => qc.invalidateQueries({ queryKey: ['portfolio'] }),
  };
}
