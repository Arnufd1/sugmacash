import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { CHAINS } from '../chains';
import type { TokenBalance } from './types';

const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

export async function fetchSolanaWallet(address: string): Promise<TokenBalance[]> {
  const cfg = CHAINS.solana;
  const conn = new Connection(cfg.rpcUrl, 'confirmed');
  const pk = new PublicKey(address);

  const [lamports, parsedTokens] = await Promise.all([
    conn.getBalance(pk).catch(() => 0),
    conn
      .getParsedTokenAccountsByOwner(pk, { programId: TOKEN_PROGRAM_ID })
      .catch(() => ({ value: [] })),
  ]);

  const sol: TokenBalance = {
    chain: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    decimals: 9,
    amount: lamports / LAMPORTS_PER_SOL,
    coingeckoId: 'solana',
    contractAddress: null,
    logoColor: cfg.color,
  };

  const spl: TokenBalance[] = parsedTokens.value
    .map((acc) => {
      const info = acc.account.data.parsed.info;
      const amount = info.tokenAmount.uiAmount as number;
      if (!amount || amount <= 0) return null;
      return {
        chain: 'solana' as const,
        symbol: info.mint.slice(0, 4).toUpperCase(),
        name: `SPL ${info.mint.slice(0, 6)}`,
        decimals: info.tokenAmount.decimals,
        amount,
        coingeckoId: null,
        contractAddress: info.mint,
        logoColor: cfg.color,
      };
    })
    .filter((t): t is TokenBalance => t !== null);

  return [sol, ...spl];
}
