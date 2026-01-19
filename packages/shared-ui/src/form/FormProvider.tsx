import {
  FormProvider as RHFProvider,
  type UseFormReturn,
} from "react-hook-form";

type Props = {
  children: React.ReactNode;
  methods: UseFormReturn<any>;
  onSubmit: () => void;
};

export default function FormProvider({ children, methods, onSubmit }: Props) {
  return (
    <RHFProvider {...methods}>
      <form onSubmit={onSubmit} noValidate>
        {children}
      </form>
    </RHFProvider>
  );
}
