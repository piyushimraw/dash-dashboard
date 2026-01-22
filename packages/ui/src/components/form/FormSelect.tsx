import { useFormContext, useFormState } from "react-hook-form";
import { FormError } from "./FormError";
import { Label } from "../label";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

type Option = {
  label: string;
  value: string;
};

type Props = {
  name: string;
  label: string;
  options: Option[];
  icon?: React.ReactNode;
};

export function FormSelect({ name, label, options, icon }: Props) {
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
        <select
          id={name}
          {...register(name)}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "appearance-none pr-10",
            icon && "pl-10",
            error && "border-destructive focus-visible:ring-destructive"
          )}
        >
          <option value="" disabled hidden>
            {label}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>

      <FormError error={error as any} />
    </div>
  );
}
