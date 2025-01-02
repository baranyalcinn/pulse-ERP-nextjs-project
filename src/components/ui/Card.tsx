import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
} 