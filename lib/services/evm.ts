import { createPublicClient, http, formatUnits, erc20Abi, getAddress } from 'viem';
import { CHAINS, type ChainId, RISE_TOKEN_ON_ARBITRUM } from '../chains';
import type { TokenBalance } from './types';

function clientFor(chain: ChainId) {
  const cfg = CHAINS[chain];
  return createPublicClient({
    transport: http(cfg.rpcUrl, { batch: true, retryCount: 2 }),
  });
}

const ALCHEMY_TOKEN_CHAINS: ChainId[] = ['ethereum', 'base', 'arbitrum'];

export async function fetchEvmNative(
  chain: ChainId,
  address: string,
): Promise<TokenBalance> {
  const cfg = CHAINS[chain];
  const client = clientFor(chain);
  const wei = await client.getBalance({ address: getAddress(address) });
  return {
    chain,
    symbol: cfg.symbol,
    name: cfg.name,
    decimals: cfg.decimals,
    amount: Number(formatUnits(wei, cfg.decimals)),
    coingeckoId: cfg.coingeckoId,
    contractAddress: null,
    logoColor: cfg.color,
  };
}

interface AlchemyTokenBalance {
  contractAddress: string;
  tokenBalance: string;
}

export async function fetchEvmTokens(
  chain: ChainId,
  address: string,
): Promise<TokenBalance[]> {
  if (!ALCHEMY_TOKEN_CHAINS.includes(chain)) return [];
  const cfg = CHAINS[chain];
  const res = await fetch(cfg.rpcUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'alchemy_getTokenBalances',
      params: [address, 'erc20'],
    }),
  });
  if (!res.ok) return [];
  const json = await res.json();
  const raw: AlchemyTokenBalance[] = json?.result?.tokenBalances ?? [];
  const nonZero = raw.filter(
    (t) => t.tokenBalance && t.tokenBalance !== '0x0' && BigInt(t.tokenBalance) > 0n,
  );

  // Arbitrum: only the RISE token; drop everything else.
  const filtered =
    chain === 'arbitrum' && RISE_TOKEN_ON_ARBITRUM
      ? nonZero.filter((t) => t.contractAddress.toLowerCase() === RISE_TOKEN_ON_ARBITRUM)
      : nonZero;

  if (filtered.length === 0) return [];

  const client = clientFor(chain);
  const metas = await Promise.all(
    filtered.map(async (t) => {
      try {
        const [decimals, symbol, name] = await Promise.all([
          client.readContract({
            address: getAddress(t.contractAddress),
            abi: erc20Abi,
            functionName: 'decimals',
          }),
          client.readContract({
            address: getAddress(t.contractAddress),
            abi: erc20Abi,
            functionName: 'symbol',
          }),
          client.readContract({
            address: getAddress(t.contractAddress),
            abi: erc20Abi,
            functionName: 'name',
          }),
        ]);
        const amount = Number(formatUnits(BigInt(t.tokenBalance), Number(decimals)));
        return {
          chain,
          symbol: String(symbol),
          name: String(name),
          decimals: Number(decimals),
          amount,
          coingeckoId: null,
          contractAddress: t.contractAddress.toLowerCase(),
          logoColor: cfg.color,
        } satisfies TokenBalance;
      } catch {
        return null;
      }
    }),
  );
  return metas.filter((x): x is TokenBalance => x !== null && x.amount > 0);
}

export async function fetchEvmWallet(
  chain: ChainId,
  address: string,
): Promise<TokenBalance[]> {
  if (chain === 'arbitrum') {
    return fetchEvmTokens(chain, address);
  }
  const [native, tokens] = await Promise.all([
    fetchEvmNative(chain, address).catch(() => null),
    fetchEvmTokens(chain, address).catch(() => []),
  ]);
  return [native, ...tokens].filter((x): x is TokenBalance => x !== null);
}
