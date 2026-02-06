import { Button } from '@/components/ui/button';
import { Menu, ChevronRight } from 'lucide-react';
import { useLocation } from '@tanstack/react-router';
import { useMemo } from 'react';
import useAuthStore from '@/store/useAuthStore';
import { OfflineIndicator } from '@packages/ui';
import { useNetworkState } from '@/hooks/useNetworkState';

interface HeaderProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

export function Header({ onMenuClick, sidebarOpen }: HeaderProps) {
  const location = useLocation();
  const { userId } = useAuthStore();
  const isOnline = useNetworkState();

  // Generate breadcrumbs from pathname (max 3 levels)
  const breadcrumbs = useMemo(() => {
    const pathname = location.pathname;
    const segments = pathname.split('/').filter(Boolean).slice(0, 3); // Max 3 levels

    return segments.map((segment) => {
      return segment
        .replace(/[^a-zA-Z0-9 ]/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
    });
  }, [location.pathname]);

  const pageName = breadcrumbs[breadcrumbs.length - 1] || 'Dashboard';

  return (
    <>
      <OfflineIndicator isOnline={isOnline} />
      <header className="h-14 sm:h-16 border-b bg-white/80 backdrop-blur-sm flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden min-h-[44px] min-w-[44px]"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            aria-expanded={sidebarOpen}
            aria-controls="main-sidebar"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </Button>
          <div>
            {/* Breadcrumbs */}
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              {breadcrumbs.length > 0 ? (
                breadcrumbs.map((crumb, index) => (
                  <div key={index} className="flex items-center gap-1">
                    {index > 0 && <ChevronRight className="h-4 w-4" aria-hidden="true" />}
                    <span
                      className={
                        index === breadcrumbs.length - 1
                          ? 'font-bold text-foreground text-lg sm:text-xl'
                          : ''
                      }
                    >
                      {crumb}
                    </span>
                  </div>
                ))
              ) : (
                <h1 className="text-lg sm:text-xl font-bold text-foreground">Dashboard</h1>
              )}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
              Welcome back <span className="text-yellow-500 font-medium px-1">{userId}</span>!
              Here's your overview.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:flex items-center gap-3 pl-4 border-l">
            <div className="text-right">
              <p className="text-sm font-medium">GEHDOFF / 01</p>
              <p className="text-xs text-muted-foreground">CASFO15</p>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
