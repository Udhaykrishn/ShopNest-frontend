import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
interface ConfirmationDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    actionText: string;
    onConfirm: () => Promise<void>
    isPending: boolean;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
    isOpen,
    onOpenChange,
    title,
    description,
    actionText,
    onConfirm,
    isPending,
}) => (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>{title}</AlertDialogTitle>
                <AlertDialogDescription>{description}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel disabled={isPending}>No</AlertDialogCancel>
                <Button
                    onClick={onConfirm}
                    disabled={isPending}
                    className={`${actionText === "Approve"
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-red-500 hover:bg-red-600"
                        } text-white font-semibold py-2 px-4 rounded-md transition-colors`}
                >
                    {isPending ? "Processing..." : actionText}
                </Button>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
);