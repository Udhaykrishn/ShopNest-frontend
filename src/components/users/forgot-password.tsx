import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useBlocker } from "@tanstack/react-router";
import { Eye, EyeOff, Lock, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "@tanstack/react-router";
import { otpStore } from "@/stores/otp";

const resetPasswordSchema = z.object({
    password: z.string()
        .trim()
        .min(8, "Password must be at least 8 characters")
        .regex(/^[A-Z]/, "Password must start with an uppercase letter")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string()
        .trim()
        .min(8, "Confirm password must be at least 8 characters"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export function ForgotPasswordForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const email = otpStore(state => state.email);
    const { toast } = useToast();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, dirtyFields },
    } = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
        mode: "onChange"
    });

    // Watch the password and confirmPassword fields
    const passwordValue = watch("password", "");
    const confirmPasswordValue = watch("confirmPassword", "");

    const resetPasswordMutation = useMutation({
        mutationFn: async (data: ResetPasswordFormValues) => {
            try {
                const payload = { ...data, email };
                const res = await axios.post("http://shopnest.zapto.org/api/auth/user/forgot-password", payload);
                return res.data;
            } catch (error: any) {
                console.log(error);
                const err = error.response?.data;
                if (err?.errors && err.errors.length !== 0) {
                    err.errors.forEach((data: Record<string, Array<string>>) => {
                        toast({
                            variant: "destructive",
                            title: "Failed to Reset Password",
                            description: data.errors[0] || "Unexpected error occurred"
                        });
                    });
                } else {
                    toast({
                        variant: "destructive",
                        title: "Failed to Reset Password",
                        description: error.response?.data?.message || "Unexpected error occurred"
                    });
                }
                throw new Error(error.response?.data?.message || "Password reset failed");
            }
        },
        onSuccess: () => {
            toast({
                title: "Password Reset Successful",
                description: "Your password has been successfully reset."
            });
            navigate({ to: "/login" });
        }
    });

    // Navigation Blocker
    const { status, reset } = useBlocker({
        shouldBlockFn: () => {
            // Only block if either password field has content and mutation isn't pending
            const hasContent = passwordValue.length > 0 || confirmPasswordValue.length > 0;
            return hasContent && !resetPasswordMutation.isPending;
        },
        withResolver: true,
    });

    const onSubmit: SubmitHandler<ResetPasswordFormValues> = (data) => {
        resetPasswordMutation.mutate(data);
    };

    const renderFieldStatus = (fieldName: keyof ResetPasswordFormValues) => {
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
        <div className={cn("grid place-items-center min-h-screen px-4", className)} {...props}>
            <div className="w-full max-w-md">
                <Card className="shadow-lg">
                    <CardHeader className="space-y-1">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                            <Lock className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
                        <CardDescription className="text-center">
                            Create a new secure password for your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-4">
                                {/* Password field */}
                                <div className="relative">
                                    <Label htmlFor="password">New Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Create a strong password"
                                            {...register("password")}
                                            className={cn(
                                                errors.password ? "border-destructive" : "",
                                                "pr-10"
                                            )}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-0 top-0 h-full px-3 flex items-center justify-center focus:outline-none focus:ring-0"
                                            onClick={() => setShowPassword(!showPassword)}
                                            tabIndex={-1}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                                            )}
                                        </button>
                                        <div className="absolute right-10 top-3">
                                            {renderFieldStatus("password")}
                                        </div>
                                    </div>
                                    {errors.password && (
                                        <span className="text-sm text-destructive mt-1 block">
                                            {errors.password.message}
                                        </span>
                                    )}
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Password must be at least 8 characters and include uppercase, lowercase,
                                        numbers, and special characters.
                                    </p>
                                </div>

                                {/* Confirm Password field */}
                                <div className="relative">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm your password"
                                            {...register("confirmPassword")}
                                            className={cn(
                                                errors.confirmPassword ? "border-destructive" : "",
                                                "pr-10"
                                            )}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-0 top-0 h-full px-3 flex items-center justify-center focus:outline-none focus:ring-0"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            tabIndex={-1}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                                            )}
                                        </button>
                                        <div className="absolute right-10 top-3">
                                            {renderFieldStatus("confirmPassword")}
                                        </div>
                                    </div>
                                    {errors.confirmPassword && (
                                        <span className="text-sm text-destructive mt-1 block">
                                            {errors.confirmPassword.message}
                                        </span>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={resetPasswordMutation.isPending}
                                >
                                    {resetPasswordMutation.isPending ? (
                                        <>
                                            <svg
                                                className="mr-2 h-4 w-4 animate-spin"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                />
                                            </svg>
                                            Resetting password...
                                        </>
                                    ) : (
                                        "Reset Password"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 pt-0">
                        <div className="w-full border-t pt-4">
                            <div className="flex items-center justify-center space-x-1 text-sm">
                                <span className="text-muted-foreground">Remember your password?</span>
                                <Link
                                    to="/login"
                                    className="font-medium text-primary hover:text-primary/90 underline-offset-4 hover:underline transition-colors"
                                >
                                    Log in
                                </Link>
                            </div>
                        </div>
                        <div className="w-full">
                            <div className="flex items-center justify-center space-x-1 text-sm">
                                <span className="text-muted-foreground">Don't have an account?</span>
                                <Link
                                    to="/signup"
                                    className="font-medium text-primary hover:text-primary/90 underline-offset-4 hover:underline transition-colors"
                                >
                                    Sign up
                                </Link>
                            </div>
                        </div>
                    </CardFooter>
                </Card>

                <div className="text-balance text-center text-xs text-muted-foreground mt-4">
                    By resetting your password, you agree to our{" "}
                    <Link to="/" className="text-primary hover:text-primary/90 underline-offset-4 hover:underline transition-colors">
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/" className="text-primary hover:text-primary/90 underline-offset-4 hover:underline transition-colors">
                        Privacy Policy
                    </Link>
                    .
                </div>
            </div>

            {/* Navigation Blocker Modal */}
            <Dialog open={status === "blocked"} onOpenChange={(open) => !open && reset}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Unsaved Changes</DialogTitle>
                        <DialogDescription>
                            You have unsaved changes in your password reset form. Please save your changes before leaving.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={reset}>
                            Stay on Page
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default ForgotPasswordForm;