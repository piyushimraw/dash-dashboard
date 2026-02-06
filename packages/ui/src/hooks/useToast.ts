import { useEffect, useState } from 'react';

type ToastVariant = 'success' | 'error' | 'info';

export type Toast = {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
};

let listeners: React.Dispatch<React.SetStateAction<Toast[]>>[] = [];
let toasts: Toast[] = [];

function emit() {
  listeners.forEach((l) => l([...toasts]));
}

export function toast(t: Omit<Toast, 'id'>) {
  const id = crypto.randomUUID();

  toasts = [...toasts, { ...t, id }];
  emit();

  setTimeout(() => {
    toasts = toasts.filter((toast) => toast.id !== id);
    emit();
  }, 4000);
}

export function useToastStore() {
  const [state, setState] = useState<Toast[]>(toasts);

  useEffect(() => {
    listeners.push(setState);
    return () => {
      listeners = listeners.filter((l) => l !== setState);
    };
  }, []);

  return state;
}
