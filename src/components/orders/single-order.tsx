import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, CreditCard, ChevronRight, Calendar, FileText, Truck, CheckCircle } from "lucide-react";
import { formatINR } from '@/utils';
import { useNavigate, useRouter } from '@tanstack/react-router';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDownloadInvoice, useOrderMutation } from '@/hooks/orders';
import { useToast } from '@/hooks';
import { usePayment } from '@/hooks/payment';
import { PaymentComponent } from '../payment';
import { usePaymentHooks } from '@/hooks/checkout';

interface OrderItem {
    _id: string;
    image: string;
    productName: string;
    quantity: number;
    price: number;
    sku: string;
    itemStatus: string;
    returnReason?: string;
    returnStatus?: "pending" | "approved" | "rejected";
    returnRequestedAt?: Date;
    returnComment?: string;
    returnRejectedAt?: Date;
    returnApprovedAt?: Date;
    cancelReason?: string;
}

interface ShippingAddress {
    street: string;
    city: string;
    state: string;
    district: string;
    country: string;
    pincode: string;
    phone: string;
    name: string;
    type: string;
    landmark?: string;
}

interface Order {
    _id: string;
    orderId: number;
    orderItems: OrderItem[];
    subtotal: number;
    totalAmount: number;
    status: 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
    shippingAddress: ShippingAddress;
    paymentMethod: string;
    paymentStatus: string;
    orderedDate: string;
    shippedDate?: string | null;
    deliveredDate?: string | null;
    couponApplied: boolean;
    couponCode: string | null;
    couponDiscount: number | null;
}

const cancelReasons = [
    'Changed my mind',
    'Ordered by mistake',
    'Found a better price elsewhere',
    'Other',
];

const returnReasons = [
    'Defective product',
    'Wrong item delivered',
    'Not as described',
    'Other',
];

const cancelEntireOrder = async (orderId: string, reason: string) => {
    console.log(`Canceling entire order with ID: ${orderId}, Reason: ${reason}`);
};



const OrderStatusStepper: React.FC<{ status: Order['status'] }> = ({ status }) => {
    const steps = [
        { name: 'processing', icon: <FileText className="w-6 h-6" />, color: 'bg-blue-500' },
        { name: 'shipped', icon: <Truck className="w-6 h-6" />, color: 'bg-yellow-500' },
        { name: 'delivered', icon: <CheckCircle className="w-6 h-6" />, color: 'bg-green-500' },
    ] as const;

    const statusColors: Record<Order['status'], string> = {
        processing: 'bg-blue-500',
        shipped: 'bg-yellow-500',
        delivered: 'bg-green-500',
        cancelled: 'bg-red-500',
        returned: 'bg-orange-500',
    };

    const isCancelled = status === 'cancelled';
    const isReturned = status === 'returned';
    const statusIndex = isCancelled || isReturned ? -1 : steps.findIndex(step => step.name === status);

    const isComplete = (step: typeof steps[number]) =>
        steps.findIndex(s => s.name === step.name) <= statusIndex && !isCancelled && !isReturned;

    return (
        <div className="relative flex items-center justify-between w-full max-w-3xl mx-auto mt-8">
            {steps.map((step, index) => (
                <div key={step.name} className="flex-1 text-center relative">
                    <div className="flex items-center justify-center">
                        {index > 0 && (
                            <div
                                className={`flex-1 h-2 rounded-full transition-all duration-300 ${isComplete(steps[index]) ? step.color : 'bg-gray-200'
                                    }`}
                            />
                        )}
                        <div className="relative z-10">
                            <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto transition-all duration-300 ${isComplete(step) ? `${step.color} text-white` : 'bg-gray-200 text-gray-600'
                                    } ${isCancelled || isReturned ? 'opacity-60' : ''}`}
                            >
                                {step.icon}
                            </div>
                            <p className="mt-3 text-sm font-medium capitalize text-gray-700">{step.name}</p>
                        </div>
                        {index < steps.length - 1 && (
                            <div
                                className={`flex-1 h-2 rounded-full transition-all duration-300 ${isComplete(steps[index + 1]) ? steps[index + 1].color : 'bg-gray-200'
                                    }`}
                            />
                        )}
                    </div>
                </div>
            ))}
            {(isCancelled || isReturned) && (
                <Badge
                    className={`absolute -top-4 right-0 text-xs font-semibold ${statusColors[status]} text-white`}
                >
                    {isCancelled ? 'Cancelled' : 'Returned'}
                </Badge>
            )}
        </div>
    );
};

export const SingleOrder: React.FC<{ orders: Order }> = ({ orders }) => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const router = useRouter()
    const [isCancelOrderDialogOpen, setIsCancelOrderDialogOpen] = useState(false);
    const [isCancelItemDialogOpen, setIsCancelItemDialogOpen] = useState<string | null>(null);
    const [isReturnItemDialogOpen, setIsReturnItemDialogOpen] = useState<string | null>(null);
    const [cancelOrderReason, setCancelOrderReason] = useState('');
    const [cancelItemReason, setCancelItemReason] = useState('');
    const [returnItemReason, setReturnItemReason] = useState('');
    const { cancelPerItemOrder, orderReturnMutation } = useOrderMutation();
    const invoice = useDownloadInvoice({ orderId: orders.orderId });
    const { retryPayment } = usePayment()
    const { handlePaymentDismiss } = usePaymentHooks({})

    const isPaymentFailed = orders.paymentStatus === 'failed';

    const downloadInvoice = async () => {
        try {
            await invoice.refetch();
            toast({
                title: "Invoice downloaded successfully",
                variant: "default",
            });
        } catch (error: any) {
            toast({
                title: error.message || "Failed to download invoice",
                variant: "destructive",
            });
        }
    };

    const cancelOrderItem = async (orderId: number, itemId: string, reason: string) => {
        await cancelPerItemOrder.mutateAsync({ orderId, itemOrderId: itemId, reason });
    };

    const returnOrderItem = async (orderId: number, sku: string, reason: string) => {
        await orderReturnMutation.mutateAsync({ orderId, sku, reason });
    };

    const handleCancelEntireOrder = () => {
        if (cancelOrderReason) {
            cancelEntireOrder(orders._id, cancelOrderReason);
            setIsCancelOrderDialogOpen(false);
            setCancelOrderReason('');
        }
    };

    const handleCancelItem = (itemId: string) => {
        if (cancelItemReason) {
            cancelOrderItem(orders.orderId, itemId, cancelItemReason);
            setIsCancelItemDialogOpen(null);
            setCancelItemReason('');
        }
    };

    const createIdAndretryPayment = async (orderId: number, paymentId: string) => {
        await retryPayment.mutateAsync({ orderId, paymentId }, {
            onSuccess: () => {
                toast({
                    title: "Payment successfuly done",
                    description: "Your retry payment is successfully done",
                })
            },
            onError: (error: any) => {
                toast({
                    title: "Retry payment failed",
                    description: error.message || error.response.data.message || "Something went wrong",
                    variant: "destructive"
                })
            },
            onSettled: () => {
                router.invalidate();
            }
        })
    };

    const handleReturnItem = (itemId: string) => {
        if (returnItemReason) {
            returnOrderItem(orders.orderId, itemId, returnItemReason);
            setIsReturnItemDialogOpen(null);
            setReturnItemReason('');
        }
    };

    const handleRetryPayment = (response: any) => {
        createIdAndretryPayment(orders.orderId, response.razorpay_payment_id);
    };

    const formatDate = (date: string | Date | null | undefined) =>
        date
            ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
            : 'N/A';

    const statusColors: Record<Order['status'], string> = {
        processing: 'bg-blue-100 text-blue-800 border-blue-300',
        shipped: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        delivered: 'bg-green-100 text-green-800 border-green-300',
        cancelled: 'bg-red-100 text-red-800 border-red-300',
        returned: 'bg-orange-100 text-orange-800 border-orange-300',
    };

    const returnStatusColors: Record<NonNullable<OrderItem['returnStatus']>, string> = {
        pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        approved: 'bg-green-100 text-green-800 border-green-300',
        rejected: 'bg-red-100 text-red-800 border-red-300',
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <Button
                        variant="ghost"
                        className="text-primary hover:bg-primary/10 text-base font-medium"
                        onClick={() => navigate({ to: '/profile/orders' })}
                    >
                        <ChevronRight className="mr-2 h-5 w-5 rotate-180" />
                        Back to Orders
                    </Button>
                    <div className="flex flex-col items-end gap-3">
                        {
                            !isPaymentFailed && (
                                <Button
                                    variant="outline"
                                    onClick={downloadInvoice}
                                    className="text-primary border-primary hover:bg-primary/10 font-medium"
                                    disabled={invoice.isFetching}
                                >
                                    <FileText className="mr-2 h-5 w-5" />
                                    {invoice.isFetching ? 'Downloading...' : 'Download Invoice'}
                                </Button>
                            )
                        }
                        {invoice.error && (
                            <p className="text-sm text-red-500 font-medium">
                                {invoice.error.message}
                            </p>
                        )}
                    </div>
                </div>

                <Card className="shadow-xl border border-gray-200 rounded-xl">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-xl">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <CardTitle className="text-2xl sm:text-3xl font-bold text-primary">
                                Order #{orders.orderId}
                            </CardTitle>
                            {!isPaymentFailed && (
                                <Badge
                                    variant="outline"
                                    className={`text-sm font-semibold capitalize border-2 ${statusColors[orders.status]}`}
                                >
                                    {orders.status}
                                </Badge>
                            )}
                        </div>
                        {!isPaymentFailed && (
                            <div className="flex flex-col gap-2 text-sm text-gray-600 mt-4">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-primary" />
                                    <p>Ordered on {formatDate(orders.orderedDate)}</p>
                                </div>
                                {['shipped', 'delivered'].includes(orders.status) && orders.shippedDate && (
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5 text-primary" />
                                        <p>Shipped on {formatDate(orders.shippedDate)}</p>
                                    </div>
                                )}
                                {orders.status === 'delivered' && orders.deliveredDate && (
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5 text-primary" />
                                        <p>Delivered on {formatDate(orders.deliveredDate)}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardHeader>
                    <CardContent className="space-y-8 p-6">
                        {isPaymentFailed && (
                            <div className="flex flex-col items-center gap-4 mb-8">
                                <p className="text-lg font-semibold text-red-600">Payment Failed</p>
                                <div className='w-56'>
                                    <PaymentComponent
                                        amount={orders.totalAmount}
                                        onSuccess={handleRetryPayment}
                                        onDismiss={handlePaymentDismiss}
                                        onFailure={handlePaymentDismiss}
                                    />
                                </div>
                            </div>
                        )}
                        {!isPaymentFailed && <OrderStatusStepper status={orders.status} />}
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Items</h3>
                            {orders.orderItems.map((item) => {
                                const canCancelItem = !isPaymentFailed && !['cancelled', 'returned', 'delivered'].includes(item.itemStatus);
                                const isReturnRequested = item.returnStatus === 'pending' || item.returnStatus === "approved" || item.returnStatus === "rejected";
                                const canReturnItem = !isPaymentFailed && isReturnRequested === false && item.itemStatus === 'delivered';
                                const isReturnProcessed = item.returnStatus === 'approved' || item.returnStatus === 'rejected';

                                return (
                                    <div
                                        key={item._id}
                                        className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow mb-4"
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.productName}
                                            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-md"
                                        />
                                        <div className="flex-1">
                                            <p className="text-base sm:text-lg font-medium text-gray-800">{item.productName}</p>
                                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                            <p className="text-sm text-gray-600">Price: {formatINR(item.price)}</p>
                                            {!isPaymentFailed && (
                                                <>
                                                    <p className="text-sm text-gray-600 capitalize">
                                                        Status: <span className={statusColors[item.itemStatus]}>{item.itemStatus}</span>
                                                    </p>
                                                    {item.itemStatus === 'cancelled' && item.cancelReason && (
                                                        <p className="text-sm text-gray-600">
                                                            Cancellation Reason: {item.cancelReason}
                                                        </p>
                                                    )}
                                                    {(isReturnRequested || isReturnProcessed) && (
                                                        <div className="mt-2">
                                                            <p className="text-sm text-gray-600">
                                                                Return Status: <span className={returnStatusColors[item.returnStatus!]}>{item.returnStatus}</span>
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                Return Reason: {item.returnReason}
                                                            </p>
                                                            {item.returnStatus === 'pending' && item.returnRequestedAt && (
                                                                <p className="text-sm text-gray-600">
                                                                    Requested on: {formatDate(item.returnRequestedAt)}
                                                                </p>
                                                            )}
                                                            {item.returnStatus === 'approved' && item.returnApprovedAt && (
                                                                <p className="text-sm text-gray-600">
                                                                    Approved on: {formatDate(item.returnApprovedAt)}
                                                                </p>
                                                            )}
                                                            {item.returnStatus === 'rejected' && (
                                                                <>
                                                                    {item.returnComment && (
                                                                        <p className="text-sm text-gray-600">
                                                                            Rejection Reason: {item.returnComment}
                                                                        </p>
                                                                    )}
                                                                    {item.returnRejectedAt && (
                                                                        <p className="text-sm text-gray-600">
                                                                            Rejected on: {formatDate(item.returnRejectedAt)}
                                                                        </p>
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                        {!isPaymentFailed && (
                                            <div className="flex flex-col sm:flex-row gap-2">
                                                {canCancelItem && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setIsCancelItemDialogOpen(item._id)}
                                                        className="text-red-600 border-red-500 hover:bg-red-50 font-medium"
                                                    >
                                                        Cancel Item
                                                    </Button>
                                                )}
                                                {canReturnItem && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setIsReturnItemDialogOpen(item.sku)}
                                                        className="text-orange-600 border-orange-500 hover:bg-orange-50 font-medium"
                                                    >
                                                        Return Item
                                                    </Button>
                                                )}
                                                {item

                                                    .returnStatus === "pending" && (
                                                        <span className="text-sm font-medium text-yellow-600">
                                                            Return Requested
                                                        </span>
                                                    )}
                                                {item.returnStatus === "approved" && (
                                                    <span className="text-red-600 border-red-500 hover:bg-red-50 font-medium">Item Returned</span>
                                                )}
                                                {item.returnStatus === "rejected" && (
                                                    <span className="text-red-600 border-red-500 hover:bg-red-50 font-medium">Return Rejected</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h3>
                            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                                <div className="flex justify-between text-sm text-gray-600 mb-2">
                                    <span>Subtotal</span>
                                    <span>{formatINR(orders.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600 mb-2">
                                    <span>Shipping</span>
                                    <span>{formatINR(0)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600 mb-2">
                                    <span>Tax</span>
                                    <span>{formatINR(0)}</span>
                                </div>
                                {orders.couponDiscount && (
                                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                                        <span>Coupon discount:</span>
                                        <span>{formatINR(orders.couponDiscount)}</span>
                                    </div>
                                )}
                                <Separator className="my-4" />
                                <div className="flex justify-between text-base font-semibold text-gray-800">
                                    <span>Total</span>
                                    <span>{formatINR(orders.totalAmount)}</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Shipping Address</h3>
                            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm flex items-start gap-3">
                                <MapPin className="h-6 w-6 text-primary mt-1" />
                                <div>
                                    <p className="text-base font-medium text-gray-800">{orders.shippingAddress.name}</p>
                                    <p className="text-sm text-gray-600">
                                        {orders.shippingAddress.street}, {orders.shippingAddress.city}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {orders.shippingAddress.district}, {orders.shippingAddress.state}{' '}
                                        {orders.shippingAddress.pincode}
                                    </p>
                                    <p className="text-sm text-gray-600">{orders.shippingAddress.country}</p>
                                    <p className="text-sm text-gray-600">Phone: {orders.shippingAddress.phone}</p>
                                    {orders.shippingAddress.landmark && (
                                        <p className="text-sm text-gray-600">
                                            Landmark: {orders.shippingAddress.landmark}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Payment Information</h3>
                            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm flex items-start gap-3">
                                <CreditCard className="h-6 w-6 text-primary mt-1" />
                                <div>
                                    <p className="text-sm text-gray-600">Method: {orders.paymentMethod}</p>
                                    <p className="text-sm text-gray-600 capitalize">
                                        Status: <span className={statusColors[orders.status]}>{orders.paymentStatus}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {!isPaymentFailed && (
                <>
                    <Dialog open={isCancelOrderDialogOpen} onOpenChange={setIsCancelOrderDialogOpen}>
                        <DialogContent className="rounded-lg">
                            <DialogHeader>
                                <DialogTitle className="text-xl">Cancel Entire Order</DialogTitle>
                                <DialogDescription className="text-gray-600">
                                    Are you sure you want to cancel this order? Please select a reason for cancellation.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="cancelOrderReason" className="text-sm font-medium">Reason for Cancellation</Label>
                                    <Select onValueChange={setCancelOrderReason} value={cancelOrderReason}>
                                        <SelectTrigger id="cancelOrderReason" className="mt-1">
                                            <SelectValue placeholder="Select a reason" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {cancelReasons.map((reason) => (
                                                <SelectItem key={reason} value={reason}>
                                                    {reason}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter className="mt-6">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setIsCancelOrderDialogOpen(false);
                                        setCancelOrderReason('');
                                    }}
                                    className="font-medium"
                                >
                                    Close
                                </Button>
                                <Button
                                    variant="destructive"
                                    disabled={!cancelOrderReason}
                                    onClick={handleCancelEntireOrder}
                                    className="font-medium"
                                >
                                    Confirm Cancellation
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={!!isCancelItemDialogOpen} onOpenChange={() => setIsCancelItemDialogOpen(null)}>
                        <DialogContent className="rounded-lg">
                            <DialogHeader>
                                <DialogTitle className="text-xl">Cancel Item</DialogTitle>
                                <DialogDescription className="text-gray-600">
                                    Are you sure you want to cancel this item? Please select a reason for cancellation.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="cancelItemReason" className="text-sm font-medium">Reason for Cancellation</Label>
                                    <Select onValueChange={setCancelItemReason} value={cancelItemReason}>
                                        <SelectTrigger id="cancelItemReason" className="mt-1">
                                            <SelectValue placeholder="Select a reason" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {cancelReasons.map((reason) => (
                                                <SelectItem key={reason} value={reason}>
                                                    {reason}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter className="mt-6">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setIsCancelItemDialogOpen(null);
                                        setCancelItemReason('');
                                    }}
                                    className="font-medium"
                                >
                                    Close
                                </Button>
                                <Button
                                    variant="destructive"
                                    disabled={!cancelItemReason}
                                    onClick={() => handleCancelItem(isCancelItemDialogOpen!)}
                                    className="font-medium"
                                >
                                    Confirm Cancellation
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={!!isReturnItemDialogOpen} onOpenChange={() => setIsReturnItemDialogOpen(null)}>
                        <DialogContent className="rounded-lg">
                            <DialogHeader>
                                <DialogTitle className="text-xl">Return Item</DialogTitle>
                                <DialogDescription className="text-gray-600">
                                    Are you sure you want to return this item? Please select a reason for the return.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="returnItemReason" className="text-sm font-medium">Reason for Return</Label>
                                    <Select onValueChange={setReturnItemReason} value={returnItemReason}>
                                        <SelectTrigger id="returnItemReason" className="mt-1">
                                            <SelectValue placeholder="Select a reason" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {returnReasons.map((reason) => (
                                                <SelectItem key={reason} value={reason}>
                                                    {reason}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter className="mt-6">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setIsReturnItemDialogOpen(null);
                                        setReturnItemReason('');
                                    }}
                                    className="font-medium"
                                >
                                    Close
                                </Button>
                                <Button
                                    variant="default"
                                    disabled={!returnItemReason}
                                    onClick={() => handleReturnItem(isReturnItemDialogOpen!)}
                                    className="bg-orange-500 hover:bg-orange-600 text-white font-medium"
                                >
                                    Confirm Return
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </>
            )}
        </div>
    );
};