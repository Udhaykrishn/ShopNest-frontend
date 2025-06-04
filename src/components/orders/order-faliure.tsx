import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from '@tanstack/react-router';

export const OrderFailure: React.FC = () => {
    const navigate = useNavigate();
    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const iconVariants = {
        hidden: { scale: 0 },
        visible: {
            scale: 1,
            transition: {
                duration: 0.3,
                delay: 0.2,
                type: "spring",
                stiffness: 200
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
            >
                <Card className="w-full max-w-md border-red-200">
                    <CardHeader className="text-center">
                        <motion.div
                            variants={iconVariants}
                            className="flex justify-center mb-4"
                        >
                            <XCircle className="h-16 w-16 text-red-500" />
                        </motion.div>
                        <CardTitle className="text-2xl font-bold text-red-600">
                            Order Failed
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4 text-center">
                        <p className="text-gray-600">
                            We're sorry, but there was an issue processing your payment. You can retry the payment or continue shopping.
                        </p>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-500">
                                If the issue persists, please contact our support team for assistance.
                            </p>
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-center gap-4">
                        <Button 
                            onClick={() => navigate({ to: "/profile/orders" })}
                            className="bg-red-500 hover:bg-red-600"
                        >
                            View Orders
                        </Button>
                        <Button 
                            onClick={() => navigate({ to: "/shop" })}
                            variant="outline"
                            className="border-red-500 text-red-500 hover:bg-red-50"
                        >
                            Continue Shopping
                        </Button>

                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
};