import type { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import type { MedicineStatus } from '../types';

type Variant = MedicineStatus | 'neutral';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

const VARIANTS: Record<Variant, string> = {
  neutral: 'bg-zinc-100 text-zinc-700',
  ok: 'bg-zinc-100 text-zinc-700',
  'low-stock': 'bg-amber-50 text-amber-700',
  'expiring-soon': 'bg-orange-50 text-orange-700',
  expired: 'bg-red-50 text-red-700',
};

export function Badge({
  variant = 'neutral',
  className,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        VARIANTS[variant],
        className,
      )}
      {...rest}
    />
  );
}
