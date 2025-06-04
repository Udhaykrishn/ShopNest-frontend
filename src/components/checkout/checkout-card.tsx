import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { CartItem } from '@/types/checkout'
import { formatINR } from '@/utils'
import { Separator } from '../ui/separator'

type CheckoutOrderProps = {
    cartItems: CartItem[];
    subtotal: number;
    discount: number;
    appliedCoupon: any;
    total: number
}

export const CheckoutOrder = ({ cartItems, subtotal, discount, appliedCoupon, total }: CheckoutOrderProps) => {
    return (
        <Card className="shadow-lg sticky top-6 w-[400px]">
            <CardHeader>
                <CardTitle className="text-primary">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {cartItems.map((item: CartItem) => (
                    <div key={item._id} className="flex gap-4">
                        <img
                            src={item.image}
                            alt={`Product ${item.productId}`}
                            className="w-20 h-20 object-cover rounded-md"
                        />
                        <div className="flex-1">
                            <p className="font-medium">Product #{item.productId.slice(-6)}</p>
                            <p className="text-sm text-muted-foreground">
                                Qty: {item.quantity} • SKU: {item.sku}
                            </p>
                            <p className="text-primary font-semibold">
                                {formatINR(item.subTotal)}
                            </p>
                        </div>
                    </div>
                ))}
                <Separator />
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="text-primary">{formatINR(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Shipping</span>
                        <span className="text-primary">Free shipping!</span>
                    </div>
                    {discount > 0 && appliedCoupon && (
                        <div className="flex justify-between">
                            <span>Discount ({appliedCoupon.name})</span>
                            <span className="text-primary">-{formatINR(discount)}</span>
                        </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span className="text-primary text-lg">{formatINR(total)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
