import { CHAINS } from '../chains';
import type { TokenBalance } from './types';

interface BlockstreamAddress {
  chain_stats: { funded_txo_sum: number; spent_txo_sum: number };
  mempool_stats: { funded_txo_sum: number; spent_txo_sum: number };
}

export async function fetchBitcoinWallet(address: string): Promise<TokenBalance[]> {
  const cfg = CHAINS.bitcoin;
  const res = await fetch(`${cfg.rpcUrl}/address/${address}`);
  if (!res.ok) throw new Error(`Blockstream ${res.status}`);
  const data: BlockstreamAddress = await res.json();
  const sats =
    data.chain_stats.funded_txo_sum -
    data.chain_stats.spent_txo_sum +
    data.mempool_stats.funded_txo_sum -
    data.mempool_stats.spent_txo_sum;
  return [
    {
      chain: 'bitcoin',
      symbol: 'BTC',
      name: 'Bitcoin',
      decimals: 8,
      amount: sats / 1e8,
      coingeckoId: 'bitcoin',
      contractAddress: null,
      logoColor: cfg.color,
    },
  ];
}
