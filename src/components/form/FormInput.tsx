import { useFormContext, useFormState } from "react-hook-form";
import FormError from "./FormError";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import type { ReactNode } from "react";

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

export default function FormInput({
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
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </span>
        )}

        <Input
          id={name}
          type={type}
          placeholder={placeholder}
          {...register(name)}
          className={`${icon ? "pl-10" : ""} ${
            error ? "border-red-500 focus-visible:ring-red-500" : ""
          }`}
        />
      </div>

      <FormError error={error as any} />
    </div>
  );
}
