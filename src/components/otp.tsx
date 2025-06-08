import React, { useState } from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { Timer, RefreshCw, KeyRound, Loader2 } from "lucide-react";
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { otpStore } from '@/stores/otp';
import { useToast } from '@/hooks/use-toast';
import { useTimer } from 'react-timer-hook';
import { useNavigate } from '@tanstack/react-router';

const OTPVerification = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [otp, setOTP] = useState<string>("");
    const { email } = otpStore(state => state);

    const expiryTimestamp = new Date();
    expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + 10);


    const {
        seconds,
        minutes,
        isRunning,
        restart
    } = useTimer({
        expiryTimestamp,
        onExpire: () => console.log('Timer expired'),
        autoStart: true
    });
    const handleOTPChange = (value: string): void => {
        const numbersOnly = value.replace(/[^0-9]/g, '');
        setOTP(numbersOnly);

    };

    const resendMutation = useMutation({
        mutationFn: async () => {
            try {
                const payload = { email };
                const res = await axios.post("https://shopnest.zapto.org/api/auth/user/resend-otp", payload);
                return res.data;
            } catch (error: any) {
                const err = error.response?.data;
                if (err?.errors?.length !== 0) {
                    err.errors.forEach((data: Record<string, Array<string>>) => {
                        toast({
                            variant: "destructive",
                            title: "Failed to Resend OTP",
                            description: data.errors[0] || "Unexpected error occurred"
                        });
                    });
                } else {
                    toast({
                        variant: "destructive",
                        title: "Failed to Resend OTP",
                        description: error.response?.data?.message || "Unexpected error occurred"
                    });
                }
                throw new Error(error.response?.data?.message || "Resend OTP failed");
            }
        },
        onSuccess: () => {
            setOTP("");

            const newExpiryTime = new Date();
            newExpiryTime.setSeconds(newExpiryTime.getSeconds() + 20);
            restart(newExpiryTime);
            toast({
                title: "OTP Resent",
                description: "A new verification code has been sent to your email",
            });
        }
    });

    const otpMutation = useMutation({
        mutationFn: async (data: string) => {
            try {
                const payload = { email, otp: data };

                const { data: res } = await axios.post(`https://shopnest.zapto.org/api/auth/user/verify-otp`, payload);
                return res;
            } catch (error: any) {
                const err = error.response?.data;
                if (err?.errors?.length !== 0) {
                    err.errors.forEach((data: Record<string, Array<string>>) => {
                        toast({
                            variant: "destructive",
                            title: "Verification Failed",
                            description: data.errors[0] || "Unexpected error occurred"
                        });
                    });
                } else {
                    toast({
                        variant: "destructive",
                        title: "Verification Failed",
                        description: error.response?.data?.message || "Unexpected error occurred"
                    });
                }
                throw new Error(error.response?.data?.message || "Verification failed");
            }
        },
        onSuccess: () => {
            toast({
                title: "Verification Successful",
                description: "Your account has been verified successfully",
            });

            navigate({ to: `/shop` })
        }
    });

    const handleResendOTP = (): void => {
        resendMutation.mutate();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (!/[0-9]/.test(e.key) &&
            e.key !== 'Backspace' &&
            e.key !== 'Delete' &&
            e.key !== 'Tab' &&
            e.key !== 'ArrowLeft' &&
            e.key !== 'ArrowRight'
        ) {
            e.preventDefault();
        }
    };


    const formattedTime = `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;

    return (

        <>

            <div className="flex items-center justify-center min-h-screen bg-background p-4">
                <Card className="w-full max-w-[500px] shadow-lg">
                    <CardHeader className="space-y-3">
                        <div className="flex justify-center">
                            <div className="bg-primary/10 p-3 rounded-full">
                                <KeyRound className="w-6 h-6 text-primary" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold text-center">
                            Verification Code
                        </CardTitle>
                        <CardDescription className="text-center text-base">
                            Please enter the 6-digit verification code sent to <span className="font-medium">{email || "your email"}</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div className="flex justify-center">
                            <div className="w-full px-4 sm:px-8">
                                <InputOTP
                                    value={otp}
                                    onChange={handleOTPChange}
                                    maxLength={6}
                                    className="gap-2"
                                    onKeyDown={handleKeyDown}
                                    disabled={otpMutation.isPending}
                                >
                                    <InputOTPGroup className="flex justify-between w-full">
                                        {Array.from({ length: 6 }).map((_, i) => (
                                            <React.Fragment key={i}>
                                                <InputOTPSlot
                                                    index={i}
                                                    className="w-[40px] sm:w-[48px] h-[40px] sm:h-[48px] text-center text-lg rounded-md border-2 border-border focus-visible:ring-1 focus-visible:ring-primary transition-all duration-200"
                                                />
                                                {i !== 5 && <InputOTPSeparator className="hidden sm:inline-block">-</InputOTPSeparator>}
                                            </React.Fragment>
                                        ))}
                                    </InputOTPGroup>
                                </InputOTP>
                            </div>
                        </div>

                        <div className="text-center space-y-4">
                            {isRunning ? (
                                <div className="flex items-center justify-center gap-2 text-muted-foreground bg-muted/50 py-2 px-4 rounded-full mx-auto w-fit">
                                    <Timer className="h-4 w-4 animate-pulse" />
                                    <span className="text-sm font-medium">
                                        {formattedTime} remaining
                                    </span>
                                </div>
                            ) : (
                                <Button
                                    variant="outline"
                                    onClick={handleResendOTP}
                                    className="gap-2 rounded-full hover:bg-primary hover:text-white transition-colors"
                                    disabled={resendMutation.isPending}
                                >
                                    {resendMutation.isPending ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <RefreshCw className="h-4 w-4" />
                                            Resend Code
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="px-4 pb-4">
                        <Button
                            className="w-full rounded-full text-white h-11 text-base font-medium shadow-sm"
                            disabled={otp.length !== 6 || otpMutation.isPending}
                            onClick={() => otpMutation.mutate(otp)}
                        >
                            {otpMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                "Verify Code"
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </div>

        </>
    );
};

export default OTPVerification;