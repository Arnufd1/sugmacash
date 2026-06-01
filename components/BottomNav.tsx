'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Gem, Wallet, Settings } from 'lucide-react';
import { cx } from '@/lib/format';

const TABS = [
  { href: '/', icon: Gem, label: 'Apex' },
  { href: '/wallets', icon: Wallet, label: 'Wallets' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export function BottomNav() {
  const path = usePathname();
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 safe-bottom px-5 pb-3 pt-2"
      aria-label="Primary"
    >
      <div className="glass mx-auto flex h-16 max-w-md items-center justify-around rounded-full px-2">
        {TABS.map(({ href, icon: Icon, label }) => {
          const active = href === '/' ? path === '/' : path.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cx(
                'tap relative flex h-12 w-20 flex-col items-center justify-center rounded-full transition-colors',
                active ? 'text-gold' : 'text-cream-dim',
              )}
              aria-label={label}
            >
              {active && (
                <span
                  className="absolute inset-1 rounded-full"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(255,213,90,0.18) 0%, transparent 70%)',
                  }}
                />
              )}
              <Icon size={22} strokeWidth={2.2} className="relative z-10" />
              <span className="relative z-10 mt-0.5 text-[10px] font-semibold tracking-wider">
                {label.toUpperCase()}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
