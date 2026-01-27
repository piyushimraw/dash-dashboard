import { Controller, useFormContext } from "react-hook-form";
import { SelectBox } from "../selectbox";
import { FormError } from "./FormError";
import { cn } from "@ui/lib/utils";

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
/*----------usage example------------
    <FormSelect
    name="role"
    label="Role"
    options={[
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
    ]}
    />
*/
export function FormSelect({ name, label, options, icon }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="space-y-1">
          <div className="relative">
            {icon && (
              <span className="absolute left-3 top-3/4 -translate-y-3/4 text-muted-foreground pointer-events-none">
                {icon}
              </span>
            )}

            <SelectBox
              label={label}
              options={options}
              value={field.value}
              onValueChange={field.onChange}
              className={cn(
                icon ? "pl-10" : "",
                fieldState?.error ? "border-red-500 focus:ring-red-500" : "",
              )}
            />
          </div>

          <FormError error={fieldState.error} />
        </div>
      )}
    />
  );
}
