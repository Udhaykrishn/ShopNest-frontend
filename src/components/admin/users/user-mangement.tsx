import { useState } from 'react';
import { useUsers, useBlockUser, useUnBlockUser } from '@/hooks/useUsers';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDebounce } from 'use-debounce';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Search,
    UserCircle,
    Mail,
    Phone,
    Shield,
    ShieldOff,
    RefreshCcw,
    Users,
    Filter,
} from 'lucide-react';
import { TableSkeleton } from '../table-loader';
import { PaginationSkeleton } from '../pagination-loader';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User } from '@/types';

export const UserManagement: React.FC = () => {
    const [search, setSearch] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(5);
    const [debouncedSearch] = useDebounce(search, 500);
    const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const { data, isLoading, error } = useUsers({
        search: debouncedSearch,
        page,
        limit,
    });

    const blockMutation = useBlockUser();
    const unblockMutation = useUnBlockUser();

    const users = data?.data.data || [];
    const total = data?.data?.total || 0;
    const totalPages = Math.ceil(total / limit);
    const currentPage = page;

    const handleBlockClick = (user: User) => {
        setSelectedUser(user);
        setIsBlockModalOpen(true);
    };

    const handleConfirmBlock = () => {
        if (selectedUser) {
            blockMutation.mutate({ userId: selectedUser._id });
        }
        setIsBlockModalOpen(false);
        setSelectedUser(null);
    };

    const handleCancelBlock = () => {
        setIsBlockModalOpen(false);
        setSelectedUser(null);
    };

    const handleLimitChange = (value: string) => {
        setLimit(Number(value));
        setPage(1);
    };

    if (error) {
        return (
            <Card>
                <CardContent className="p-6">
                    <p className="text-destructive">Error loading users: {error.message}</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card className="w-full shadow-md">
                <CardHeader className="border-b">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Users className="h-6 w-6 text-primary" />
                            <CardTitle className="text-primary">User Management</CardTitle>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search users..."
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
                                    <TableHead className="font-semibold">Username</TableHead>
                                    <TableHead className="font-semibold">Email</TableHead>
                                    <TableHead className="font-semibold">Phone</TableHead>
                                    <TableHead className="font-semibold">Status</TableHead>
                                    <TableHead className="font-semibold">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableSkeleton />
                                ) : !users.length ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-16">
                                            <div className="flex flex-col items-center gap-2">
                                                <Filter className="h-8 w-8 text-muted-foreground" />
                                                <p className="text-muted-foreground">No users found</p>
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
                                ) : (
                                    users.map((user) => (
                                        <TableRow key={user._id} className="hover:bg-muted/30">
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="bg-primary/10 p-2 rounded-full">
                                                        <UserCircle className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <span className="font-medium">{user.username}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                                    {user.email}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                                    {user.phone || 'N/A'}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={user.isBlocked ? 'destructive' : 'secondary'}
                                                    className="flex w-fit items-center gap-1 px-2 py-1"
                                                >
                                                    {user.isBlocked ? (
                                                        <ShieldOff className="h-3 w-3" />
                                                    ) : (
                                                        <Shield className="h-3 w-3" />
                                                    )}
                                                    {user.isBlocked ? 'Blocked' : 'Active'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant={user.isBlocked ? 'outline' : 'destructive'}
                                                    size="sm"
                                                    onClick={() => {
                                                        if (user.isBlocked) {
                                                            unblockMutation.mutate({ userId: user._id });
                                                        } else {
                                                            handleBlockClick(user);
                                                        }
                                                    }}
                                                    disabled={blockMutation.isPending || unblockMutation.isPending}
                                                    className="flex items-center gap-1"
                                                >
                                                    {blockMutation.isPending || unblockMutation.isPending ? (
                                                        <RefreshCcw className="h-3 w-3 animate-spin" />
                                                    ) : user.isBlocked ? (
                                                        <Shield className="h-3 w-3" />
                                                    ) : (
                                                        <ShieldOff className="h-3 w-3" />
                                                    )}
                                                    {user.isBlocked ? 'Unblock' : 'Block'}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
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
            <Dialog open={isBlockModalOpen} onOpenChange={setIsBlockModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Block User</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-sm text-muted-foreground">
                            Are you sure you want to block the user "{selectedUser?.username}"? This action will
                            restrict their access.
                        </p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={handleCancelBlock}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmBlock}
                            className="flex items-center gap-1"
                        >
                            <ShieldOff className="h-4 w-4" />
                            Block
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};