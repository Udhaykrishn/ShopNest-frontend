import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { Github, Check, AlertCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useAuthStore } from "@/stores/user/userAuthStore";
import { api } from "@/types";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/^[A-Z]/, "Password must start with a capital letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),
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
    mode: "onChange",
  });

  const navigate = useNavigate();
  const { toast } = useToast();
  const { setAuth } = useAuthStore.getState();

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormValues) => {
      const res = await api.post("/auth/user/login", data);
      return res.data;
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.response?.data?.message || "An error occurred",
      });
    },
    onSuccess: (data) => {
      setAuth({isAuthenticated:true,id:data.data._id,role:data.data.role});
      navigate({ to: "/shop" });
    },
  });

  const googleAuthMutation = useMutation({
    mutationFn: async (credentialResponse: any) => {
      const res = await axios.post(
        "https://shopnest.zapto.org/api/auth/user/google",
        { credential: credentialResponse.credential },
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );
      return res.data;
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Google Authentication Failed",
        description: error.response?.data?.message || "An error occurred",
      });
    },
    onSuccess: (data) => {
      toast({
        variant: "default",
        title: "Login Successful",
        description: "Logged in with Google successfully",
      });
      setAuth({isAuthenticated:true,id:data.data._id,role:data.data.role});
      navigate({ to: "/shop" });

    },
  });

  const renderFieldStatus = (fieldName: keyof LoginFormValues) => {
    if (!dirtyFields[fieldName]) return null;
    return errors[fieldName] ? (
      <AlertCircle className="h-4 w-4 text-destructive" />
    ) : (
      <Check className="h-4 w-4 text-green-500" />
    );
  };

  const onSubmit: SubmitHandler<LoginFormValues> = (data) => {
    loginMutation.mutate(data);
  };

  return (
    <GoogleOAuthProvider clientId="767542971696-c24opp5knnfa9u358tj5ofccomm99gra.apps.googleusercontent.com">
      <div
        className={cn(
          "min-h-screen flex items-center justify-center bg-background p-4",
          className
        )}
        {...props}
      >
        <Card className="w-full max-w-md shadow-xl border-border">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-3xl font-semibold text-center text-primary">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Sign in to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-center w-full max-w-[336px] h-11 rounded-md border border-border bg-background hover:bg-muted text-foreground">
                  <GoogleLogin
                    onSuccess={googleAuthMutation.mutate}
                    onError={() =>
                      toast({
                        variant: "destructive",
                        title: "Google Authentication Failed",
                        description: "An error occurred during sign-in",
                      })
                    }
                    useOneTap
                    theme="outline"
                    text="continue_with"
                    width="336px" 
                    shape="rectangular"
                    logo_alignment="left"
                  />
                </div>
                <Button
                  variant="outline"
                  className="w-full h-11 bg-background hover:bg-muted text-foreground border-border"
                >
                  <Github className="w-5 h-5 mr-2" /> Continue with GitHub
                </Button>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-3 text-muted-foreground">
                    Or continue with email
                  </span>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-primary">
                    Email
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      {...register("email")}
                      className={cn(
                        "bg-background border-border text-foreground placeholder-muted-foreground",
                        errors.email && "border-destructive"
                      )}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2">
                      {renderFieldStatus("email")}
                    </span>
                  </div>
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-primary">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      {...register("password")}
                      className={cn(
                        "bg-background border-border text-foreground placeholder-muted-foreground",
                        errors.password && "border-destructive"
                      )}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2">
                      {renderFieldStatus("password")}
                    </span>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                  )}
                </div>

                <div className="flex justify-end">
                  <Link
                    to="/forgot"
                    className="text-sm text-primary hover:underline underline-offset-4"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? "Logging in..." : "Login"}
                </Button>
              </div>

              {/* Signup Link */}
              <p className="text-center text-sm text-muted-foreground">
                Don’t have an account?{" "}
                <Link
                  to="/signup"
                  className="text-primary hover:underline underline-offset-4"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </GoogleOAuthProvider>
  );
}

export default LoginPage;