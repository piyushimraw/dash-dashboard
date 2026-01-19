import { Card, CardContent, CardHeader } from "@dash/shared-ui";
import LoginForm from "@/forms/login/LoginForm";
import { Car, Lock, User, Building2 } from "lucide-react";

export function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender via-lavender-dark/30 to-lavender flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-lavender-deep to-sidebar relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute top-20 left-20 w-72 h-72 bg-sidebar-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-32 right-20 w-96 h-96 bg-sidebar-primary/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-lavender/5 rounded-full blur-2xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div>
            {/* Logo */}
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-sidebar-primary flex items-center justify-center shadow-xl">
                <span className="font-bold text-2xl text-sidebar-primary-foreground">
                  H
                </span>
              </div>
              <div>
                <h1 className="font-bold text-2xl text-white tracking-tight">
                  Hertz DASH
                </h1>
                <p className="text-sm text-white/60">
                  Rental Management System
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-white leading-tight">
                Welcome to the
                <br />
                <span className="text-sidebar-primary">DASH Portal</span>
              </h2>
              <p className="mt-4 text-lg text-white/70 max-w-md">
                Access your rental management tools, fleet operations, and
                customer services all in one place.
              </p>
            </div>

            {/* Features */}
            <div
              className="grid grid-cols-2 gap-4"
              role="list"
              aria-label="Key features"
            >
              {[
                {
                  icon: <Car className="h-5 w-5" aria-hidden="true" />,
                  label: "Fleet Management",
                },
                {
                  icon: <User className="h-5 w-5" aria-hidden="true" />,
                  label: "Customer Portal",
                },
                {
                  icon: <Building2 className="h-5 w-5" aria-hidden="true" />,
                  label: "Multi-Location",
                },
                {
                  icon: <Lock className="h-5 w-5" aria-hidden="true" />,
                  label: "Secure Access",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  role="listitem"
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
                >
                  <div
                    className="h-10 w-10 rounded-lg bg-sidebar-primary/20 flex items-center justify-center text-sidebar-primary"
                    aria-hidden="true"
                  >
                    {feature.icon}
                  </div>
                  <span className="text-sm font-medium text-white/90">
                    {feature.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-sm text-white/40">
            Version 3.21.0-14.11 · © 2024 The Hertz Corporation
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <div className="inline-flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-sidebar-primary flex items-center justify-center shadow-lg">
                <span className="font-bold text-xl text-sidebar-primary-foreground">
                  H
                </span>
              </div>
              <div className="text-left">
                <h1 className="font-bold text-xl text-foreground">
                  Hertz DASH
                </h1>
                <p className="text-xs text-muted-foreground">
                  Rental Management System
                </p>
              </div>
            </div>
          </div>

          <Card className="glass border-0 shadow-2xl shadow-lavender-dark/20">
            <CardHeader className="text-center pb-2">
              <h2 className="text-2xl font-bold text-foreground">Sign In</h2>
              <p className="text-muted-foreground">
                Enter your credentials to continue
              </p>
            </CardHeader>
            <CardContent className="pt-4">
              <LoginForm />
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground mt-6 lg:hidden">
            Version 3.21.0-14.11 · © 2024 The Hertz Corporation
          </p>
        </div>
      </div>
    </div>
  );
}
