// packages/ui/src/components/toast/toast-ui.tsx
import * as ToastPrimitive from '@radix-ui/react-toast';
import clsx from 'clsx';
// import { X } from "lucide-react";

export const ToastProviderRadix = ToastPrimitive.Provider;
export const ToastViewport = ToastPrimitive.Viewport;

export const ToastRoot = ({
  variant = 'info',
  ...props
}: ToastPrimitive.ToastProps & { variant?: 'success' | 'error' | 'info' | 'warning' }) => (
  <ToastPrimitive.Root
    {...props}
    className={clsx(
      'relative flex w-80 items-start gap-2 rounded-lg border p-4 shadow-lg',
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      {
        'bg-green-50 border-green-200': variant === 'success',
        'bg-red-50 border-red-200': variant === 'error',
        'bg-yellow-50 border-yellow-200': variant === 'warning',
        'bg-white border-gray-200': variant === 'info',
      },
    )}
  />
);

export const ToastTitle = ToastPrimitive.Title;
export const ToastDescription = ToastPrimitive.Description;
export const ToastClose = ToastPrimitive.Close;
