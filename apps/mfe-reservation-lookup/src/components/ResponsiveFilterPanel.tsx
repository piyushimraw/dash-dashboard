import {
  Sheet,
  SheetContent,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useIsDesktop,
} from "@packages/ui";
import type { ReactNode } from "react";

interface ResponsiveFilterPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: ReactNode;
  children: ReactNode;
}

/**
 * ResponsiveFilterPanel
 *
 * Renders Sheet (bottom) on mobile/tablet (<1024px) and Popover on desktop (>=1024px).
 *
 * Decision rationale (per 06-CONTEXT.md):
 * - Mobile/tablet: Bottom sheet is thumb-friendly for filtering
 * - Desktop: Popover provides inline contextual access near filter button
 */
export function ResponsiveFilterPanel({
  open,
  onOpenChange,
  trigger,
  children,
}: ResponsiveFilterPanelProps) {
  const isDesktop = useIsDesktop();

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        <PopoverContent
          align="end"
          className="w-80 max-h-[85vh] overflow-y-auto"
        >
          {children}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {trigger}
      <SheetContent side="bottom" className="max-h-[85vh]">
        {children}
      </SheetContent>
    </Sheet>
  );
}
