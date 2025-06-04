import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { Github, Check, AlertCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { otpStore } from "@/stores/otp";
import { urlStore } from "@/stores/callback-url";
import { useAuthStore } from "@/stores/user/userAuthStore";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "recharts";

const signupSchema = z.object({
    username: z.string().trim().min(3, "Username must be at least 3 characters"),
    email: z.string().trim().email("Invalid email address"),
    password: z.string().trim().min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string().trim().min(8),
    phone: z.string().trim().regex(/^\d{10}$/, "Please enter a valid 10-digit mobile number")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

const InputField = ({ id, label, type = "text", register, errors, dirtyFields, placeholder, onChange }: any) => (
    <div className="space-y-1">
        <Label>{label}</Label>
        <div className="relative">
            <Input
                id={id}
                type={type}
                placeholder={placeholder}
                {...register(id, { onChange })}
                className={cn(errors[id] && "border-destructive", "pr-10")}
            />
            {dirtyFields[id] && (
                <span className="absolute right-3 top-3">
                    {errors[id] ? <AlertCircle className="h-4 w-4 text-destructive" /> : <Check className="h-4 w-4 text-green-500" />}
                </span>
            )}
        </div>
        {errors[id] && <span className="text-sm text-destructive">{errors[id].message}</span>}
    </div>
);

export function SignupPage({ className, ...props }: React.ComponentProps<"div">) {
    const [mobileLength, setMobileLength] = useState(0);
    const { toast } = useToast();
    const { setUrl, setFetchUrl } = urlStore();
    const { setAuth } = useAuthStore();
    const { setEmail } = otpStore();
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors, dirtyFields }, watch } = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        mode: "onChange"
    });

    watch("phone");

    const signupMutation = useMutation({
        mutationFn: (data: SignupFormValues) => axios.post("http://localhost:3001/auth/user/signup", data).then(res => res.data),
        onSuccess: (data) => {
            setEmail(data.data);
            setFetchUrl("users/verify-otp");
            setUrl("/shop");
            navigate({ to: "/otp" });
        },
        onError: (error: any) => toast({ variant: "destructive", title: "Failed to Signup", description: error.response?.data?.message || "Unexpected error" })
    });

    const googleAuthMutation = useMutation({
        mutationFn: (credentialResponse: any) => axios.post("http://localhost:3001/auth/user/google", { credential: credentialResponse.credential }, { withCredentials: true }).then(res => res.data),
        onSuccess: (data) => {
            toast({ variant: "default", title: "Login Successful", description: "Google login successful" });
            setAuth({isAuthenticated:true,role:data.data.role,id:data.data._id});
            navigate({ to: "/shop" });
        },
        onError: (error: any) => toast({ variant: "destructive", title: "Google Authentication Failed", description: error.response?.data?.message || "Failed" })
    });

    const onSubmit: SubmitHandler<SignupFormValues> = (data) => signupMutation.mutate(data);

    const handleMobileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
        e.target.value = value;
        setMobileLength(value.length);
    };

    return (
        <GoogleOAuthProvider clientId={"767542971696-c24opp5knnfa9u358tj5ofccomm99gra.apps.googleusercontent.com"}>
            <div className={cn("max-w-md mx-auto", className)} {...props}>
                <Card className="shadow-lg">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
                        <div className="space-y-2 text-center">
                            <h2 className="text-2xl font-bold">Create an account</h2>
                            <p className="text-sm text-muted-foreground">Choose your signup method</p>
                        </div>

                        <div className="space-y-2">
                            <div className="h-11 rounded-md border bg-white hover:bg-slate-50">
                                <GoogleLogin onSuccess={googleAuthMutation.mutate} useOneTap width="334px" />
                            </div>
                            <Button variant="outline" className="w-full h-11">
                                <Github className="w-5 h-5 mr-2" /> Continue with GitHub
                            </Button>
                        </div>

                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                            <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or continue with</span></div>
                        </div>

                        <div className="space-y-4">
                            <InputField id="username" label="Username" register={register} errors={errors} dirtyFields={dirtyFields} placeholder="Enter your username" />
                            <InputField id="email" label="Email" type="email" register={register} errors={errors} dirtyFields={dirtyFields} placeholder="Enter your email" />
                            <InputField id="password" label="Password" type="password" register={register} errors={errors} dirtyFields={dirtyFields} placeholder="Create a password" />
                            <InputField id="confirmPassword" label="Confirm Password" type="password" register={register} errors={errors} dirtyFields={dirtyFields} placeholder="Confirm password" />
                            <InputField
                                id="phone"
                                label="Mobile Number"
                                type="tel"
                                register={register}
                                errors={errors}
                                dirtyFields={dirtyFields}
                                placeholder="Enter 10 digit number"
                                onChange={handleMobileInput}
                            />
                            {mobileLength > 0 && mobileLength < 10 && (
                                <span className="text-sm text-destructive">Please enter exactly 10 digits ({10 - mobileLength} remaining)</span>
                            )}

                            <Button type="submit" className="w-full" disabled={signupMutation.isPending}>
                                {signupMutation.isPending ? "Creating..." : "Create Account"}
                            </Button>
                        </div>

                        <p className="text-center text-sm">
                            Already have an account? <Link to="/login" className="text-primary underline">Login</Link>
                        </p>
                    </form>
                </Card>

                <p className="mt-4 text-center text-xs text-muted-foreground">
                    By signing up, you agree to our <Link to="/" className="text-primary underline">Terms</Link> and <Link to="/" className="text-primary underline">Privacy Policy</Link>.
                </p>
            </div>
        </GoogleOAuthProvider>
    );
}

export default SignupPage;