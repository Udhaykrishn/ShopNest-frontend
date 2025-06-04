import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { z } from "zod";
import { useAdminMutation } from "@/hooks/useAdmin";
import { useNavigate } from "@tanstack/react-router";
import { useToast } from "@/hooks";

const loginSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email format")
        .trim(),
    password: z
        .string()
        .min(1, "Password is required")
        .min(8, "Password must be at least 8 characters")
        .regex(
            /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/,
            "Password must contain at least one uppercase letter, one number, and one special character"
        )
        .trim(),
});

export type LoginInput = z.infer<typeof loginSchema>;

const AdminLoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { loginAdmin } = useAdminMutation();
    const { toast } = useToast()
    const navigate = useNavigate()

    const form = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginInput) => {
        await loginAdmin.mutateAsync(data, {
            onSuccess: () => {
                navigate({ to: "/admin" })
            },
            onError: (error: any) => {
                toast({
                    title: "Login failed",
                    description: error.response.data.message,
                    variant:"destructive"
                })
            }
        });

    };

    return (
        <div className="min-h-screen bg- flex items-center justify-center px-4">
            <div className="w-full max-w-md space-y-4">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold text-primary">Admin Portal</h1>
                    <p className="text-gray-500">Welcome back! Please login to continue.</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Admin Login</CardTitle>
                        <CardDescription>
                            Enter your credentials to access the admin dashboard
                        </CardDescription>
                    </CardHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <CardContent className="space-y-4">
                                {loginAdmin.isError && (
                                    <Alert variant="destructive">
                                        <AlertDescription>
                                            Invalid credentials. Please try again.
                                        </AlertDescription>
                                    </Alert>
                                )}

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        className="pl-9"
                                                        disabled={loginAdmin.isPending}
                                                    />
                                                </FormControl>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type={showPassword ? "text" : "password"}
                                                        className="pl-9"
                                                        disabled={loginAdmin.isPending}
                                                    />
                                                </FormControl>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                                    disabled={loginAdmin.isPending}
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                </button>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>

                            <CardFooter>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={loginAdmin.isPending}
                                >
                                    {loginAdmin.isPending ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            <span>Signing in...</span>
                                        </div>
                                    ) : (
                                        "Sign In"
                                    )}
                                </Button>
                            </CardFooter>
                        </form>
                    </Form>
                </Card>

                {/* Help Section */}
                <div className="text-center text-sm text-gray-600">
                    Need help? Contact IT Support
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;