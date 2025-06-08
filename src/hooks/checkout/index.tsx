import { useRef } from 'react';
import { useToast } from '../use-toast';
import { router } from '@/router';
import { useOrderMutation } from '../orders';

export const usePaymentHooks = (payload: any) => {
  const failedRef = useRef(false)
  const { postOrder } = useOrderMutation()
  const { toast } = useToast()

  const handlePaymentFailure = async () => {
    failedRef.current = true

    await postOrder.mutateAsync(payload, {
      onSuccess: () => {
        router.navigate({ to: "/order-faliure", replace: true })
      },
    })
  };

  const handlePaymentDismiss = () => {
    if (failedRef.current) {
      return;
    }
    toast({
      title: "Payment Cancelled",
      description: "The payment process was cancelled.",
      variant: "default",
    });
  };


  return { handlePaymentFailure, handlePaymentDismiss }
}
