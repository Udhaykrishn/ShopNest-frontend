import { Order } from "@/types/order";

export const getStatusBadge = (status: Order['status']): { label: string; className: string } => {
    switch (status) {
        case 'pending':
            return { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' };
        case 'processing':
            return { label: 'Processing', className: 'bg-blue-100 text-blue-800' };
        case 'shipped':
            return { label: 'Shipped', className: 'bg-indigo-100 text-indigo-800' };
        case 'delivered':
            return { label: 'Delivered', className: 'bg-green-100 text-green-800' };
        case 'cancelled':
            return { label: 'Cancelled', className: 'bg-red-100 text-red-800' };
        case 'returned':
            return { label: 'Returned', className: 'bg-gray-100 text-gray-800' };
        default:
            return { label: status, className: 'bg-gray-100 text-gray-800' };
    }
};