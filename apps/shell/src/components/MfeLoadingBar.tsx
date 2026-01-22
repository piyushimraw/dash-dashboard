/**
 * MFE Loading Bar
 *
 * Top progress bar that shows during lazy route loading.
 * Provides visual feedback during route transitions and MFE loading.
 */

import { useEffect, useState } from 'react';
import { useRouterState } from '@tanstack/react-router';

/**
 * Loading Progress Bar Component
 * Animates from left to right during route loading
 */
export function MfeLoadingBar() {
  const isLoading = useRouterState({ select: (s) => s.status === 'pending' });
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isLoading) {
      // Show bar and start progress
      setVisible(true);
      setProgress(0);

      // Simulate progress animation
      const timer1 = setTimeout(() => setProgress(30), 50);
      const timer2 = setTimeout(() => setProgress(60), 200);
      const timer3 = setTimeout(() => setProgress(80), 400);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    } else {
      // Complete progress and hide
      setProgress(100);

      const hideTimer = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 300);

      return () => clearTimeout(hideTimer);
    }
  }, [isLoading]);

  if (!visible && progress === 0) {
    return null;
  }

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
      aria-label="Page loading progress"
      className="fixed top-0 left-0 right-0 z-50 h-1"
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 200ms ease-in-out',
      }}
    >
      <div
        className="h-full bg-yellow-500 shadow-lg shadow-yellow-500/50"
        style={{
          width: `${progress}%`,
          transition: progress === 100
            ? 'width 200ms ease-out'
            : 'width 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
    </div>
  );
}
