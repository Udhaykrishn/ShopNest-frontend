import { memo, useState, useReducer, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Virtuoso } from 'react-virtuoso';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTableWrapper } from '@/components/table/table-wrapper';
import { OrderCard } from './vendor-order-card';
import { Link, useNavigate } from '@tanstack/react-router';
import { Input } from '../ui/input';
import { useDebounce } from 'use-debounce';

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
  shippedDate: string | null;
  deliveredDate: string | null;
  shippingAddress:any;
  orderedDate: string;
  orderItems: OrderItem[];
  orderId: number;
}

interface VendorOrderListProps {
  initialOrders: Order[];
  fetchOrders: (page: number, limit: number, search: string) => Promise<{ data: Order[]; total: number }>;
  page: number;
  setPage: (page: number) => void;
  limit: number;
  setLimit: (limit: number) => void;
  total: number;
}

interface PendingChangesState {
  changes: Record<string, OrderStatus>;
  isDirty: boolean;
}

type PendingChangesAction =
  | { type: 'QUEUE_CHANGE'; orderId: string; status: OrderStatus }
  | { type: 'CLEAR_CHANGES' };

const pendingChangesReducer = (state: PendingChangesState, action: PendingChangesAction): PendingChangesState => {
  switch (action.type) {
    case 'QUEUE_CHANGE':
      return {
        changes: { ...state.changes, [action.orderId]: action.status },
        isDirty: true,
      };
    case 'CLEAR_CHANGES':
      return { changes: {}, isDirty: false };
    default:
      return state;
  }
};

const validTransitions: Record<OrderStatus, OrderStatus[]> = {
  processing: ['shipped'],
  shipped: ['delivered'],
  delivered: [],
};


export const VendorOrderList = memo(
  ({ initialOrders, page, setPage, limit, setLimit, total }: VendorOrderListProps) => {
    const [{ changes: pendingChanges, isDirty }, dispatch] = useReducer(pendingChangesReducer, {
      changes: {},
      isDirty: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate()
    const [search, setSearch] = useState("");
    const searchItem = useDebounce(search, 500)[0]

    useEffect(() => {
      console.log(searchItem)
      navigate({
        to: "/vendor/orders",
        search: { page: 1, limit, search: searchItem }
      })
    }, [searchItem, limit, navigate])


    const handleSaveChanges = useCallback(async () => {
      setIsLoading(true);
      try {
        dispatch({ type: 'CLEAR_CHANGES' });
      } catch (err) {
        setError('Failed to save changes. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }, []);

    const handleStatusChange = useCallback(
      (orderItemId: string, status: OrderStatus) => {

        const order = initialOrders.find((o) => o.orderItems.some((item) => item._id === orderItemId));
        const item = order?.orderItems.find((item) => item._id === orderItemId);
        if (!order || !item) return;

        console.log("order is: ", order)


        const currentStatus = item.itemStatus;

        if (!validTransitions[currentStatus].includes(status)) {
          setError(`Invalid status transition from ${currentStatus} to ${status}.`);
          return;
        }
      },
      [initialOrders]
    );


    const statusStyles: Record<OrderStatus, { bg: string; text: string }> = {
      processing: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      shipped: { bg: 'bg-blue-100', text: 'text-blue-800' },
      delivered: { bg: 'bg-green-100', text: 'text-green-800' },
    };

    const totalPages = Math.ceil(total / limit);

    const handleLimitChange = useCallback(
      (newLimit: number) => {
        setLimit(newLimit);
        setPage(1);
      },
      [setLimit, setPage]
    );

    const renderOrderCard = useCallback(
      (index: number) => {
        const order = initialOrders[index];
        return (
          <OrderCard
            order={order}
            pendingChanges={pendingChanges}
            handleStatusChange={handleStatusChange}
            statusStyles={statusStyles}
          />
        )
      },
      [initialOrders, pendingChanges, handleStatusChange, statusStyles]
    );

    return (
      <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-primary mb-6">Vendor Orders</h1>
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg" role="alert">
            {error}
          </div>
        )}
        <Input
          placeholder="Search orders..."
          className="w-full sm:w-64 border-gray-300 focus:ring-primary"
          onChange={(e) => setSearch(e.target.value)}
        />
        <DataTableWrapper
          items={initialOrders}
        >

          {() => (
            <>
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: limit }).map((_, i) => (
                    <Skeleton key={i} className="h-40 w-full rounded-xl" />
                  ))}
                </div>
              ) : initialOrders.length === 0 ? (
                <p className="text-muted-foreground text-lg text-center" role="status">
                  No orders found.
                </p>
              ) : (
                <Virtuoso
                  style={{ height: '60vh' }}
                  totalCount={initialOrders.length}
                  itemContent={renderOrderCard}
                  overscan={200}
                  className="space-y-6"
                />
              )}
              {total > 0 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Items per page:</span>
                    <Select
                      value={limit.toString()}
                      onValueChange={(value) => {
                        handleLimitChange(Number(value))
                        navigate({ to: "/vendor/orders", search: { page, limit: Number(value), search: String(search) } })
                      }}
                    >
                      <SelectTrigger className="w-20" aria-label="Items per page">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                      aria-label="Previous page"
                    >
                      <Link
                        to="/vendor/orders"
                        search={{
                          page: page - 1,
                          limit: limit,
                          search: ""
                        }}
                      >
                        Previous
                      </Link>
                    </Button>
                    <span className="text-sm text-muted-foreground" aria-live="polite">
                      Page {page} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === totalPages}
                      onClick={() => setPage(page + 1)}
                      aria-label="Next page"
                    >
                      <Link
                        to="/vendor/orders"
                        search={{
                          page: page + 1,
                          limit: limit,
                          search: ""
                        }}
                      >
                        Next
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
              {isDirty && (
                <div className="fixed bottom-4 right-4">
                  <Button
                    onClick={handleSaveChanges}
                    className="bg-primary text-white hover:bg-primary-dark"
                    disabled={isLoading}
                    aria-label="Save pending changes"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              )}
            </>
          )}
        </DataTableWrapper>
      </div>
    );
  }
);