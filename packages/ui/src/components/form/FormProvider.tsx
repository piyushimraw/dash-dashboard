import { FormProvider as RHFProvider, type UseFormReturn } from "react-hook-form";

type Props = {
  children: React.ReactNode;
  methods: UseFormReturn<any>;
  onSubmit: () => void;
};
/*
----------usage example------------
    wrap the form with this provider
    Ex:
    <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
      <FormInput name="email" label="Email" />
      <FormInput name="password" label="Password" type="password" />
      <button type="submit">Login</button>
    </FormProvider>
*/
export function FormProvider({ children, methods, onSubmit }: Props) {
  return (
    <RHFProvider {...methods}>
      <form onSubmit={onSubmit} noValidate>
        {children}
      </form>
    </RHFProvider>
  );
}
