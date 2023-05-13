import * as React from 'react';
import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center border rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'bg-primary border border-transparent text-primary-foreground border-r-2 hover:border-gray-400 dark:hover:border-gray-400 hover:scale-110',
        secondary:
          'bg-secondary  border-transparent border border-transparent border-r-2 hover:border-white  border-transparent text-secondary-foreground hover:scale-110',
        destructive:
          'bg-destructive border border-transparent  text-destructive-foreground hover:border-gray-400 dark:hover:border-gray-400 hover:scale-110',
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
