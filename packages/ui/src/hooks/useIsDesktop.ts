import { useState, useEffect } from 'react';

/**
 * Detects if viewport is at or above the specified breakpoint.
 * Uses JavaScript instead of Tailwind responsive classes due to Tailwind v4 issues.
 * @param breakpoint - The minimum width in pixels (default: 1024 for lg breakpoint)
 * @returns true if viewport width >= breakpoint
 */
export function useIsDesktop(breakpoint: number = 1024): boolean {
  // Initialize to true for SSR safety
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkWidth = () => setIsDesktop(window.innerWidth >= breakpoint);
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, [breakpoint]);

  return isDesktop;
}
