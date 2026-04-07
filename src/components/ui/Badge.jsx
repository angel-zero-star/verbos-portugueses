import React from 'react';
import { cn } from '../../lib/utils';

const variants = {
  presente: 'bg-secondary/10 text-text border-secondary/25',
  passado: 'bg-warn/15 text-warn border-warn/30',
  accent: 'bg-accent/15 text-accent border-accent/30',
  neutral: 'bg-surface text-text-sub border-border',
};

export function Badge({ className, variant = 'neutral', ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-md border text-[11px] font-mono-ui font-semibold uppercase tracking-[0.1em]',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
