import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { OrderCount } from '@/types';

interface OrderStatusProps {
  orderCount: OrderCount[];
}

export const OrderStatus: React.FC<OrderStatusProps> = ({ orderCount }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Status</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        {orderCount.map((stat, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg text-white ${
              stat._id === 'delivered'
                ? 'bg-emerald-500'
                : stat._id === 'cancelled'
                ? 'bg-red-500'
                : stat._id === 'processing'
                ? 'bg-blue-500'
                : 'bg-orange-500'
            }`}
          >
            <div className="text-sm">{stat._id.charAt(0).toUpperCase() + stat._id.slice(1)}</div>
            <div className="text-2xl font-bold">{stat.count}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};