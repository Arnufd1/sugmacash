export type ChainId =
  | 'ethereum'
  | 'base'
  | 'arbitrum'
  | 'rise'
  | 'solana'
  | 'bitcoin';

export type ChainKind = 'evm' | 'solana' | 'bitcoin';

export interface ChainConfig {
  id: ChainId;
  kind: ChainKind;
  name: string;
  symbol: string;
  coingeckoId: string;
  decimals: number;
  rpcUrl: string;
  explorer: string;
  color: string;
  chainIdNum?: number;
}

const ALCHEMY_KEY = process.env.NEXT_PUBLIC_ALCHEMY_KEY ?? 'demo';
const RISE_RPC = process.env.NEXT_PUBLIC_RISE_RPC ?? 'https://testnet.riselabs.xyz';

export const CHAINS: Record<ChainId, ChainConfig> = {
  ethereum: {
    id: 'ethereum',
    kind: 'evm',
    name: 'Ethereum',
    symbol: 'ETH',
    coingeckoId: 'ethereum',
    decimals: 18,
    rpcUrl: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    explorer: 'https://etherscan.io',
    color: '#627EEA',
    chainIdNum: 1,
  },
  base: {
    id: 'base',
    kind: 'evm',
    name: 'Base',
    symbol: 'ETH',
    coingeckoId: 'ethereum',
    decimals: 18,
    rpcUrl: `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    explorer: 'https://basescan.org',
    color: '#0052FF',
    chainIdNum: 8453,
  },
  arbitrum: {
    id: 'arbitrum',
    kind: 'evm',
    name: 'Arbitrum (RISE)',
    symbol: 'ETH',
    coingeckoId: 'ethereum',
    decimals: 18,
    rpcUrl: `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    explorer: 'https://arbiscan.io',
    color: '#28A0F0',
    chainIdNum: 42161,
  },
  rise: {
    id: 'rise',
    kind: 'evm',
    name: 'RISE Chain',
    symbol: 'RISE',
    coingeckoId: 'rise',
    decimals: 18,
    rpcUrl: RISE_RPC,
    explorer: 'https://explorer.testnet.riselabs.xyz',
    color: '#FFD700',
  },
  solana: {
    id: 'solana',
    kind: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    coingeckoId: 'solana',
    decimals: 9,
    rpcUrl: process.env.NEXT_PUBLIC_HELIUS_KEY
      ? `https://mainnet.helius-rpc.com/?api-key=${process.env.NEXT_PUBLIC_HELIUS_KEY}`
      : 'https://api.mainnet-beta.solana.com',
    explorer: 'https://solscan.io',
    color: '#14F195',
  },
  bitcoin: {
    id: 'bitcoin',
    kind: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    coingeckoId: 'bitcoin',
    decimals: 8,
    rpcUrl: 'https://blockstream.info/api',
    explorer: 'https://mempool.space',
    color: '#F7931A',
  },
};

export const RISE_TOKEN_ON_ARBITRUM =
  (process.env.NEXT_PUBLIC_RISE_TOKEN_ARBITRUM ?? '').toLowerCase();

export const CHAIN_ORDER: ChainId[] = [
  'ethereum',
  'base',
  'arbitrum',
  'rise',
  'solana',
  'bitcoin',
];
