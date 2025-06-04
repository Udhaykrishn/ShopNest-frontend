import { usePayment } from "@/hooks/payment";
import { env } from "@/lib/env.lib";
import { RazorpayOrderOptions, useRazorpay } from "react-razorpay";
import { Button } from "@/components/ui/button";
import { useCallback } from "react";
import { useToast } from "@/hooks";


interface PaymentComponentProps {
  amount: number;
  onSuccess?: (response: any) => void;
  onFailure?: (error: any) => void;
  onDismiss?: () => void;
}

export function PaymentComponent({
  amount,
  onSuccess,
  onFailure,
  onDismiss,
}: PaymentComponentProps) {
  const RazorpayKEY = env.VITE_RAZORPAY_KEY;
  const { Razorpay } = useRazorpay();
  const { createOrder } = usePayment();
  const { toast } = useToast()

  const handlePayment = useCallback(async () => {
    if (!Razorpay) {
      onFailure?.({ error: "Razorpay SDK not loaded" });
      return;
    }

    try {
      const amountInPaise = Math.round(amount * 100).toString();
      const data = await createOrder.mutateAsync((Number(amountInPaise) / 100).toString());

      const options: RazorpayOrderOptions = {
        key: RazorpayKEY,
        amount: Number(amountInPaise),
        currency: "INR",
        name: "",
        description: `₹${amount}`,
        order_id: data.data.orderId,
        handler: (response) => {
          toast({
            title:"Razropay Payment",
            description:`Transaction successfully compelete`,
            variant:"default"
          })
          localStorage.removeItem("pending_payment");
          onSuccess?.(response);
        },
        theme: {
          color: "#F37254",
           backdrop_color: "#fff" 
        },
        modal: {
          ondismiss: () => {
            localStorage.removeItem("pending_payment");
            onDismiss?.();
          },
          confirm_close:true,
          escape:true,
          backdropclose:false,
          animation:true,
        },  
        retry:{
          enabled:false
        }
      };

      localStorage.setItem("pending_payment", JSON.stringify(options));

      const razorpayInstance = new Razorpay(options);
      razorpayInstance.open();
    

      razorpayInstance.on("payment.failed", (error) => {
        localStorage.removeItem("pending_payment"); 
        onFailure?.(error);
      });
    } catch (error) {
      onFailure?.(error);
    }
  }, [Razorpay, amount, createOrder, onSuccess, onFailure, onDismiss,toast, RazorpayKEY]);

  return (
    <Button
      onClick={handlePayment}
      disabled={!Razorpay}
      className="bg-primary hover:bg-primary/90 text-white rounded-lg w-full"
    >
      Pay ₹{amount}
    </Button>
  );
}