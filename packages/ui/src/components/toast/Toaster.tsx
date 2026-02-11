import { X } from 'lucide-react';

import { useToastContext } from './ToastProvider';
import { ToastProviderRadix, ToastRoot, ToastTitle, ToastViewport, ToastClose } from './toast-ui';

export const Toaster = () => {
  const { toasts } = useToastContext();

  return (
    <ToastProviderRadix swipeDirection="right">
      {toasts.map((toast) => (
        <ToastRoot key={toast.id} variant={toast.type}>
          <ToastTitle>{toast.message}</ToastTitle>
          <ToastClose className="absolute right-2 top-2">
            <X size={16} />
          </ToastClose>
        </ToastRoot>
      ))}
      <ToastViewport className="fixed top-4 right-4 z-50 flex flex-col gap-2 outline-none" />
    </ToastProviderRadix>
  );
};
