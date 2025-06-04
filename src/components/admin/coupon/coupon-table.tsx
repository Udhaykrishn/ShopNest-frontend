import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Coupon } from '@/types';

interface CouponTableProps {
    coupons: Coupon[];
    onEdit: (coupon: Coupon) => void;
    onBlock: (id: string, isBlocked: boolean) => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    totalPages: number;
}

export const CouponTable: React.FC<CouponTableProps> = ({
    coupons,
    onEdit,
    onBlock,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages
}) => {

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <Input
                    placeholder="Search coupons..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
            </div>
            {coupons.length === 0 ? (
                <p className="text-center text-muted-foreground">No coupons found.</p>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Min Price</TableHead>
                            <TableHead>Offer Price</TableHead>
                            <TableHead>Expiry Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {coupons.map((coupon) => (
                            <TableRow key={coupon.name}>
                                <TableCell className="text-primary">{coupon.name}</TableCell>
                                <TableCell>₹{coupon.min_price}</TableCell>
                                <TableCell>₹{coupon.offerPrice}</TableCell>
                                <TableCell>{coupon.expireOn}</TableCell>
                                <TableCell>
                                    {coupon.isBlocked ? (
                                        <span className="text-red-500">Blocked </span>
                                    ) : (
                                        <span className="text-green-500">Active</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onEdit(coupon)}
                                        className="mr-2"
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant={coupon.isBlocked ? 'default' : 'destructive'}
                                        size="sm"
                                        onClick={() => onBlock(coupon._id, coupon.isBlocked)}
                                    >
                                        {coupon.isBlocked ? 'Unblock' : 'Block'}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
            <div className="flex justify-between items-center mt-4">
                <Button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                >
                    Previous
                </Button>
                <span>
                    Page {currentPage} of {totalPages || 1}
                </span>
                <Button
                    disabled={currentPage >= totalPages || totalPages === 0}
                    onClick={() => setCurrentPage(currentPage + 1)}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}