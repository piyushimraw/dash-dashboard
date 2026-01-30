import * as ToastPrimitive from "@radix-ui/react-toast";
import { X } from "lucide-react";
import clsx from "clsx";

export const ToastProvider = ToastPrimitive.Provider;
export const ToastViewport = ToastPrimitive.Viewport;

export function ToastRoot({
  variant = "info",
  ...props
}: ToastPrimitive.ToastProps & {
  variant?: "success" | "error" | "info";
}) {
  return (
    <ToastPrimitive.Root
      {...props}
      className={clsx(
        "relative flex w-80 items-start gap-2 rounded-lg border p-4 shadow-lg",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        {
          "bg-green-50 border-green-200": variant === "success",
          "bg-red-50 border-red-200": variant === "error",
          "bg-white": variant === "info",
        }
      )}
    />
  );
}

export const ToastTitle = ToastPrimitive.Title;
export const ToastDescription = ToastPrimitive.Description;

export function ToastClose() {
  return (
    <ToastPrimitive.Close className="absolute right-2 top-2">
      <X size={16} />
    </ToastPrimitive.Close>
  );
}
