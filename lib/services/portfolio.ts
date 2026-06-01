import { CHAIN_ORDER, type ChainId } from '../chains';
import { fetchEvmWallet } from './evm';
import { fetchSolanaWallet } from './solana';
import { fetchBitcoinWallet } from './bitcoin';
import { priceForIds, applyPrices } from './prices';
import type { PortfolioSnapshot, TokenBalance, Wallet, WalletSnapshot } from './types';

async function fetchOne(w: Wallet): Promise<TokenBalance[]> {
  switch (w.chain) {
    case 'ethereum':
    case 'base':
    case 'arbitrum':
    case 'rise':
      return fetchEvmWallet(w.chain, w.address);
    case 'solana':
      return fetchSolanaWallet(w.address);
    case 'bitcoin':
      return fetchBitcoinWallet(w.address);
  }
}

export async function loadPortfolio(wallets: Wallet[]): Promise<PortfolioSnapshot> {
  const fetchedAt = Date.now();
  const results = await Promise.all(
    wallets.map(async (w): Promise<WalletSnapshot> => {
      try {
        const tokens = await fetchOne(w);
        return { walletId: w.id, fetchedAt, tokens, totalUsd: 0 };
      } catch (err: unknown) {
        return {
          walletId: w.id,
          fetchedAt,
          tokens: [],
          totalUsd: 0,
          error: err instanceof Error ? err.message : 'fetch failed',
        };
      }
    }),
  );

  const ids = new Set<string>();
  for (const r of results) for (const t of r.tokens) if (t.coingeckoId) ids.add(t.coingeckoId);
  const prices = await priceForIds(Array.from(ids));

  let totalUsd = 0;
  const byChain: Record<ChainId, number> = {
    ethereum: 0,
    base: 0,
    arbitrum: 0,
    rise: 0,
    solana: 0,
    bitcoin: 0,
  };
  const byGroup: Record<string, number> = {};

  const priced = results.map((r) => {
    const walletById = wallets.find((w) => w.id === r.walletId)!;
    const tokens = applyPrices(r.tokens, prices);
    const walletTotal = tokens.reduce((s, t) => s + (t.usdValue ?? 0), 0);
    totalUsd += walletTotal;
    for (const t of tokens) byChain[t.chain] += t.usdValue ?? 0;
    byGroup[walletById.group] = (byGroup[walletById.group] ?? 0) + walletTotal;
    return { ...r, tokens, totalUsd: walletTotal };
  });

  return { fetchedAt, totalUsd, byChain, byGroup, wallets: priced };
}

export function sortChains(byChain: Record<ChainId, number>): Array<[ChainId, number]> {
  return CHAIN_ORDER.map((id) => [id, byChain[id]] as [ChainId, number]).filter(
    ([, v]) => v > 0,
  );
}
