import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LOCATION_OPTIONS, loginSchema } from "./login.schema";
import type { LoginFormValues } from "./login.types";
import { useNavigate } from "@tanstack/react-router";
import useAuthStore from "@/store/useAuthStore";
import { Building2, ChevronDown, Lock, MapPin, User } from "lucide-react";
import { useState } from "react";

// Icon wrapper component for consistent vertical centering
function InputIcon({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="absolute left-3 text-muted-foreground pointer-events-none"
      style={{ top: '50%', transform: 'translateY(-50%)' }}
    >
      {children}
    </span>
  );
}

export default function LoginForm() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [loginError, setLoginError] = useState(false);

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = (data: LoginFormValues) => {
    const areCorrectCredentials = login(data.userId, data.password);
    if (areCorrectCredentials) {
      navigate({ to: "/dashboard" });
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* User ID */}
        <div className="space-y-1">
          <Label htmlFor="userId" className="text-sm font-medium">User ID</Label>
          <div className="relative">
            <InputIcon><User size={20} /></InputIcon>
            <Input
              id="userId"
              data-cy="userId"
              placeholder="Enter your user ID"
              className="pl-10"
              {...register("userId")}
            />
          </div>
          {errors.userId && (
            <p className="text-sm text-red-500" data-cy="userId-error">{errors.userId.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1">
          <Label htmlFor="password" className="text-sm font-medium">Password</Label>
          <div className="relative">
            <InputIcon><Lock size={20} /></InputIcon>
            <Input
              id="password"
              data-cy="password"
              type="password"
              placeholder="Enter your password"
              className="pl-10"
              {...register("password")}
            />
          </div>
          {errors.password && (
            <p className="text-sm text-red-500" data-cy="password-error">{errors.password.message}</p>
          )}
        </div>

        {/* Location Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="userLocation" className="text-sm font-medium">User Location</Label>
            <div className="relative">
              <InputIcon><MapPin size={20} /></InputIcon>
              <Input
                id="userLocation"
                data-cy="userLocation"
                placeholder="Location"
                className="pl-10"
                {...register("userLocation")}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="loginLocation" className="text-sm font-medium">Login Location</Label>
            <div className="relative">
              <InputIcon><Building2 size={20} /></InputIcon>
              <select
                id="loginLocation"
                data-cy="loginLocation"
                {...register("loginLocation")}
                className="h-11 w-full rounded-lg border border-input bg-white pl-10 pr-10 text-base shadow-sm transition-all duration-200 appearance-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent"
              >
                <option value="" disabled hidden>
                  Login Location
                </option>
                {LOCATION_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <span
                className="absolute right-3 text-muted-foreground pointer-events-none"
                style={{ top: '50%', transform: 'translateY(-50%)' }}
              >
                <ChevronDown size={16} />
              </span>
            </div>
          </div>
        </div>

        {loginError && (
          <p className="text-sm text-red-500" data-cy="login-error">
            User ID or password is incorrect
          </p>
        )}

        <Button type="submit" size="lg" className="w-full mt-6" data-cy="login-button">
          Sign In
        </Button>

        <p className="text-center text-xs text-muted-foreground mt-4">
          By signing in, you agree to the terms of use and privacy policy.
        </p>
      </form>
    </FormProvider>
  );
}
