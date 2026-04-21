import React from 'react';
import { cn } from '../../lib/utils';

export const Card = React.forwardRef(function Card({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn(
        'bg-surface border border-border rounded-lg shadow-[0_5px_13px_0_hsl(var(--shadow)/0.2)]',
        className
      )}
      {...props}
    />
  );
});
