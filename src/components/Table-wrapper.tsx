/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import debounce from "lodash/debounce";

export type Column<T> = {
    key: keyof T;
    label: string;
    render?: (value: any, row: T) => JSX.Element | string | number;
};

type TableWrapperProps<T> = {
    columns: Column<T>[];
    fetchUrl: string;
    filters?: { label: string; value: string }[];
    pageSizeOptions?: number[];
};

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: {
        data: T[];
        total: number;
    };
}

export default function TableWrapper<T>({
    columns,
    fetchUrl,
    filters = [],
    pageSizeOptions = [5, 10, 20]
}: TableWrapperProps<T>) {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(pageSizeOptions[0]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const debouncedSearch = useCallback(
        debounce((searchValue: string) => {
            setSearch(searchValue);
            setPage(1);
        }, 500),
        [setSearch, setPage]
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        debouncedSearch(e.target.value);
    };

    const { data: apiResponse, isLoading } = useQuery<ApiResponse<T>>({
        queryKey: ["tableData", page, pageSize, search, filter],
        queryFn: async () => {
            const response = await axios.get<ApiResponse<T>>(fetchUrl, {
                params: {
                    page,
                    limit: pageSize,
                    search,
                    status: filter === "all" ? undefined : filter
                }
            });
            return response.data;
        },
    });

    const items = apiResponse?.data?.data;
    const total = apiResponse?.data?.total || 0;
    const totalPages = Math.ceil(total / pageSize)

    const isNextDisabled = () => {
        if (!items) return true;
        return page >= totalPages
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <Input
                    placeholder="Search items..."
                    onChange={handleSearchChange}
                />
                {filters.length > 0 && (
                    <Select value={filter} onValueChange={setFilter}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Filter" />
                        </SelectTrigger>
                        <SelectContent>
                            {filters.map((f) => (
                                <SelectItem key={f.value} value={f.value}>
                                    {f.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map((col) => (
                            <TableHead key={String(col.key)}>
                                {col.label}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading && !items ? (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="text-center">
                                Loading...
                            </TableCell>
                        </TableRow>
                    ) : items?.length ? (
                        items.map((row, index) => (
                            <TableRow key={(row as any)._id || index}>
                                {columns.map((col) => (
                                    <TableCell key={String(col.key)}>
                                        {col.render
                                            ? col.render(row[col.key], row)
                                            : String(row[col.key])}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="text-center">
                                No items available
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span>Page {page} of {totalPages}</span>
                    <Button
                        variant="outline"
                        disabled={isNextDisabled()}
                        onClick={() => setPage(page + 1)}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
                <Select value={String(pageSize)} onValueChange={(value) => setPageSize(Number(value))}>
                    <SelectTrigger className="w-24">
                        <SelectValue placeholder="Page Size" />
                    </SelectTrigger>
                    <SelectContent>
                        {pageSizeOptions.map((size) => (
                            <SelectItem key={size} value={String(size)}>
                                {size} per page
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}