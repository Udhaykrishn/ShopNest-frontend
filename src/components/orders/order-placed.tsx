import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from '@tanstack/react-router';

const OrderSuccess: React.FC = () => {

    const navigate = useNavigate()
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
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <motion.div
                            variants={iconVariants}
                            className="flex justify-center mb-4"
                        >
                            <CheckCircle2 className="h-16 w-16 text-primary" />
                        </motion.div>
                        <CardTitle className="text-2xl font-bold text-primary">
                            Order Placed Successfully!
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4 text-center">
                        <p className="text-gray-600">
                            Thank you for your purchase! Your order has been successfully placed and is being processed.
                        </p>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-500">
                                You'll receive a confirmation email shortly with all the details.
                            </p>
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-center gap-4">
                        <Button onClick={() => navigate({ to: "/profile/orders" })}
                            className="bg-primary hover:bg-primary/90"
                        >
                            View Orders
                        </Button>
                        <Link
                            to='/shop'
                        >
                            Continue Shopping
                        </Link>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
};

export default OrderSuccess;