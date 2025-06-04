import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Category } from '@/types';
import { TableSkeleton } from './category-loader';
import { useCategoryMutations } from '@/hooks';
import { StatusBadge } from '../status-badge';
import { ActionMenu } from '../action-menu';
import { FolderIcon } from 'lucide-react';

interface CategoriesTableProps {
    categories: Category[];
    onEdit: (category: Category) => void;
    isLoading: boolean;
}

export const CategoriesTable: React.FC<CategoriesTableProps> = ({
    categories = [],
    onEdit,
    isLoading,
}) => {
    const { unblockCategory, blockCategory } = useCategoryMutations();
    const [page, setPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(3);

    const handleStatusToggle = (category: Category) => {
        if (category.isBlocked) {
            unblockCategory.mutate(category._id);
        } else {
            console.log("block", category.isBlocked, category._id)
            blockCategory.mutate(category._id);
        }
    };

    const totalPages = Math.ceil(categories.length / pageSize);
    const startIndex = (page - 1) * pageSize;
    const paginatedCategories = categories.slice(startIndex, startIndex + pageSize);

    if (isLoading) return <TableSkeleton />;

    return (
        <div className="space-y-4">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50">
                        <TableHead className="w-12">#</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-center">Subcategories</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedCategories.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                No categories found
                            </TableCell>
                        </TableRow>
                    ) : (
                        paginatedCategories.map((category, index) => (
                            <TableRow key={category._id} className="hover:bg-muted/50">
                                <TableCell className="font-medium">{startIndex + index + 1}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <FolderIcon className="h-4 w-4 text-primary" />
                                        <span className="font-medium">{category.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell><StatusBadge status={category.isBlocked ? "blocked" : "active"} /></TableCell>
                                <TableCell className="text-center">
                                    {category.subCategory?.length || 0}
                                </TableCell>
                                <TableCell className="text-right">
                                    <ActionMenu
                                        onEdit={() => onEdit(category)}
                                        onToggleStatus={() => handleStatusToggle(category)}
                                        status={category.isBlocked ? "blocked" : "active"}
                                        isLoading={blockCategory.isPending || unblockCategory.isPending}
                                    />
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            <div className="flex items-center justify-between px-2">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <div>Rows per page:</div>
                    <Select
                        value={pageSize.toString()}
                        onValueChange={(value) => {
                            setPageSize(Number(value));
                            setPage(1);
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={pageSize} />
                        </SelectTrigger>
                        <SelectContent>
                            {[3, 5, 10, 20, 30, 40, 50].map((size) => (
                                <SelectItem key={size} value={size.toString()}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <div>
                        {startIndex + 1}-{Math.min(startIndex + pageSize, 10)} of {10}
                    </div>
                </div>

                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                aria-disabled={page === 1}
                            />
                        </PaginationItem>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                            <PaginationItem key={pageNumber}>
                                <PaginationLink
                                    onClick={() => setPage(pageNumber)}
                                    isActive={page === pageNumber}
                                >
                                    {pageNumber}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationNext
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                aria-disabled={page === totalPages}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
};