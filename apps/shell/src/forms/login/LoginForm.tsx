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
    console.log("dataonSubmit>>>>", data);
    const areCorrectCredentials = login(data.userId, data.password);
    if (areCorrectCredentials) {
      navigate({ to: "/dashboard" });
      setLoginError(false);
    } else {
      console.log("Wrong credentials....");
      setLoginError(true);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* User ID */}
        <div className="space-y-2">
          <Label htmlFor="userId">User ID</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="userId"
              placeholder="Enter your user ID"
              className="pl-10"
              {...register("userId")}
            />
          </div>
          {errors.userId && (
            <p className="text-sm text-destructive">{errors.userId.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="pl-10"
              {...register("password")}
            />
          </div>
          {errors.password && (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Location Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="userLocation">User Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="userLocation"
                placeholder="Location"
                className="pl-10"
                {...register("userLocation")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="loginLocation">Login Location</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <select
                id="loginLocation"
                {...register("loginLocation")}
                className="flex h-9 w-full rounded-md border border-input bg-transparent pl-10 pr-8 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none appearance-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm"
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
              <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        {loginError && (
          <p className="text-sm text-destructive">
            User ID or password is incorrect
          </p>
        )}

        <Button type="submit" size="lg" className="w-full mt-6">
          Sign In
        </Button>

        <p className="text-center text-xs text-muted-foreground mt-4">
          By signing in, you agree to the terms of use and privacy policy.
        </p>
      </form>
    </FormProvider>
  );
}
