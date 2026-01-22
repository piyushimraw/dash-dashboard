import { useFormContext, useFormState } from "react-hook-form";
import { FormError } from "./FormError";
import { Label } from "../label";
import { cn } from "../../lib/utils";
import type { ReactNode } from "react";

type Props = {
  name: string;
  label: string;
  type?: string;
  icon?: ReactNode;
  placeholder?: string;
};

export function FormInput({
  name,
  label,
  type = "text",
  icon,
  placeholder,
}: Props) {
  const { register } = useFormContext();
  const { errors } = useFormState({ name });

  const error = errors?.[name];

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>

      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
            {icon}
          </div>
        )}
        <input
          id={name}
          type={type}
          placeholder={placeholder}
          {...register(name)}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            icon && "pl-10",
            error && "border-destructive focus-visible:ring-destructive"
          )}
        />
      </div>

      <FormError error={error as any} />
    </div>
  );
}
