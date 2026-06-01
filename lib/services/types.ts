import type { ChainId } from '../chains';

export interface TokenBalance {
  chain: ChainId;
  symbol: string;
  name: string;
  decimals: number;
  amount: number;
  coingeckoId: string | null;
  contractAddress: string | null;
  logoColor: string;
  usdPrice?: number;
  usdValue?: number;
}

export interface Wallet {
  id: string;
  label: string;
  group: string;
  chain: ChainId;
  address: string;
  createdAt: number;
}

export interface WalletSnapshot {
  walletId: string;
  fetchedAt: number;
  tokens: TokenBalance[];
  totalUsd: number;
  error?: string;
}

export interface PortfolioSnapshot {
  fetchedAt: number;
  totalUsd: number;
  byChain: Record<ChainId, number>;
  byGroup: Record<string, number>;
  wallets: WalletSnapshot[];
}
