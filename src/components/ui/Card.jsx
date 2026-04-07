import React from 'react';
import { cn } from '../../lib/utils';

export const Card = React.forwardRef(function Card({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn(
        'bg-surface border border-border rounded-lg',
        className
      )}
      {...props}
    />
  );
});
