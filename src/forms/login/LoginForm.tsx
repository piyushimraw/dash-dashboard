import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormProvider from "@/components/form/FormProvider";
import FormInput from "@/components/form/FormInput";
import { LOCATION_OPTIONS, loginSchema } from "./login.schema";
import type { LoginFormValues } from "./login.types";
import { useNavigate } from "@tanstack/react-router";
import useAuthStore from "@/store/useAuthStore";
import { Building2, Lock, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import FormSelect from "@/components/form/FormSelect";
import { useState } from "react";
import { loginService } from "@/services/loginService";


export default function LoginForm() {
  const navigate = useNavigate();

  const login = useAuthStore((state) => state.login);
  const [loginError, setLoginError] = useState(false);
  // const [apiErrorMsg,setApiErrorMsg] = useState('');

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
  try {
    const success = import.meta.env.MODE === 'test' ? await loginService(data): login(data.userId, data.password);
    if (success) {
      setLoginError(false);
      // setApiErrorMsg('');
      navigate({ to: '/dashboard' });
    } else {
      setLoginError(true);
      // setApiErrorMsg('');
      console.log('Wrong credentials...');
    }
  } catch (error) {
    console.error('Login failed with error:', error);
    setLoginError(true);
    // setApiErrorMsg(error as string);
  }
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

            <FormSelect
              name="loginLocation"
              label="Login Location"
              icon={<Building2 size={20} />}
              options={LOCATION_OPTIONS}
            />
          </div>

          <div>
              {loginError && (
                  <p className="text-sm text-red-600">
                    User ID or password is incorrect
                  </p>
              )}

              {/* {apiError && <p className="text-sm text-red-600">API error occurred</p>} */}
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
