import { Skeleton } from "../ui/skeleton";

export const PaginationSkeleton = () => (
    <div className="flex justify-center py-4 border-t">
        <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-24" />
        </div>
    </div>
);