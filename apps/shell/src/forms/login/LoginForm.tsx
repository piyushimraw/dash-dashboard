import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, FormInput, Button } from "@dash/shared-ui";
import { useAuthStore } from "@dash/shared-state";
import { loginSchema } from "./login.schema";
import type { LoginFormValues } from "./login.types";
import { useNavigate } from "@tanstack/react-router";
import { Building2, Lock, MapPin, User } from "lucide-react";

export default function LoginForm() {
  const navigate = useNavigate();

  const login = useAuthStore((state) => state.login);

  const methods = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      userId: "",
      password: "",
      userLocation: "",
      loginLocation: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    login(data.userId);
    navigate({ to: "/dashboard" });
  };

  return (
    <>
      <FormProvider
        methods={methods}
        onSubmit={methods.handleSubmit(onSubmit, (errors) => {
          console.log("Validation Errors:", errors);
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
            <FormInput
              name="loginLocation"
              label="Login Location"
              placeholder="CASFO15"
              icon={<Building2 size={20} />}
            />
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
