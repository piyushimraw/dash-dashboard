import { useState } from "react";

type SubmitHandler<T> = (data: T) => Promise<void> | void;

export default function useFormSubmit<T>(onSubmit: SubmitHandler<T>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (data: T) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      await onSubmit(data);
    } catch (error: any) {
      setSubmitError(
        error?.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting,
    submitError,
  };
}
