import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormProvider from "@/components/form/FormProvider";
import FormInput from "@/components/form/FormInput";
import { loginSchema } from "./login.schema";
import type { LoginFormValues } from "./login.types";
import { useNavigate } from "@tanstack/react-router";
import { Building2, Lock, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import FormSelect from "@/components/form/FormSelect";
import { useState } from "react";
import { useGetLoginLocations } from "@/features/hooks/useGetLoginLocations";
import { authService } from "@/services/auth/auth";


export default function LoginForm() {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { data: locations, isLoading : loadingLocations, isError } = useGetLoginLocations();

  const methods = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      userId: "",
      password: "",
      userLocation: "",
      loginLocation: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
  setIsLoading(true);
  setLoginError(false);
  setApiError(false);
  setNetworkError(false);

  try {
    const success = await authService.login(data);
    if (success) {
      navigate({ to: '/dashboard' });
    }
  } catch (error) {
    if (error instanceof Error) {
      switch (error.message) {
        case 'INVALID_CREDENTIALS':
          setLoginError(true);
          break;
        case 'API_ERROR':
          setApiError(true);
          break;
        case 'NETWORK_ERROR':
        default:
          setNetworkError(true);
          break;
      }
    }
  } finally {
    setIsLoading(false);
  }
};

  return (
    <>
      <FormProvider
        methods={methods}
        onSubmit={methods.handleSubmit(onSubmit, (errors) => {
          console.log("Validation Errors on handle submit :", errors);
        })}
      >
        <div className="space-y-5">
          {/* User ID */}
          <FormInput
            name="userId"
            label="User ID"
            placeholder="Enter your user ID"
            icon={<User size={20} aria-hidden="true" />}
          />

          {/* Password */}
          <FormInput
            type="password"
            name="password"
            label="Password"
            placeholder="Enter your password"
            icon={<Lock size={20} />}
          />

          {/* Location Fields */}
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              name="userLocation"
              label="User Location"
              placeholder="Location"
              icon={<MapPin size={20} />}
            />

            <FormSelect
              name="loginLocation"
              label="Login Location"
              icon={<Building2 size={20} />}
              options={locations ?? []}
            />
          </div>

          <div>
              {loginError && <p className="text-sm text-red-600">User ID or password is incorrect</p>}
              {(apiError || isError) && <p className="text-sm text-red-600">API error occurred</p>}
              {networkError && <p className="text-sm text-red-600">Network issue. Please try again.</p>}
              {isLoading && <p>Loading</p>}
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full mt-6 touch-manipulation"
          >
            Sign In
          </Button>

          <p className="text-center text-xs text-muted-foreground mt-4">
            By signing in, you agree to the terms of use and privacy policy.
          </p>
        </div>
      </FormProvider>
    </>
  );
}
