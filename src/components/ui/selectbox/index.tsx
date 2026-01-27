import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Label } from "../label";

export type SelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

interface AppSelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  options: SelectOption[];

  placeholder?: string;
  label?: string;
  description?: string;

  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export function SelectBox({
  value,
  defaultValue,
  onValueChange,
  options,
  placeholder = "Select an option",
  label,
  description,
  disabled,
  loading,
  className,
}: AppSelectProps) {
  return (
    <div className="space-y-1">
      {label && <Label>{label}</Label>}

      <Select
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled || loading}
      >
        <SelectTrigger
          className={cn(
            `   w-full h-11 min-h-[44px]
                rounded-lg border border-input
                bg-white px-4 py-2 text-base
                shadow-sm transition-all duration-200
                appearance-none
                focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                disabled:cursor-not-allowed disabled:opacity-50`,
            className,
          )}
        >
          <SelectValue placeholder={loading ? "Loading..." : placeholder} />
        </SelectTrigger>

        <SelectContent>
          {options.length === 0 && (
            <div className="px-2 py-1 text-sm text-muted-foreground">
              No options found
            </div>
          )}

          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
