import { HTMLAttributes, forwardRef } from 'react';
import { cx } from '@/lib/format';

interface Props extends HTMLAttributes<HTMLDivElement> {
  soft?: boolean;
  padded?: boolean;
}

export const GlassCard = forwardRef<HTMLDivElement, Props>(function GlassCard(
  { soft, padded = true, className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx('glass', soft && 'glass-soft', padded && 'p-5', className)}
      {...rest}
    >
      <div className="relative z-[3]">{children}</div>
    </div>
  );
});
