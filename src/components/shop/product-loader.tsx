import { Skeleton } from "../ui/skeleton";

export const ProductSkeleton: React.FC = () => (
    <div className="space-y-3">
        <Skeleton className="h-48 w-full rounded-lg" />
        <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/4" />
        </div>
        <div className="flex justify-between items-center pt-4">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-8 rounded-full" />
        </div>
    </div>
);