import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#06060A',
          soft: '#0E0E14',
          card: 'rgba(255,255,255,0.04)',
        },
        cream: {
          DEFAULT: '#F5F1E1',
          muted: 'rgba(245,241,225,0.55)',
          dim: 'rgba(245,241,225,0.35)',
        },
        gold: {
          DEFAULT: '#FFD55A',
          hi: '#FFF1B8',
          deep: '#C8961E',
        },
        rise: '#FFD700',
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      animation: {
        'drift-1': 'drift1 22s ease-in-out infinite',
        'drift-2': 'drift2 28s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'pulse-soft': 'pulseSoft 2.5s ease-in-out infinite',
      },
      keyframes: {
        drift1: {
          '0%, 100%': { transform: 'translate(-20%, -10%) scale(1)' },
          '50%': { transform: 'translate(30%, 20%) scale(1.25)' },
        },
        drift2: {
          '0%, 100%': { transform: 'translate(40%, 50%) scale(1.2)' },
          '50%': { transform: 'translate(-10%, 30%) scale(0.95)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #FFF1B8 0%, #FFD55A 45%, #C8961E 100%)',
        'gold-stroke': 'linear-gradient(135deg, rgba(255,213,90,0.5), rgba(255,213,90,0.05) 50%, rgba(255,213,90,0.3))',
      },
    },
  },
  plugins: [],
};

export default config;
