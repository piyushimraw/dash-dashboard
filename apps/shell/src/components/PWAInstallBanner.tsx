import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePWAInstall } from '@/hooks/usePWAInstall';

export function PWAInstallBanner() {
  const { showBanner, promptInstall, dismiss } = usePWAInstall();

  if (!showBanner) {
    return null;
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-primary text-primary-foreground shadow-lg py-4 animate-slideUp"
      role="dialog"
      aria-label="Install application prompt"
    >
      <div className="container mx-auto px-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {/* App icon preview */}
          <div className="flex-shrink-0 w-10 h-10 bg-brand-yellow rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-foreground"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="font-medium text-sm truncate">
              Install app
            </p>
            <p className="text-xs opacity-90 truncate">
              Works offline - Faster access
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="default"
            size="sm"
            onClick={promptInstall}
            className="whitespace-nowrap bg-primary-foreground text-primary font-semibold hover:bg-primary-foreground/90"
          >
            Install
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={dismiss}
            className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/10"
            aria-label="Dismiss install prompt"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
