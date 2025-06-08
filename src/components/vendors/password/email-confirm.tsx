import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Send, AlertCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { otpStore } from "@/stores/otp";
const emailSchema = z.object({
    email: z.string()
        .trim()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),
});

type EmailFormValues = z.infer<typeof emailSchema>;

export function VendorEmailForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { setEmail } = otpStore(state => state)

    console.log("working this section ", import.meta.url.split('/').pop())

    const {
        register,
        handleSubmit,
        formState: { errors, dirtyFields, isValid },
    } = useForm<EmailFormValues>({
        resolver: zodResolver(emailSchema),
        mode: "onChange",
    });

    const sendEmailMutation = useMutation({
        mutationFn: async (data: EmailFormValues) => {
            try {
                const res = await axios.post("https://shopnest.zapto.org/api/auth/vendor/verify-email", data);
                return res.data;
            } catch (error: any) {
                console.log(error);
                const err = error.response?.data;
                if (err?.errors && err.errors.length !== 0) {
                    err.errors.forEach((data: Record<string, Array<string>>) => {
                        toast({
                            variant: "destructive",
                            title: "Failed to Send Email",
                            description: data.errors[0] || "Unexpected error occurred"
                        });
                    });
                } else {
                    toast({
                        variant: "destructive",
                        title: "Failed to Send Email",
                        description: error.response?.data?.message || "Unexpected error occurred"
                    });
                }
                throw new Error(error.response?.data?.message || "Email submission failed");
            }
        },
        onSuccess: (data) => {
            toast({
                title: "Email Sent Successfully",
                description: "Check your inbox for password reset instructions.",
                variant: "default"
            });
            setEmail(data.data)
            navigate({ to: "/vendor/forgot-otp" });
        }
    });


    const onSubmit: SubmitHandler<EmailFormValues> = (data) => {
        sendEmailMutation.mutate(data);
    };

    const renderFieldStatus = (fieldName: keyof EmailFormValues) => {
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
                            <Mail className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-center">Forgot Password</CardTitle>
                        <CardDescription className="text-center">
                            Enter your email and we'll send you a password reset link
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-4">
                                {/* Email field */}
                                <div className="relative">
                                    <Label htmlFor="email" className="text-sm font-medium">
                                        Email Address
                                    </Label>
                                    <div className="relative mt-1">
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="name@example.com"
                                            autoComplete="email"
                                            {...register("email")}
                                            className={cn(
                                                errors.email ? "border-destructive" : "",
                                                "pr-10"
                                            )}
                                            autoFocus
                                        />
                                        <div className="absolute right-3 top-3">
                                            {renderFieldStatus("email")}
                                        </div>
                                    </div>
                                    {errors.email && (
                                        <span className="text-sm text-destructive mt-1 block">
                                            {errors.email.message}
                                        </span>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={sendEmailMutation.isPending || !isValid}
                                >
                                    {sendEmailMutation.isPending ? (
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
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            Send OTP <Send className="ml-2 h-4 w-4 text-white" />
                                        </>
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
                    By submitting this form, you agree to our{" "}
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
        </div>
    );
}
