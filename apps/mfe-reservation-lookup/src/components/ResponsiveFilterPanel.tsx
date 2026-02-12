import { Sheet, SheetContent, SheetTrigger, useIsDesktop } from '@packages/ui';
import type { ReactNode } from 'react';

interface ResponsiveFilterPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: ReactNode;
  children: ReactNode;
}

/**
 * ResponsiveFilterPanel
 *
 * Renders Sheet from different sides based on screen size:
 * - Mobile/tablet (<1024px): Bottom sheet for thumb-friendly filtering
 * - Desktop (>=1024px): Right-side drawer for full filter form
 */
export function ResponsiveFilterPanel({
  open,
  onOpenChange,
  trigger,
  children,
}: ResponsiveFilterPanelProps) {
  const isDesktop = useIsDesktop();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        side={isDesktop ? 'right' : 'bottom'}
        className={isDesktop ? 'w-96' : 'max-h-[85vh]'}
      >
        {children}
      </SheetContent>
    </Sheet>
  );
}
