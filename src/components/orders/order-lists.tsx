import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Package } from "lucide-react";
import { useOrderQuery } from '@/hooks/orders';
import { Input } from "@/components/ui/input";
import { useDebounce } from 'use-debounce';
import { OrderCard } from './order-card';
import { Pagination } from '../pagination';



const OrderSkeletonCard: React.FC = () => (
  <Card className="w-full">
    <CardHeader>
      <Skeleton className="h-6 w-32" />
    </CardHeader>
    <CardContent className="space-y-2">
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </CardContent>
    <CardFooter>
      <Skeleton className="h-10 w-32" />
    </CardFooter>
  </Card>
);



export const OrdersList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 600);
  const limit = 5;

  const { data, isLoading, isFetching } = useOrderQuery({ page, limit, search: debouncedSearch });

  const orders = data?.data || [];
  const totalCount = data?.total || 0;
  const totalPages = Math.ceil(totalCount / limit);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setSearch(value);
      setPage(1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Your Orders</h1>
          <Input
            type="text"
            placeholder="Search by Order ID"
            value={search}
            onChange={handleSearchChange}
            className="w-64"
            pattern="\d*"
            inputMode="numeric"
          />
        </div>

        <div className="grid gap-4">
          {isLoading || isFetching ? (
            Array.from({ length: limit }).map((_, index) => (
              <OrderSkeletonCard key={index} />
            ))
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">No orders found.</p>
            </div>
          ) : (
            orders.map((order) => (
              <OrderCard
                key={order._id}
                _id={order._id}
                orderId={order.orderId}
                orderItems={order.orderItems}
                totalAmount={order.totalAmount}
                paymentStatus={order.paymentStatus}
              />
            ))
          )}
        </div>

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          isLoading={isLoading || isFetching}
        />
      </div>
    </div>
  );
};