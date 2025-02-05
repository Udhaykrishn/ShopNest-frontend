import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupFormValues, signupSchema } from "@/schema/auth/signup.schema";
import { Link } from "@tanstack/react-router";
import { Check, AlertCircle } from "lucide-react";

export function SignupForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const [mobileLength, setMobileLength] = useState(0);

    const {
        register,
        handleSubmit,
        formState: { errors, dirtyFields },
        watch,
    } = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        mode: "onChange"
    });

    watch("mobile");

    const onSubmit: SubmitHandler<SignupFormValues> = (data) => {
        console.log("Form data:", data);
    };

    const renderFieldStatus = (fieldName: keyof SignupFormValues) => {
        if (fieldName === "mobile" && dirtyFields.mobile) {
            return mobileLength === 10 ? (
                <Check className="h-4 w-4 text-green-500" />
            ) : (
                <AlertCircle className="h-4 w-4 text-destructive" />
            );
        }

        if (dirtyFields[fieldName]) {
            return errors[fieldName] ? (
                <AlertCircle className="h-4 w-4 text-destructive" />
            ) : (
                <Check className="h-4 w-4 text-green-500" />
            );
        }
        return null;
    };


    const handleMobileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        const numbersOnly = value.replace(/\D/g, '');

        const truncated = numbersOnly.slice(0, 10);

        e.target.value = truncated;

        setMobileLength(truncated.length);
    };

    return (
        <div className={cn("flex flex-col gap-6 max-w-md mx-auto", className)} {...props}>
            <Card className="shadow-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
                    <CardDescription className="text-center">
                        Signup to Become a Vendor
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                        <div className="space-y-4">
                            {/* Username field */}
                            <div className="relative">
                                <Label htmlFor="username">Username</Label>
                                <div className="relative">
                                    <Input
                                        id="username"
                                        placeholder="Enter your username"
                                        {...register("username")}
                                        className={cn(
                                            errors.username ? "border-destructive" : "",
                                            "pr-10"
                                        )}
                                    />
                                    <div className="absolute right-3 top-3">
                                        {renderFieldStatus("username")}
                                    </div>
                                </div>
                                {errors.username && (
                                    <span className="text-sm text-destructive">
                                        {errors.username.message}
                                    </span>
                                )}
                            </div>

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
                                        placeholder="Create a strong password"
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

                            {/* Confirm Password field */}
                            <div className="relative">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="Confirm your password"
                                        {...register("confirmPassword")}
                                        className={cn(
                                            errors.confirmPassword ? "border-destructive" : "",
                                            "pr-10"
                                        )}
                                    />
                                    <div className="absolute right-3 top-3">
                                        {renderFieldStatus("confirmPassword")}
                                    </div>
                                </div>
                                {errors.confirmPassword && (
                                    <span className="text-sm text-destructive">
                                        {errors.confirmPassword.message}
                                    </span>
                                )}
                            </div>

                            {/* Mobile field */}
                            <div className="relative">
                                <Label htmlFor="mobile">Mobile Number</Label>
                                <div className="relative">
                                    <Input
                                        id="mobile"
                                        type="tel"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        placeholder="Enter 10 digit number"
                                        {...register("mobile", {
                                            onChange: handleMobileInput,
                                            validate: (value) => value.length === 10 || "Please enter exactly 10 digits"
                                        })}
                                        className={cn(
                                            mobileLength > 0 && mobileLength < 10 ? "border-destructive" : "",
                                            "pr-10"
                                        )}
                                    />
                                    <div className="absolute right-3 top-3">
                                        {renderFieldStatus("mobile")}
                                    </div>
                                </div>
                                {(mobileLength > 0 && mobileLength < 10) && (
                                    <span className="text-sm text-destructive">
                                        Please enter exactly 10 digits ({10 - mobileLength} digits remaining)
                                    </span>
                                )}
                            </div>
                            <div className="relative">
                                <div className="relative">
                                    <Input
                                        type="submit"
                                        value={"Create"}
                                        className="bg-primary"
                                    />
                                </div>
                            </div>




                        </div>

                        <div className="text-center text-sm">
                            Already have an account?{" "}
                            <Link
                                to="/vendor/login"
                                className="text-primary hover:text-primary/90 underline underline-offset-4"
                            >
                                Login
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <div className="text-balance text-center text-xs text-muted-foreground">
                By signing up, you agree to our{" "}
                <Link to="/" className="text-primary hover:text-primary/90 underline underline-offset-4">
                    Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/" className="text-primary hover:text-primary/90 underline underline-offset-4">
                    Privacy Policy
                </Link>
                .
            </div>
        </div>
    );
}
