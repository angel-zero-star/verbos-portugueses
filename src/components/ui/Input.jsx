import React from 'react';
import { cn } from '../../lib/utils';

export const Input = React.forwardRef(function Input({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        'w-full h-12 px-4 bg-surface border border-border rounded-md text-text text-base placeholder:text-text-sub outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:opacity-70 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    />
  );
});
