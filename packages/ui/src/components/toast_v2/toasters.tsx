import { useToastStore } from '../../hooks/useToast'; // relative to toast folder
import {
  ToastProvider,
  ToastViewport,
  ToastRoot,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from './toast';

export function Toaster() {
  const toasts = useToastStore();

  return (
    <ToastProvider swipeDirection="right">
      {toasts.map((toast) => (
        <ToastRoot key={toast.id} variant={toast.variant}>
          {toast.title && <ToastTitle className="font-medium">{toast.title}</ToastTitle>}
          {toast.description && (
            <ToastDescription className="text-sm text-muted-foreground">
              {toast.description}
            </ToastDescription>
          )}
          <ToastClose />
        </ToastRoot>
      ))}
      <ToastViewport className="fixed top-4 right-4 z-50 flex flex-col gap-2 outline-none" />
    </ToastProvider>
  );
}
