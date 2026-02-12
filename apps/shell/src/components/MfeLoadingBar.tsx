/**
 * MFE Loading Bar
 *
 * Top progress bar that shows during lazy route loading.
 * Provides visual feedback during route transitions and MFE loading.
 */

import { useEffect, useReducer } from 'react';
import { useRouterState } from '@tanstack/react-router';

type LoadingState = {
  progress: number;
  visible: boolean;
};

type LoadingAction =
  | { type: 'START' }
  | { type: 'PROGRESS'; value: number }
  | { type: 'COMPLETE' }
  | { type: 'HIDE' };

function loadingReducer(state: LoadingState, action: LoadingAction): LoadingState {
  switch (action.type) {
    case 'START':
      return { progress: 0, visible: true };
    case 'PROGRESS':
      return { ...state, progress: action.value };
    case 'COMPLETE':
      return { ...state, progress: 100 };
    case 'HIDE':
      return { progress: 0, visible: false };
    default:
      return state;
  }
}

/**
 * Loading Progress Bar Component
 * Animates from left to right during route loading
 */
export function MfeLoadingBar() {
  const isLoading = useRouterState({ select: (s) => s.status === 'pending' });
  const [{ progress, visible }, dispatch] = useReducer(loadingReducer, {
    progress: 0,
    visible: false,
  });

  useEffect(() => {
    if (isLoading) {
      dispatch({ type: 'START' });

      // Simulate progress animation
      const timer1 = setTimeout(() => dispatch({ type: 'PROGRESS', value: 30 }), 50);
      const timer2 = setTimeout(() => dispatch({ type: 'PROGRESS', value: 60 }), 200);
      const timer3 = setTimeout(() => dispatch({ type: 'PROGRESS', value: 80 }), 400);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    } else {
      dispatch({ type: 'COMPLETE' });

      const hideTimer = setTimeout(() => dispatch({ type: 'HIDE' }), 300);

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
          transition:
            progress === 100 ? 'width 200ms ease-out' : 'width 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
    </div>
  );
}
