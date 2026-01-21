import { useFormContext, useFormState } from "react-hook-form";
import FormError from "./FormError";
import { Label } from "../ui/label";
import { ChevronDown } from "lucide-react";

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
/*
----------usage example------------
    <FormSelect
    name="role"
    label="Role"
    options={[
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
    ]}
    />
*/

export default function FormSelect({ name, label, options , icon }: Props) {
  const { register } = useFormContext();
  const { errors } = useFormState({ name });

  const error = errors?.[name];

  return ( <div className="space-y-1">
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
      </Label>

      <div className="relative">
        {/* Left icon */}
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            {icon}
          </span>
        )}

        {/* Select */}
        <select
          id={name}
          {...register(name)}
          className={`
                w-full h-11 min-h-[44px]
                rounded-lg border border-input
                bg-white px-4 py-2 text-base
                shadow-sm transition-all duration-200
                appearance-none
                focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                disabled:cursor-not-allowed disabled:opacity-50
             ${icon ? "pl-10" : ""}
            ${error ? "border-red-500 focus:ring-red-500" : ""}
          `}
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

        {/* Right dropdown icon */}
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          <ChevronDown size={16} />
        </span>
      </div>

      <FormError error={error as any} />
    </div>
  );
}
