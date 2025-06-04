import { useNavigate } from '@tanstack/react-router';
import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { formatINR } from '@/utils';
import { Button } from '../ui/button';

interface OrderItem {
  _id: string;
  image: string;
  productName: string;
  quantity: number;
  itemStatus: string;
}

interface Order {
  _id: string;
  orderId: string;
  orderItems: OrderItem[];
  totalAmount: number;
  paymentStatus: string;
}

export const OrderCard: React.FC<Order> = ({ orderId, orderItems, totalAmount, paymentStatus }) => {
  const navigate = useNavigate();


  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-primary">
          Order #{orderId}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {orderItems.map((item) => (
          <div key={item._id} className="flex items-center gap-4">
            <img
              src={item.image}
              alt={item.productName}
              className="w-16 h-16 object-cover rounded-md"
            />
            {
              paymentStatus === "failed" ? (
                <p className="text-sm bold text-red-600">Payment failed </p>
              ) : (
                <>
                  <div className="p-2 rounded-md">
                    <p className="text-sm font-medium text-gray-600">{item.productName}</p>
                    <p className="text-sm text-gray-600">qty: {item.quantity}</p>
                    <p
                      className={`text-sm text-gray-600 px-2 py-1 rounded ${item.itemStatus === 'processing'
                        ? 'bg-yellow-100'
                        : item.itemStatus === 'cancelled' || item.itemStatus === 'returned'
                          ? 'bg-red-100'
                          : item.itemStatus === 'shipped' || item.itemStatus === 'delivered'
                            ? 'bg-green-100'
                            : ''
                        }`}
                    >
                      status: {item.itemStatus}
                    </p>
                  </div>
                </>
              )
            }


          </div >
        ))}
      </CardContent >
      <CardFooter className="flex justify-between items-center">
        <p className="text-sm font-semibold text-gray-600">Total: {formatINR(totalAmount)}</p>
        <Button
          variant="outline"
          className="text-primary border-primary hover:bg-primary/10"
          onClick={() => navigate({ to: "/profile/orders/$id", params: { id: orderId } })}
        >
          View Details
        </Button>
      </CardFooter>
    </Card >
  );
};
