import React from 'react';
import { cn } from '../../lib/utils';

export const Card = React.forwardRef(function Card({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn(
        'bg-surface border border-secondary/25 rounded-lg shadow-[0_4px_8px_0_rgba(0,0,0,0.4)]',
        className
      )}
      {...props}
    />
  );
});
