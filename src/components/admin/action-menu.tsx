import React from 'react';
import { Button } from "@/components/ui/button";
import {
    PencilIcon,
    LockIcon,
    UnlockIcon,
    Loader2
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ActionMenuProps {
    onEdit: () => void;
    onToggleStatus: () => void;
    status: "active" | "blocked";
    isLoading: boolean;
}



export const ActionMenu: React.FC<ActionMenuProps> = ({
    onEdit,
    onToggleStatus,
    status,
    isLoading
}) => {

    return (
        <div className="flex items-center gap-2 justify-end">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            onClick={onEdit}
                            variant="outline"
                            size="sm"
                            className="h-8 text-primary w-8 p-0 border-primary bg-transparent hover:bg-transparent hover:text-primary"
                        >
                            <PencilIcon className="h-4 w-4 text-primary" />
                            <span className="sr-only">Edit Category</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Edit Category</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            onClick={onToggleStatus}
                            disabled={isLoading}
                            variant="outline"
                            size="sm"
                            className={cn(
                                "h-8 w-8 p-0",
                                status === "active"
                                    ? "border-primary bg-transparent hover:bg-transparent hover:text-primary"
                                    : "border-primary bg-transparent hover:bg-transparent hover:text-primary"
                            )}
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : status === "active" ? (
                                <LockIcon className="h-4 w-4 text-red-500" />
                            ) : (
                                <UnlockIcon className="h-4 w-4 text-green-500" />
                            )}
                            <span className="sr-only">
                                {status === "active" ? "Block Category" : "Unblock Category"}
                            </span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{status === "active" ? "Block Category" : "Unblock Category"}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
};