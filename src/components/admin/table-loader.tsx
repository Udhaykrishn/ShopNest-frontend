import { Skeleton } from "../ui/skeleton";
import { TableCell, TableRow } from "../ui/table";

export const TableSkeleton = () => (
    <>
        {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
                <TableCell>
                    <div className="flex items-center gap-2">
                        <Skeleton
                         className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </TableCell>
                <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                <TableCell><Skeleton className="h-9 w-20" /></TableCell>
            </TableRow>
        ))}
    </>
);