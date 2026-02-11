import { createContext, useContext, useEffect, useState } from 'react';
import { MfeEventNames, NotificationEvent, eventBus } from '@packages/event-bus';

export type Toast = {
  id: string;
  type: NotificationEvent['type'];
  message: string;
  duration: number;
};

type ToastContextValue = {
  toasts: Toast[];
};

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handler = (event: NotificationEvent) => {
      const id = crypto.randomUUID();
      const toast: Toast = {
        id,
        type: event.type,
        message: event.message,
        duration: event.duration ?? 4000,
      };
      setToasts((prev) => [...prev, toast]);

      // auto remove after duration
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, toast.duration);
    };

    eventBus.on(MfeEventNames.NotificationShow, handler);

    return () => eventBus.off(MfeEventNames.NotificationShow, handler);
  }, []);

  return <ToastContext.Provider value={{ toasts }}>{children}</ToastContext.Provider>;
};

export const useToastContext = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToastContext must be used inside ToastProvider');
  return ctx;
};
