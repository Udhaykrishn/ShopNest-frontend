import { useState } from 'react';
import { useVendors, useVendorMutations } from '@/hooks/useVendors';
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableCell,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDebounce } from 'use-debounce';
import {
    Search,
    Users,
    Filter,
} from 'lucide-react';
import { TableSkeleton } from '../table-loader';
import { PaginationSkeleton } from '../pagination-loader';
import { VendorList } from './vendor-list';
import { Vendor } from '@/types/vendor';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const VendorManagement: React.FC = () => {
    const [search, setSearch] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(5);
    const [debouncedSearch] = useDebounce(search, 500);

    const isApproved = true;
    const { data, isLoading, error, refetch } = useVendors({ isApproved, search: debouncedSearch, page, limit });
    const { blockVendor, unblockVendor } = useVendorMutations({ isApproved: false, isRejected: false });

    const vendors = data?.data?.data || [];
    const total = data?.data?.total || 0;
    const totalPages = Math.ceil(total / limit);
    const currentPage = page;

    const handleDialog = async (vendor: Vendor, type: 'block' | 'unblock') => {
        if (type === 'block') {
            await blockVendor.mutateAsync(vendor._id, {
                onSettled: () => {
                    refetch()
                }
            });
        } else if (type === 'unblock') {
            await unblockVendor.mutateAsync(vendor._id, {
                onSettled: () => {
                    refetch()
                }
            });
        }
    };

    const handleLimitChange = (value: string) => {
        setLimit(Number(value));
        setPage(1);
    };

    if (error) {
        return (
            <Card>
                <CardContent className="p-6">
                    <p className="text-destructive">Error loading vendors: {error.message}</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full shadow-md">
            <CardHeader className="border-b">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Users className="h-6 w-6 text-primary" />
                        <CardTitle className="text-primary">Vendor Management</CardTitle>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search vendors..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                className="pl-8 w-full sm:w-[300px]"
                            />
                        </div>
                        <Select value={String(limit)} onValueChange={handleLimitChange}>
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="5 per page" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">5 per page</SelectItem>
                                <SelectItem value="10">10 per page</SelectItem>
                                <SelectItem value="20">20 per page</SelectItem>
                                <SelectItem value="50">50 per page</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="rounded-md overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead className="font-semibold text-center w-[50px]">#</TableHead>
                                <TableHead className="font-semibold text-center">Username</TableHead>
                                <TableHead className="font-semibold text-center">Phone</TableHead>
                                <TableHead className="font-semibold text-center">Email</TableHead>
                                <TableHead className="font-semibold text-center">Status</TableHead>
                                <TableHead className="font-semibold text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        {isLoading ? (
                            <TableSkeleton />
                        ) : !vendors.length ? (
                            <tbody>
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-16">
                                        <div className="flex flex-col items-center gap-2">
                                            <Filter className="h-8 w-8 text-muted-foreground" />
                                            <p className="text-muted-foreground">No vendors found</p>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setSearch('');
                                                    setPage(1);
                                                }}
                                                className="mt-2"
                                            >
                                                Clear filters
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </tbody>
                        ) : (
                            <VendorList
                                vendors={vendors}
                                openDialog={handleDialog}
                                page={page}
                                pageSize={limit}
                            />
                        )}
                    </Table>
                    {isLoading ? (
                        <PaginationSkeleton />
                    ) : total > 0 ? (
                        <div className="border-t px-4 py-4">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() => currentPage > 1 && setPage(currentPage - 1)}
                                            className={currentPage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                        />
                                    </PaginationItem>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                        <PaginationItem key={pageNum}>
                                            <PaginationLink
                                                isActive={currentPage === pageNum}
                                                onClick={() => setPage(pageNum)}
                                            >
                                                {pageNum}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}

                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() => currentPage < totalPages && setPage(currentPage + 1)}
                                            className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    ) : null}
                </div>
            </CardContent>
        </Card>
    );
};

export default VendorManagement;