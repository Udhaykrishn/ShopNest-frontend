import { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCartIcon } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import CartItem from './CartItem';
import { useCartMutation, useCartQuery } from '@/hooks/cart/useCart';
import { useCartStore } from '@/stores/cart/useCartStore';
import { Link, useNavigate } from '@tanstack/react-router';
import { api } from '@/types';
import { useToast } from '@/hooks';

const CartList = () => {
    const { data: cartData, isLoading } = useCartQuery();
    const { clearCart } = useCartMutation();
    const { setCartLength, cartList: cartItems, cartLength, setCartList } = useCartStore();
    const { toast } = useToast();
    const navigate = useNavigate();
    const [isClearCartModalOpen, setIsClearCartModalOpen] = useState(false);

    useEffect(() => {
        if (cartData?.data) {
            setCartList(
                cartData.data.items.map((item) => ({
                    product: {
                        id: item._id,
                        name: item.sku,
                        price: item.subTotal / item.quantity,
                        image: item.image,
                        stock: item.quantity,
                    },
                    quantity: item.quantity,
                }))
            );
            setCartLength(cartData.data.items.length);
        }
    }, [cartData, setCartLength, setCartList]);

    const total = useMemo(() => {
        return cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    }, [cartItems]);

    const handleCheckout = async () => {
        try {
            const { data } = await api.get('/checkout');

            if (data?.success === false) {
                toast({
                    title: 'Unavailable product found',
                    description: data.message,
                    variant: 'default',
                });
                return;
            }
            navigate({ to: '/checkout' });
        } catch (error: any) {
            console.log(error.message);
            toast({
                title: 'Internal server problem',
                description: error.message,
                variant: 'destructive',
            });
        }
    };

    const confirmClearCart = async () => {
        try {
            await clearCart.mutateAsync();
            toast({
                title: 'User cart',
                description: 'User cart deleted successfully',
            });
            setIsClearCartModalOpen(false);
        } catch (error: any) {
            console.log(error.message);
            toast({
                title: 'Failed to clear cart',
                description: error.message,
                variant: 'destructive',
            });
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6 h-screen mt-20">
                <div className="space-y-1">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-5 w-32" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-4">
                        <Skeleton className="h-16 w-full" />
                        <div className="space-y-2">
                            {[...Array(3)].map((_, index) => (
                                <div key={index} className="flex gap-4 p-4">
                                    <Skeleton className="h-20 w-20" />
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-5 w-3/4" />
                                        <Skeleton className="h-5 w-1/2" />
                                    </div>
                                    <Skeleton className="h-5 w-16" />
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between p-4">
                            <Skeleton className="h-10 w-32" />
                            <Skeleton className="h-10 w-32" />
                        </div>
                    </div>
                    <div className="md:col-span-1">
                        <Skeleton className="h-64 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center text-center">
                <ShoppingCartIcon size={64} className="text-gray-300 mb-4" />
                <h2 className="text-2xl font-medium mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
                <Button asChild>
                    <Link to={'/shop'}>Continue Shopping</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 h-screen mt-20">
            <div className="space-y-1">
                <h2 className="text-2xl font-semibold">Shopping Cart</h2>
                <p className="text-gray-500">
                    {cartLength} {cartLength === 1 ? 'item' : 'items'} in your cart
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                    <div className="bg-white rounded-lg shadow-sm">
                        <div className="hidden md:grid grid-cols-12 gap-4 p-4 text-sm font-medium text-gray-500 border-b">
                            <div className="col-span-6">Product</div>
                            <div className="col-span-3">Quantity</div>
                            <div className="col-span-3 text-right">Subtotal</div>
                        </div>

                        <div className="divide-y">
                            {cartItems.map((item) => (
                                <CartItem key={item.product.id} item={item} />
                            ))}
                        </div>

                        <div className="p-4 flex justify-between">
                            <AlertDialog open={isClearCartModalOpen} onOpenChange={setIsClearCartModalOpen}>
                                <AlertDialogTrigger asChild>
                                    <Button variant="outline">Clear Cart</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Clear Your Cart?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to remove all items from your cart? This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={confirmClearCart}>Clear</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            <Button asChild variant="outline">
                                <Link to="/shop">Continue Shopping</Link>
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-1">
                    <Card className="p-6 sticky top-4">
                        <h3 className="font-medium text-lg mb-4">Order Summary</h3>

                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Subtotal</span>
                                <span>{total.toLocaleString()}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-500">Shipping</span>
                                <span>Calculated at checkout</span>
                            </div>

                            <div className="border-t pt-2 mt-2">
                                <div className="flex justify-between font-medium text-lg">
                                    <span>Total</span>
                                    <span>{total.toLocaleString()}</span>
                                </div>
                                <p className="text-gray-500 text-xs mt-1">Tax included where applicable</p>
                            </div>
                        </div>

                        <Button className="w-full" size="lg" onClick={handleCheckout}>
                            Proceed to Checkout
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CartList;