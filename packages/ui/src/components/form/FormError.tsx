import type { FieldError } from "react-hook-form";

type Props = {
  error?: FieldError;
};

export function FormError({ error }: Props) {
  if (!error) return null;

  return (
    <p style={{ color: "red", fontSize: "0.875rem" }}>
      {error.message}
    </p>
  );
}
