import { useFormContext, useFormState } from "react-hook-form";
import FormError from "./FormError";

type Option = {
  label: string;
  value: string;
};

type Props = {
  name: string;
  label: string;
  options: Option[];
};

export default function FormSelect({ name, label, options }: Props) {
  const { register } = useFormContext();
  const { errors } = useFormState({ name });

  const error = errors?.[name];

  return (
    <div>
      <label>{label}</label>

      <select {...register(name)}>
        <option value="">Select {label}</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <FormError error={error as any} />
    </div>
  );
}
