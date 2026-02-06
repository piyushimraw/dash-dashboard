import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  ChevronDown,
  LogOut,
  Search,
  Users,
  UserCircle,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { menuItems, type MenuItemType } from '@/config/sidebar-menu.config';
import { iconMap } from '@/icons/iconMap';
import useAuthStore from '@/store/useAuthStore';

interface SidebarProps {
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const quickLinks = [
  {
    label: 'Reservation Lookup:',
    icon: <Search className="h-4 w-4" aria-hidden="true" />,
    pathname: '/reservation_lookup',
  },
  {
    label: 'Scan & Payment Integration',
    icon: <Users className="h-4 w-4" aria-hidden="true" />,
    pathname: '',
  },
];

function SidebarMenuItem({
  item,
  onItemClick,
  collapsed,
}: {
  item: MenuItemType;
  onItemClick?: () => void;
  collapsed: boolean;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuId = `menu-${item.label.replace(/\s+/g, '-').toLowerCase()}`;

  useEffect(() => {
    if (item.children?.some((v) => v?.pathname === location.pathname)) {
      setIsOpen(true);
    }
  }, [location, item]);

  if (!item.children) {
    return (
      <div className="bg-gray-200">
        <Button
          variant="sidebar"
          size="sidebar"
          onClick={onItemClick}
          className="min-h-[44px] touch-manipulation"
        >
          {item.icon}
          {!collapsed && <span>{item.label}</span>}
        </Button>
      </div>
    );
  }

  const Icon = iconMap[item.icon as keyof typeof iconMap];

  // In collapsed mode, don't show expandable items
  if (collapsed) {
    return (
      <Button
        variant="sidebar"
        size="sidebar"
        className="w-full justify-center min-h-[44px] touch-manipulation"
        title={item.label}
      >
        <Icon />
      </Button>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="sidebar"
          size="sidebar"
          className="w-full justify-between min-h-[44px] touch-manipulation"
          aria-expanded={isOpen}
          aria-controls={menuId}
        >
          <span className="flex items-start gap-3 min-w-0 text-left">
            <Icon />
            <span className="break-words whitespace-normal">{item.label}</span>
          </span>

          <ChevronDown
            className={cn(
              'h-4 w-4 text-sidebar-muted transition-transform duration-200',
              isOpen && 'rotate-180',
            )}
            aria-hidden="true"
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent
        id={menuId}
        className="overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-up data-[state=open]:slide-down"
      >
        <ul className="ml-4 mt-1 space-y-0.5 border-l border-sidebar-border pl-3" role="menu">
          {item.children.map((child, index) => {
            const Icon = iconMap[child.icon as keyof typeof iconMap];
            return (
              <li key={index} role="none">
                <Button
                  variant="ghost"
                  size="sidebar"
                  onClick={() => {
                    if (child?.pathname) navigate({ to: child.pathname });
                    if (onItemClick) onItemClick();
                  }}
                  className={cn(
                    location.pathname === child.pathname && 'bg-sidebar-accent',
                    'w-full min-w-0 justify-start text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent min-h-[44px] touch-manipulation pl-3',
                  )}
                  role="menuitem"
                >
                  {child.icon && (
                    <span className="mr-2" aria-hidden="true">
                      <Icon />
                    </span>
                  )}
                  <span className="break-words whitespace-normal">{child.label}</span>
                </Button>
              </li>
            );
          })}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function Sidebar({ onLogout, isOpen, onClose }: SidebarProps) {
  const hasAnyRole = useAuthStore((state) => state.hasAnyRole);
  const location = useLocation();
  const visibleItems = menuItems.filter((item) => hasAnyRole(item.roles));

  // Track if we're on desktop (lg breakpoint = 1024px)
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });

  // Update isDesktop on resize
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Desktop collapsed state with localStorage persistence
  const [collapsedPreference, setCollapsedPreference] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sidebar-collapsed');
      return stored === 'true';
    }
    return false;
  });

  // Only apply collapsed state on desktop
  const collapsed = isDesktop && collapsedPreference;

  // Persist collapsed state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-collapsed', collapsedPreference.toString());
    }
  }, [collapsedPreference]);

  const toggleCollapsed = () => {
    setCollapsedPreference((prev) => !prev);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden touch-manipulation"
          onClick={onClose}
          onKeyDown={(e) => e.key === 'Escape' && onClose()}
          role="button"
          tabIndex={0}
          aria-label="Close navigation menu"
        />
      )}

      {/* Sidebar */}
      <aside
        id="main-sidebar"
        role="navigation"
        aria-label="Main navigation"
        aria-hidden={!isOpen && typeof window !== 'undefined' && window.innerWidth < 1024}
        className={cn(
          'h-screen no-scrollbar fixed lg:static inset-y-0 top-0 left-0 z-50 bg-sidebar flex flex-col shadow-xl transition-all duration-300 lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          // Mobile always full width, desktop respects collapsed state
          'w-64',
          collapsed && 'lg:w-16',
        )}
      >
        {/* Logo & Brand */}
        <div className="p-5 border-b border-sidebar-border flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-sidebar-primary flex items-center justify-center shadow-lg">
                <span className="font-bold text-lg text-sidebar-primary-foreground">H</span>
              </div>
              <div>
                <Link to="/dashboard">
                  <h1 className="font-bold text-lg text-sidebar-foreground tracking-tight">
                    Hertz DASH
                  </h1>
                </Link>
                <p className="text-xs text-sidebar-muted">v3.21.0-14.11</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="mx-auto">
              <div className="h-10 w-10 rounded-xl bg-sidebar-primary flex items-center justify-center shadow-lg">
                <span className="font-bold text-lg text-sidebar-primary-foreground">H</span>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-sidebar-foreground hover:bg-sidebar-accent min-h-[44px] min-w-[44px] touch-manipulation"
            onClick={onClose}
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>

        {/* Desktop Collapse Toggle */}
        <div className="hidden lg:flex justify-end px-2 py-2 border-b border-sidebar-border">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapsed}
            className="h-8 w-8 text-sidebar-muted hover:bg-sidebar-accent"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            ) : (
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            )}
          </Button>
        </div>

        {/* User Info */}
        <div
          className="px-4 py-3 border-b border-sidebar-border"
          role="region"
          aria-label="User information"
        >
          <div
            className={cn(
              'flex items-center rounded-lg bg-sidebar-accent/50 p-2.5',
              collapsed ? 'justify-center' : 'gap-3',
            )}
          >
            <div
              className="h-9 w-9 rounded-full bg-sidebar-primary/20 flex items-center justify-center flex-shrink-0"
              aria-hidden="true"
            >
              <UserCircle className="h-5 w-5 text-sidebar-primary" />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">GEHDOFF</p>
                <p className="text-xs text-sidebar-muted">Location: 01</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        {!collapsed && (
          <div className="px-3 py-3 border-b border-sidebar-border">
            <p className="px-3 mb-2 text-xs font-semibold text-sidebar-muted uppercase tracking-wider">
              Quick Access
            </p>
            <div className="space-y-0.5">
              {quickLinks.map((link, index) => (
                <Link key={index} to={link?.pathname}>
                  <Button
                    variant="sidebar"
                    size="sidebar"
                    onClick={onClose}
                    className={cn(
                      location.pathname === link.pathname && 'bg-sidebar-accent',
                      'min-h-[44px] touch-manipulation',
                    )}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Main Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-3">
          {!collapsed && (
            <p className="px-3 mb-2 text-xs font-semibold text-sidebar-muted uppercase tracking-wider">
              Navigation
            </p>
          )}
          <nav className="space-y-0.5">
            {visibleItems.map((item, index) => (
              <SidebarMenuItem
                key={index}
                item={item}
                onItemClick={onClose}
                collapsed={collapsed}
              />
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-sidebar-border">
          <Button
            variant="sidebar"
            size="sidebar"
            onClick={onLogout}
            className={cn(
              'w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 min-h-[44px] touch-manipulation',
              collapsed && 'justify-center',
            )}
            aria-label="Sign out of your account"
            title="Sign Out"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            {!collapsed && <span>Sign Out</span>}
          </Button>
        </div>
      </aside>
    </>
  );
}
