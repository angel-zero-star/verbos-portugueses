import React from 'react';
import { cn } from '../../lib/utils';

const variants = {
  primary:
    'bg-primary text-white hover:brightness-90 active:brightness-75 shadow-[0_0_0_1px_hsl(var(--primary)/0.4),0_4px_20px_-4px_hsl(var(--primary)/0.5)]',
  ghost:
    'bg-transparent border border-border text-text hover:bg-surface hover:border-muted',
  outline:
    'bg-transparent border border-border text-text-sub hover:text-text hover:border-muted',
  danger:
    'bg-transparent border border-danger text-danger hover:bg-danger/10',
  accent:
    'bg-accent text-bg hover:brightness-95 active:brightness-90 shadow-[0_4px_20px_-4px_hsl(var(--accent)/0.5)]',
};

const sizes = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
  xl: 'h-14 px-8 text-base',
  icon: 'h-10 w-10 p-0',
};

export const Button = React.forwardRef(function Button(
  { className, variant = 'primary', size = 'md', ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
});
