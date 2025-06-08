export type OrderStatus = 'processing' | 'shipped' | 'delivered';


export interface OrderItem {
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

export interface Order {
  status:string,
  shippedDate: string | null;
  deliveredDate: string | null;
  orderedDate: string;
  orderItems: OrderItem[];
  orderId: number;
}
