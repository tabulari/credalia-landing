'use client';

import { useSiteUi, type ApplyOrigin } from './site-ui';
import { Button, type buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { VariantProps } from 'class-variance-authority';

export function ApplyButton({
  origin = 'direct',
  className,
  children,
  onClick,
  variant,
  size,
  ...rest
}: Omit<React.ComponentProps<typeof Button>, 'onClick'> & {
  origin?: ApplyOrigin;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  variant?: VariantProps<typeof buttonVariants>['variant'];
  size?: VariantProps<typeof buttonVariants>['size'];
}) {
  const { openApply } = useSiteUi();
  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={cn(className)}
      onClick={(e) => {
        onClick?.(e as React.MouseEvent<HTMLButtonElement>);
        openApply(origin);
      }}
      {...rest}
    >
      {children}
    </Button>
  );
}
