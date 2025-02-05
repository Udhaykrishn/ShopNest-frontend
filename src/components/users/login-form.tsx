import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "@tanstack/react-router";
import { Github, Mail, Check, AlertCircle } from "lucide-react";

// Simplified schema for login
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage({
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

  const onSubmit: SubmitHandler<LoginFormValues> = (data) => {
    console.log("Form data:", data);
  };

  const renderFieldStatus = (fieldName: keyof LoginFormValues) => {
    if (dirtyFields[fieldName]) {
      return errors[fieldName] ? (
        <AlertCircle className="h-4 w-4 text-destructive" />
      ) : (
        <Check className="h-4 w-4 text-green-500" />
      );
    }
    return null;
  };

  return (
    <div className={cn("flex flex-col gap-6 max-w-md mx-auto", className)} {...props}>
      <Card className="shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">
            Login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" type="button" className="w-full">
                <Github className="w-5 h-5 mr-2" />
                GitHub
              </Button>
              <Button variant="outline" type="button" className="w-full">
                <Mail className="w-5 h-5 mr-2" />
                Google
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {/* Email field */}
              <div className="relative">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    {...register("email")}
                    className={cn(
                      errors.email ? "border-destructive" : "",
                      "pr-10"
                    )}
                  />
                  <div className="absolute right-3 top-3">
                    {renderFieldStatus("email")}
                  </div>
                </div>
                {errors.email && (
                  <span className="text-sm text-destructive">
                    {errors.email.message}
                  </span>
                )}
              </div>

              {/* Password field */}
              <div className="relative">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    {...register("password")}
                    className={cn(
                      errors.password ? "border-destructive" : "",
                      "pr-10"
                    )}
                  />
                  <div className="absolute right-3 top-3">
                    {renderFieldStatus("password")}
                  </div>
                </div>
                {errors.password && (
                  <span className="text-sm text-destructive">
                    {errors.password.message}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <Link
                  to="/"
                  className="text-sm text-primary hover:text-primary/90 underline underline-offset-4"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Login button using Input instead of Button */}
              <div className="relative">
                <Input
                  type="submit"
                  value="Login"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                />
              </div>
            </div>

            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-primary hover:text-primary/90 underline underline-offset-4"
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

export default LoginPage;