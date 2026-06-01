'use client';

import { useSigmaStore } from '@/lib/store';
import { cx } from '@/lib/format';

interface Props {
  value: string;
  className?: string;
}

export function PrivacyValue({ value, className }: Props) {
  const privacy = useSigmaStore((s) => s.privacyMode);
  return (
    <span className={cx(privacy && 'privacy-blur select-none', className)}>
      {value}
    </span>
  );
}
