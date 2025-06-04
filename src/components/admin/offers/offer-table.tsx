import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export type Offer = {
    _id: string;
    name: string;
    discount: number;
    start_date: string | Date;
    end_date: string | Date;
    isBlocked: boolean;
    type: string;
    category: string;
    status: string;
};

interface OfferTableProps {
    offers: Offer[];
    onEdit: (offer: Offer) => void;
    onBlock: (id: string, isBlocked: boolean) => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    totalPages: number;
}

export const OfferTable: React.FC<OfferTableProps> = ({
    offers,
    onEdit,
    onBlock,
    currentPage,
    setCurrentPage,
    totalPages
}) => {
    console.log("offers is: ", offers);

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
            </div>
            {offers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10">
                    <AlertCircle className="h-16 w-16 text-gray-400 mb-4" />
                    <h2 className="text-xl font-semibold text-gray-600">No Offers Found</h2>
                    <p className="text-gray-500">Create a new offer to get started.</p>
                </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Discount</TableHead>
                            <TableHead>Start Date</TableHead>
                            <TableHead>End Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {offers.map((offer) => (
                            <TableRow key={offer._id}>
                                <TableCell className='capitalize'><strong>{offer.name}</strong></TableCell>
                                <TableCell className="text-primary">{offer.category}</TableCell>
                                <TableCell>₹{offer.discount}</TableCell>
                                <TableCell>
                                    {format(new Date(offer.start_date), 'PPP')}
                                </TableCell>
                                <TableCell>
                                    {format(new Date(offer.end_date), 'PPP')}
                                </TableCell>
                                <TableCell>
                                    {offer.isBlocked ? (
                                        <span className="text-red-500">Blocked</span>
                                    ) : (
                                        <span className="text-green-500">{offer.status}</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onEdit(offer)}
                                        className="mr-2"
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant={offer.isBlocked ? 'default' : 'destructive'}
                                        size="sm"
                                        onClick={() => onBlock(offer._id, offer.isBlocked)}
                                    >
                                        {offer.isBlocked ? 'Unblock' : 'Block'}
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
};