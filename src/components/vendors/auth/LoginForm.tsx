import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { Check, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoginFormValues, loginSchema } from "@/schema/auth/login.schema";
import { useVendorMutations } from "@/hooks";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange"
  });

  const { loginVendor } = useVendorMutations({vendor:"another"});

  const onSubmit: SubmitHandler<LoginFormValues> = (data) => {
    loginVendor.mutate(data);
  };

  const renderFieldStatus = (fieldName: keyof LoginFormValues) => {
    if (dirtyFields[fieldName]) {
      return errors[fieldName] ? (
        <AlertCircle className="h-4 w-4 text-red-500" />
      ) : (
        <Check className="h-4 w-4 text-green-500" />
      );
    }
    return null;
  };

  return (
    <div className={cn("flex flex-col justify-center min-h-screen p-4", className)} {...props}>
      <Card className="w-[400px] mx-auto shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Vendor Login</CardTitle>
          <CardDescription className="text-center">
            Login to Your Vendor Account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CardDescription className="font-bold text-center text-red-500">
            {loginVendor.isError && <>{loginVendor.error?.response?.data?.message}</>}
          </CardDescription>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    {...register("email")}
                    className={cn(
                      errors.email
                        ? "border-red-500 focus:ring-red-500"
                        : "focus:ring-blue-500",
                      "pr-10"
                    )}
                  />
                  <div className="absolute right-3 top-3">
                    {renderFieldStatus("email")}
                  </div>
                </div>
                {errors.email && (
                  <span className="text-sm text-red-500">
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div className="relative">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    {...register("password")}
                    className={cn(
                      errors.password
                        ? "border-red-500 focus:ring-red-500"
                        : "focus:ring-blue-500",
                      "pr-10"
                    )}
                  />
                  <div className="absolute right-3 top-3">
                    {renderFieldStatus("password")}
                  </div>
                </div>
                {errors.password && (
                  <span className="text-sm text-red-500">
                    {errors.password.message}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <Link
                  to="/vendor/forgot"
                  className="text-sm text-primary hover:underline underline-offset-4"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <Button
                  type="submit"
                  className="w-full bg-primary text-white px-4 py-2 rounded flex items-center justify-center gap-2"
                  disabled={loginVendor.isPending}
                >
                  {loginVendor.isPending ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Logging in...
                    </>
                  ) : (
                    "Login to Vendor"
                  )}
                </Button>
              </div>
            </div>

            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Link
                to="/vendor/signup"
                className="text-primary hover:underline underline-offset-4"
              >
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}