import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
    rows?: number;
    columns?: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({ rows = 5, columns = 5 }) => (
    <div className="w-full space-y-4">
        <div className="flex space-x-4">
            {Array(columns).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
            ))}
        </div>
        {Array(rows).fill(0).map((_, i) => (
            <div key={i} className="flex space-x-4">
                {Array(columns).fill(0).map((_, j) => (
                    <Skeleton key={j} className="h-12 w-full" />
                ))}
            </div>
        ))}
    </div>
);

