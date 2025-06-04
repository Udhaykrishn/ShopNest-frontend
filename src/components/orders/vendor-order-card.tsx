import { memo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatINR } from '@/utils';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useOrderMutation } from '@/hooks/orders';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type OrderStatus = 'processing' | 'shipped' | 'delivered';

interface OrderItem {
  productId: string;
  vendorId: string;
  quantity: number;
  price: number;
  variant: string | null;
  image: string;
  productName: string;
  sku: string;
  itemStatus: OrderStatus;
  _id: string;
  cancelReason: string;
  returnStatus: string;
  returnReason: string;
  returnComment: string;
  returnRequestedAt: Date;
  returnApprovedAt: Date;
  returnRejectedAt: Date;
}

interface Order {
  shippingAddress: any;
  shippedDate: string | null;
  deliveredDate: string | null;
  orderedDate: string;
  orderItems: OrderItem[];
  orderId: number;
}

interface OrderCardProps {
  order: Order;
  pendingChanges: Record<string, OrderStatus>;
  handleStatusChange: (orderItemId: string, value: OrderStatus) => void;
  statusStyles: Record<OrderStatus, { bg: string; text: string }>;
}

const validTransitions: Record<OrderStatus, OrderStatus[]> = {
  processing: ['shipped'],
  shipped: ['delivered'],
  delivered: [],
};

const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

const isValidStatus = (status: string): status is OrderStatus =>
  ['processing', 'shipped', 'delivered'].includes(status);

export const OrderCard = memo(({ order, pendingChanges, handleStatusChange, statusStyles }: OrderCardProps) => {
  const [isConfirming, setIsConfirming] = useState<string | null>(null);
  const [pendingStatus, setPendingStatus] = useState<OrderStatus | null>(null);
  const [selectedSku, setSelectedSku] = useState<string | null>(null);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<OrderItem | null>(null);
  const [returnComment, setReturnComment] = useState('');
  const { statusChangeOrder, orderReturnApproveMutation, orederReturnRejectMutation } = useOrderMutation();

  console.log("address is: ", order.shippingAddress)

  const handleConfirmStatusChange = async (orderItemId: string, sku: string, newStatus: OrderStatus) => {
    try {
      await statusChangeOrder.mutateAsync({ sku, orderId: order.orderId, status: newStatus });

      handleStatusChange(orderItemId, newStatus);
      toast({
        title: 'Status Updated',
        description: `Order item status changed to ${newStatus}.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsConfirming(null);
      setPendingStatus(null);
      setSelectedSku(null);
    }
  };

  const approveHandle = async () => {
    if (!selectedItem || !selectedSku) return;

    try {
      await orderReturnApproveMutation.mutateAsync({
        orderId: order.orderId,
        sku: selectedSku,
        reason: returnComment.trim() || undefined,
      });

      toast({
        title: 'Return Approved',
        description: `The return request for ${selectedItem.productName} has been approved.`,
      });

    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve return request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsReturnModalOpen(false);
      setSelectedItem(null);
      setSelectedSku(null);
      setReturnComment('');
    }
  };

  const rejectHandle = async () => {
    if (!selectedItem || !selectedSku) return;

    if (!returnComment.trim()) {
      toast({
        title: 'Error',
        description: 'A comment is required when rejecting a return request.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await orederReturnRejectMutation.mutateAsync({
        orderId: order.orderId,
        sku: selectedSku,
        reason: returnComment.trim(),
      });

      toast({
        title: 'Return Rejected',
        description: `The return request for ${selectedItem.productName} has been rejected.`,
      });

    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject return request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsReturnModalOpen(false);
      setSelectedItem(null);
      setSelectedSku(null);
      setReturnComment('');
    }
  };

  const onStatusChange = (orderItemId: string, value: OrderStatus, sku: string) => {
    setIsConfirming(orderItemId);
    setPendingStatus(value);
    setSelectedSku(sku);
  };

  const confirmChange = () => {
    if (pendingStatus && isConfirming && selectedSku) {
      handleConfirmStatusChange(isConfirming, selectedSku, pendingStatus);
    }
  };

  const cancelChange = () => {
    setIsConfirming(null);
    setPendingStatus(null);
    setSelectedSku(null);
  };

  const openReturnModal = (item: OrderItem) => {
    setSelectedItem(item);
    setSelectedSku(item.sku);
    setIsReturnModalOpen(true);
  };

  return (
    <>
      <Card
        className="shadow-md hover:opacity-95 rounded-xl bg-white transition-opacity duration-200"
        role="region"
        aria-labelledby={`order-${order.orderId}`}
      >
        <CardHeader className="p-6">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl text-primary" id={`order-${order.orderId}`}>
              Order ID: {order.orderId}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              <strong>Ordered: {formatDate(order.orderedDate)}</strong>
            </p>
          </div>
        </CardHeader>
        <Separator className="bg-gray-200" />
        <CardContent className="p-6">
          {order.orderItems.map((item, index) => {
            const currentPendingStatus = pendingChanges[item._id];
            const displayStatus = currentPendingStatus || (item.returnStatus === 'approved' ? 'returned' : item.itemStatus);
            const badgeStyles = isValidStatus(displayStatus)
              ? statusStyles[displayStatus]
              : statusStyles['processing'];
            const allowedStatuses = validTransitions[item.itemStatus] || [];

            return (
              <div key={item._id} className={`flex flex-col gap-4 ${index > 0 ? 'mt-6' : ''}`}>
                <div className="flex items-start gap-6">
                  <div className="w-32 h-32 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.productName || 'Product'}
                      className="w-full h-full object-cover rounded-lg border border-gray-200"
                      width={128}
                      height={128}
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl text-primary">
                      {item.productName || `Product ${item.productId}`}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Product ID: {item.productId}</p>
                    <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Quantity</p>
                    <p className="text-lg font-semibold text-gray-900">{item.quantity}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Price</p>
                    <p className="text-lg font-semibold text-gray-900">{formatINR(item.price)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <Badge className={`mt-1 ${badgeStyles.bg} ${badgeStyles.text} font-medium`}>
                      {displayStatus}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Change Status</p>
                    {allowedStatuses.length > 0 ? (
                      <Select
                        value={currentPendingStatus || item.itemStatus}
                        onValueChange={(value: OrderStatus) => onStatusChange(item._id, value, item.sku)}
                      >
                        <SelectTrigger
                          className="w-48 border-gray-300 focus:ring-primary mt-1"
                          aria-label="Change order status"
                        >
                          <SelectValue>
                            {(currentPendingStatus || item.itemStatus).charAt(0).toUpperCase() +
                              (currentPendingStatus || item.itemStatus).slice(1)}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {allowedStatuses.map((status) => (
                            <SelectItem key={status} value={status} className="cursor-pointer">
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-sm text-muted-foreground mt-1">No further status changes allowed</p>
                    )}
                  </div>
                </div>
                {item.returnStatus === 'pending' && (
                  <div className="mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openReturnModal(item)}
                      className="text-blue-600 border-blue-500 hover:bg-blue-50"
                    >
                      View Return Details
                    </Button>
                  </div>
                )}
                {index < order.orderItems.length - 1 && <Separator className="bg-gray-200 mt-4" />}
              </div>
            );
          })}
          <div className="mt-6 flex items-center gap-4 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              type="button"
              className="text-primary border-primary hover:bg-primary hover:text-white transition-colors"
              aria-label={`View address location for order ${order.orderId}`}
              onClick={() => {
                const { city,district, state, pincode, country } = order.shippingAddress;
                const address = `${city} ${district}, ${state}, ${pincode}, ${country}`;
                const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
                window.open(mapUrl, "_blank");
              }}
            >
              View Address Location
            </Button>

          </div>
        </CardContent>
      </Card>

      <Dialog open={!!isConfirming} onOpenChange={(open) => !open && cancelChange()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Status Change</DialogTitle>
            <DialogDescription>
              Are you sure you want to change the status to{' '}
              <span className="font-semibold">
                {pendingStatus?.charAt(0).toUpperCase() + (pendingStatus?.slice(1) || '')}
              </span>{' '}
              for the order item with SKU <span className="font-semibold">{selectedSku}</span>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelChange} disabled={statusChangeOrder.isPending}>
              Cancel
            </Button>
            <Button onClick={confirmChange} disabled={statusChangeOrder.isPending}>
              {statusChangeOrder.isPending ? 'Updating...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isReturnModalOpen} onOpenChange={(open) => !open && setIsReturnModalOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Return Request Details</DialogTitle>
            <DialogDescription>
              Review the return request for{' '}
              <span className="font-semibold">{selectedItem?.productName}</span> (SKU:{' '}
              <span className="font-semibold">{selectedItem?.sku}</span>).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Return Reason</Label>
              <p className="mt-1 text-sm text-gray-600">{selectedItem?.returnReason || 'N/A'}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Requested On</Label>
              <p className="mt-1 text-sm text-gray-600">
                {selectedItem?.returnRequestedAt ? formatDate(selectedItem.returnRequestedAt) : 'N/A'}
              </p>
            </div>
            <div>
              <Label htmlFor="returnComment" className="text-sm font-medium">
                Return Comment {`(Required for rejection)`}
              </Label>
              <Input
                id="returnComment"
                value={returnComment}
                onChange={(e) => setReturnComment(e.target.value)}
                placeholder="Enter a comment (required if rejecting)"
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setIsReturnModalOpen(false);
                setSelectedItem(null);
                setSelectedSku(null);
                setReturnComment('');
              }}
              disabled={orderReturnApproveMutation.isPending || orederReturnRejectMutation.isPending}
            >
              Close
            </Button>
            <Button
              variant="default"
              onClick={approveHandle}
              disabled={orderReturnApproveMutation.isPending || orederReturnRejectMutation.isPending}
              className="bg-green-500 hover:bg-green-600"
            >
              {orderReturnApproveMutation.isPending ? 'Processing...' : 'Approve Return'}
            </Button>
            <Button
              variant="destructive"
              onClick={rejectHandle}
              disabled={orederReturnRejectMutation.isPending || !returnComment.trim()}
            >
              {orederReturnRejectMutation.isPending ? 'Processing...' : 'Reject Return'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
});