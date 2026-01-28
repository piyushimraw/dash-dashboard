import { useFormContext, useFormState } from "react-hook-form";
import type { ReactNode } from "react";
import { Label } from "../label";
import { Input } from "../input";
import { FormError } from "./FormError";
import { cn } from "../../lib/utils";

type Props = {
  name: string;
  label: string;
  type?: string;
  icon?: ReactNode;
  placeholder?: string;
};

/*
----------usage example------------
<FormInput
  name="email"
  label="Email"
  icon={<Mail className="h-4 w-4 text-muted-foreground" />}
/>

<FormInput
  name="password"
  label="Password"
  type="password"
  icon={<Lock className="h-4 w-4 text-muted-foreground" />}
/>
*/

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
    <div className="space-y-1">
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
      </Label>

      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
            {icon}
          </div>
        )}

        <Input
          id={name}
          type={type}
          placeholder={placeholder}
          {...register(name)}
          className={cn(
            icon && "pl-10",
            error && "border-destructive focus-visible:ring-destructive",
          )}
        />
      </div>

      <FormError error={error as any} />
    </div>
  );
}
