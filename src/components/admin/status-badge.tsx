import React from 'react';
import { ShieldCheck, ShieldX } from 'lucide-react';
import { Status } from '@/types/category';
interface StatusBadgeProps {
    status: Status;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => (
    <div className={`flex items-center gap-1 ${status === "active" ? "text-green-600" : "text-red-600"}`}>
        {status === "active" ? <ShieldCheck className="h-4 w-4" /> : <ShieldX className="h-4 w-4" />}
        {status === "active" ? "Active" : "Blocked"}
    </div>
);

