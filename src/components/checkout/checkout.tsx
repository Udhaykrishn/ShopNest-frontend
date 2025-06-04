import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PlusCircle, Tag, X } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useCartQuery } from "@/hooks/cart/useCart";
import { useAddressQuery } from "@/hooks/address/useAddress";
import { useOrderMutation } from "@/hooks/orders";
import { useQueryClient } from "@tanstack/react-query";
import { AddressModal } from "@/components/address/address-modal";
import { useCartStore } from "@/stores/cart/useCartStore";
import { router } from "@/router";
import { formatINR } from "@/utils";
import { useToast } from "@/hooks";
import { PaymentComponent } from "../payment";
import { useCouponMutation, useValidCouponQuery } from "@/hooks/coupon";
import { useCouponStore } from "@/stores/coupon";
import { } from "@/types"
import { Address, CartItem, Coupon } from "@/types/checkout";
import { usePaymentHooks } from "@/hooks/checkout";
import { CheckoutOrder } from "./checkout-card";

export default function CheckoutPage() {
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "online">("COD");
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [showCoupons, setShowCoupons] = useState(false);
  const [couponInput, setCouponInput] = useState<string>("");

  const { data: cartData, isLoading: isCartLoading } = useCartQuery();
  const { data: addressData, isLoading: isAddressLoading } = useAddressQuery();
  const { applyCoupon, removeCoupon } = useCouponMutation();
  const navigate = useNavigate();
  const { postOrder } = useOrderMutation();
  const queryClient = useQueryClient();
  const { setCartLength } = useCartStore();
  const { toast } = useToast();
  const { coupon, setCoupon, clearCoupon } = useCouponStore();


  const addresses = addressData?.address || [];
  const cartItems = cartData?.data?.items || [];
  const subtotal = cartItems.reduce((sum: number, item: CartItem) => sum + item.subTotal, 0);
  const shipping = 0;
  const baseTotal = cartData?.data?.totalAmount || subtotal + shipping;
  const total = baseTotal - discount;
  const { data: coupons, isLoading: isCouponLoading } = useValidCouponQuery(baseTotal);
  
  const isCODAllowed = total <= 5000;
  
  const payload = {
    shippingAddress: selectedAddress,
    paymentMethod: "online",
    couponCode: coupon?.name || "",
    paymentStatus: "failed"
  };
  
  
  const { handlePaymentFailure, handlePaymentDismiss } = usePaymentHooks(payload)

  const handlePaymentSuccess = async (response: any) => {
    const payload = {
      shippingAddress: selectedAddress,
      paymentMethod: "online",
      payment_id: response.razorpay_payment_id,
      couponCode: coupon?.name || "",
      paymentStatus: "paid"
    };

    await postOrder.mutateAsync(payload, {
      onSuccess: () => {
        clearCoupon();
        setCouponInput("");
        router.navigate({ to: "/order", replace: true });
      },
    });
  };

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      const defaultAddress = addresses.find((addr: Address) => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress._id);
      } else {
        setSelectedAddress(addresses[0]._id);
      }
    }
  }, [addresses, selectedAddress]);

  useEffect(() => {
    if (!isCODAllowed && paymentMethod === "COD") {
      setPaymentMethod("online");
    }
  }, [isCODAllowed, paymentMethod]);

  // useEffect(() => {
  //   if (coupon && coupon._id && coupon.offerPrice > 0) {
  //     setAppliedCoupon(coupon);
  //     setDiscount(coupon.offerPrice);
  //     setCouponInput(coupon.name);
  //   } else {
  //     setAppliedCoupon(null);
  //     setDiscount(0);
  //     setCouponInput("");
  //   }
  // }, [coupon]);

  if (cartItems && cartItems?.length === 0) {
    navigate({ to: "/shop" });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      shippingAddress: selectedAddress,
      paymentMethod,
      couponCode: coupon?.name || "",
    };

    if (paymentMethod === "COD") {
      await postOrder.mutateAsync(payload, {
        onSuccess: () => {
          toast({
            title: "Order Placed",
            description: "Your order has been successfully placed!",
            variant: "default",
          });
          clearCoupon();
          setCouponInput("");
          setCartLength(0);
          router.navigate({ to: "/order", replace: true });
        },
        onError: () => {
          toast({
            title: "Order Failed",
            description: "Failed to place the order. Please try again.",
            variant: "destructive",
          });
        },
      });
    }
  };

  const handleAddressSuccess = () => {
    setIsAddressModalOpen(false);
    queryClient.invalidateQueries({ queryKey: ["address"] });
  };

  const handleApplyCoupon = async () => {
    if (!couponInput) {
      toast({
        title: "No Coupon Entered",
        description: "Please enter or select a coupon code.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (appliedCoupon) {
        await removeCoupon.mutateAsync(appliedCoupon.name, {
          onSuccess: () => {
            clearCoupon();
            setAppliedCoupon(null);
            setDiscount(0);
          },
          onError: (error: any) => {
            toast({
              title: "Failed to Remove Coupon",
              description: error.response?.data?.message || "Failed to remove existing coupon.",
              variant: "destructive",
            });
            return;
          },
        });
      }

      await applyCoupon.mutateAsync({ couponId: couponInput, amount: total }, {
        onSuccess: (data) => {
          setCoupon(data);
          setAppliedCoupon(data);
          setDiscount(data.offerPrice);
          setCouponInput(data.name);
          toast({
            title: "Coupon Applied",
            description: `Coupon ${data.name} applied successfully!`,
            variant: "default",
          });
        },
        onError: (error: any) => {
          toast({
            title: "Invalid Coupon",
            description: error.response?.data?.message || "Failed to apply coupon.",
            variant: "destructive",
          });
          setCouponInput("");
        },
      });
    } catch (error) {
      console.error("Apply coupon error:", error);
    }
  };

  const handleRemoveCoupon = async () => {
    if (!coupon?.name) {
      toast({
        title: "No Coupon Applied",
        description: "No coupon is currently applied.",
        variant: "destructive",
      });
      return;
    }

    try {
      await removeCoupon.mutateAsync(coupon.name, {
        onSuccess: () => {
          toast({
            title: "Coupon Removed",
            description: `Coupon ${coupon.name} removed successfully!`,
            variant: "default",
          });
          clearCoupon();
          setAppliedCoupon(null);
          setDiscount(0);
          setCouponInput("");
        },
        onError: (error: any) => {
          toast({
            title: "Failed to Remove Coupon",
            description: error.response?.data?.message || "Failed to remove coupon.",
            variant: "destructive",
          });
        },
      });
    } catch (error) {
      console.error("Remove coupon error:", error);
    }
  };

  const handleCouponSelect = (selectedCoupon: Coupon) => {
    setCouponInput(selectedCoupon.name);
    setShowCoupons(false);
  };

  if (isCartLoading || isAddressLoading) {
    return <div>Loading checkout data...</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-primary text-2xl">Checkout</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-primary">
                      Delivery Address
                    </h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsAddressModalOpen(true)}
                      type="button"
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Add New Address
                    </Button>
                  </div>

                  <RadioGroup
                    value={selectedAddress}
                    onValueChange={setSelectedAddress}
                    className="space-y-3"
                  >
                    {addresses.map((addr: Address) => (
                      <div
                        key={addr._id}
                        className="flex items-start space-x-2 p-3 border rounded-md hover:bg-muted"
                      >
                        <RadioGroupItem value={addr._id} id={addr._id} />
                        <div>
                          <Label htmlFor={addr._id} className="text-primary font-medium">
                            {addr.name} ({addr.type})
                            {addr.isDefault && (
                              <span className="ml-2 text-xs text-green-600">[Default]</span>
                            )}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {addr.street}, {addr.landmark && `${addr.landmark}, `}
                            {addr.city}, {addr.state} {addr.pincode}, {addr.country}
                          </p>
                          <p className="text-sm text-muted-foreground">Phone: {addr.phone}</p>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-4 mt-6">
                  <h2 className="text-lg font-semibold text-primary">
                    Payment Method
                  </h2>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(value: "COD" | "online") => setPaymentMethod(value)}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted">
                      <RadioGroupItem
                        value="COD"
                        id="cod"
                        disabled={!isCODAllowed}
                      />
                      <Label
                        htmlFor="cod"
                        className={`text-primary ${!isCODAllowed ? "text-muted-foreground" : ""}`}
                      >
                        Cash on Delivery (COD)
                      </Label>
                    </div>
                    {!isCODAllowed && (
                      <p className="text-sm text-red-600">
                        COD is not available for orders above {formatINR(5000)}.
                      </p>
                    )}
                    <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted">
                      <RadioGroupItem value="online" id="online" />
                      <Label htmlFor="online" className="text-primary">
                        Online
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-4 mt-6">
                  <h2 className="text-lg font-semibold text-primary">
                    Apply Coupon
                  </h2>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="text-primary"
                    />
                    {appliedCoupon ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={handleRemoveCoupon}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button type="button" variant="outline" onClick={handleApplyCoupon}>
                        <Tag className="w-4 h-4 mr-2" />
                        Apply
                      </Button>
                    )}
                  </div>
                  <div>
                    <button
                      type="button"
                      className="text-sm text-primary underline hover:text-primary/80"
                      onClick={() => setShowCoupons(!showCoupons)}
                    >
                      {showCoupons ? "Hide Coupons" : "More Coupons"}
                    </button>
                    {showCoupons && (
                      <div className="mt-2 space-y-2">
                        {isCouponLoading ? (
                          <p className="text-sm text-muted-foreground">Loading coupons...</p>
                        ) : coupons && coupons.length > 0 ? (
                          coupons.map((coupon: Coupon) => (
                            <div
                              key={coupon._id}
                              className="p-2 border rounded-md hover:bg-muted cursor-pointer"
                              onClick={() => handleCouponSelect(coupon)}
                            >
                              <p className="text-sm font-medium text-primary">
                                {coupon.name} - Save {formatINR(coupon.offerPrice)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Expires on: {new Date(coupon.expireOn).toLocaleDateString()}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No valid coupons available.</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {paymentMethod === "online" && selectedAddress ? (
                  <div className="w-full mt-6 bg-primary text-white hover:bg-primary/90">
                    <PaymentComponent
                      amount={total}
                      onSuccess={handlePaymentSuccess}
                      onFailure={handlePaymentFailure}
                      onDismiss={handlePaymentDismiss}
                    />
                  </div>
                ) : (
                  <Button
                    type="submit"
                    className="w-full mt-6 bg-primary text-white hover:bg-primary/90"
                    disabled={!selectedAddress}
                  >
                    Place Order
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1">
          <CheckoutOrder
            appliedCoupon={appliedCoupon}
            cartItems={cartItems}
            discount={discount}
            subtotal={subtotal}
            total={total} />
        </div>
      </div>

      <AddressModal
        isOpen={isAddressModalOpen}
        onOpenChange={setIsAddressModalOpen}
        onSuccess={handleAddressSuccess}
      />
    </div>
  );
}