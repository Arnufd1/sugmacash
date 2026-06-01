# SigmaCash — PWA

Premium dark-glass crypto net-worth tracker. Aggregates read-only wallet balances across **Ethereum, Base, Solana, Bitcoin**, **RISE Chain L2**, and the **RISE ERC-20 on Arbitrum**.

Runs as a Progressive Web App: add it to your iPhone home screen, looks and feels native, no AltStore, no expiration, no PC dependency.

---

## How to ship it to your iPhone (10 minutes, total)

### Step 1 — Push this folder to GitHub (2 min)

If you don't already have the `sigmacash-web` folder in a GitHub repo:

```powershell
cd "c:\Users\Arnau\Desktop\IOS sigma app\sigmacash-web"
git init
git add .
git commit -m "SigmaCash PWA v1"
git branch -M main
git remote add origin https://github.com/Arnufd1/sigmacash-web.git
git push -u origin main
```

(Or reuse the existing `sugmacash` repo — delete its contents, copy these files in, commit, push.)

### Step 2 — Connect to Vercel (3 min, free)

1. Go to **https://vercel.com/signup** → sign in with GitHub
2. Click **"Add New… → Project"**
3. Pick your `sigmacash-web` repo → **Import**
4. **Framework Preset**: Next.js (auto-detected)
5. Expand **Environment Variables** and add:
   - `NEXT_PUBLIC_ALCHEMY_KEY` — get free at https://dashboard.alchemy.com (1 min)
   - `NEXT_PUBLIC_RISE_RPC` → `https://testnet.riselabs.xyz`
   - `NEXT_PUBLIC_RISE_TOKEN_ARBITRUM` → the RISE ERC-20 contract on Arbitrum (lowercase)
   - `NEXT_PUBLIC_HELIUS_KEY` (optional, free at https://dashboard.helius.dev)
6. Click **Deploy**
7. Wait ~90 seconds → Vercel shows your live URL, e.g. `sigmacash-web.vercel.app`

### Step 3 — Add to iPhone home screen (1 min)

1. On iPhone, open **Safari** (must be Safari — Chrome doesn't support PWA installs on iOS)
2. Visit your Vercel URL
3. Tap the **share button** (square with up arrow at the bottom)
4. Scroll down → tap **"Add to Home Screen"**
5. Edit the name if you want → tap **Add**
6. The gold lion icon appears on your home screen

That's it. Tap the icon — it opens fullscreen, no Safari URL bar, looks like a native app.

### Step 4 — Updates from now on

Push code to GitHub → Vercel auto-deploys in ~1 min → next time you open the app it has the new version. No re-install, no review, no expiration.

---

## What you get

- **Liquid-glass UI** — CSS `backdrop-filter` blur + gold-gradient borders + animated drifting blobs. Looks identical to a native iOS app on modern Safari.
- **Hero net worth** — Playfair Display gold-gradient hero number, animated on update.
- **Privacy mode** — tap the eye icon to blur all values (perfect for showing the app in public).
- **Per-group / per-chain / per-wallet breakdowns** — drill from total to individual token.
- **Auto-refresh** — every 60s, plus tap the refresh button anytime.
- **Persists locally** — wallet addresses live in your browser localStorage on this device only. No server, no analytics.
- **EUR + USD** — toggle currency in Settings.

## Chains

| Chain | What's fetched | API |
|---|---|---|
| Ethereum | ETH + all ERC-20 token balances | Alchemy |
| Base | ETH + all ERC-20 token balances | Alchemy |
| Arbitrum | **Only the RISE ERC-20** (configured via `NEXT_PUBLIC_RISE_TOKEN_ARBITRUM`) | Alchemy |
| RISE Chain | Native RISE balance | Custom RPC (`NEXT_PUBLIC_RISE_RPC`) |
| Solana | SOL + all SPL tokens | Helius / public RPC |
| Bitcoin | BTC balance (mainchain + mempool) | Blockstream (no key) |

## Local dev (optional)

```powershell
npm install
copy .env.example .env.local
notepad .env.local       # fill in your keys
npm run dev
```

Open http://localhost:3000.

## File map

```
sigmacash-web/
├── app/
│   ├── layout.tsx              root layout, fonts, PWA meta tags
│   ├── page.tsx                portfolio (home)
│   ├── wallets/page.tsx        add/remove wallets
│   ├── settings/page.tsx       currency, privacy, FX
│   ├── manifest.ts             PWA manifest
│   ├── providers.tsx           react-query
│   └── globals.css             tailwind + glass styles
├── components/
│   ├── GlassCard.tsx           backdrop-filter + gold border
│   ├── AnimatedBackdrop.tsx    drifting gold blobs
│   ├── BottomNav.tsx           glass tab bar
│   ├── ChainPill.tsx
│   ├── AddWalletDialog.tsx     bottom-sheet modal
│   ├── PrivacyValue.tsx
│   └── Skeleton.tsx
├── lib/
│   ├── chains.ts               RPC config
│   ├── format.ts               currency / address formatters
│   ├── store.ts                Zustand + localStorage
│   ├── usePortfolio.ts         react-query hook
│   └── services/
│       ├── evm.ts              Alchemy ETH/Base/Arbitrum/RISE
│       ├── solana.ts           Helius / public RPC
│       ├── bitcoin.ts          Blockstream
│       ├── prices.ts           CoinGecko
│       ├── portfolio.ts        orchestrator
│       └── types.ts
├── public/
│   ├── icon.png                gold lion app icon
│   ├── apple-touch-icon.png    home screen icon
│   └── logo-mark.png           black lion Σ
├── app.json
├── next.config.mjs
├── tailwind.config.ts
└── package.json
```

## Why a PWA instead of native iOS

| | Native iOS app via AltStore | PWA |
|---|---|---|
| Cost | $0 (free Apple ID) | $0 |
| Setup time | ~45 min (iTunes, AltServer, GitHub Actions, sideload) | ~10 min (Vercel, Safari, home screen) |
| Re-sign every 7 days | Yes (PC must run AltServer) | Never |
| Updates | Re-build → re-install via AltStore | `git push` → live in 1 min |
| Looks native | Yes | Yes (fullscreen, custom icon, status bar) |
| Face ID | Yes | No (PIN fallback) |
| Native blur (iOS 26 Liquid Glass) | Yes | Near-identical via `backdrop-filter` |
| Works offline | Yes | Yes (with service worker — prices stale) |
| 3-app sideload limit | Yes | No |

For a portfolio tracker that just displays numbers, the PWA route is objectively the better choice unless you specifically need Face ID or true Liquid Glass.

## Troubleshooting

| Symptom | Fix |
|---|---|
| Vercel build fails | Check that env vars are set in Vercel dashboard, redeploy |
| RISE on Arbitrum shows 0 | Verify `NEXT_PUBLIC_RISE_TOKEN_ARBITRUM` is the right contract address, lowercase |
| Home screen icon is generic | Hard refresh Safari, remove app, re-add to home screen |
| "Add to Home Screen" missing | You're not in Safari — Chrome iOS can't do it. Switch to Safari. |
| Hero number font looks plain | next/font is fetching Playfair Display — wait one full page load |
| 429 from CoinGecko | Add `NEXT_PUBLIC_COINGECKO_KEY` (free) at https://www.coingecko.com/en/api/pricing |

## Privacy

- Wallet addresses live in `localStorage` on the device. Never sent to any server.
- RPC calls go directly from your phone to Alchemy / Helius / Blockstream / CoinGecko — these providers see the addresses you query (same as any blockchain explorer).
- No analytics, no tracking, no user account.
