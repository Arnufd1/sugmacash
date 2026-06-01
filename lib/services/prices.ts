import type { TokenBalance } from './types';

const COINGECKO = 'https://api.coingecko.com/api/v3';

export async function priceForIds(ids: string[]): Promise<Record<string, number>> {
  if (ids.length === 0) return {};
  const uniq = Array.from(new Set(ids));
  const url = `${COINGECKO}/simple/price?ids=${uniq.join(',')}&vs_currencies=usd`;
  const key = process.env.NEXT_PUBLIC_COINGECKO_KEY;
  const res = await fetch(url, {
    headers: key ? { 'x-cg-demo-api-key': key } : undefined,
  });
  if (!res.ok) return {};
  const json = (await res.json()) as Record<string, { usd: number }>;
  const out: Record<string, number> = {};
  for (const [id, v] of Object.entries(json)) out[id] = v.usd;
  return out;
}

export function applyPrices(
  tokens: TokenBalance[],
  prices: Record<string, number>,
): TokenBalance[] {
  return tokens.map((t) => {
    const id = t.coingeckoId;
    const price = id ? prices[id] ?? 0 : 0;
    return { ...t, usdPrice: price, usdValue: t.amount * price };
  });
}
