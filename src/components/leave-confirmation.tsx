import React from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface LeaveConfirmationProps {
    status: string;
    onProceed: () => void;
    onReset: () => void;
}

const LeaveConfirmation: React.FC<LeaveConfirmationProps> = ({
    status,
    onProceed,
    onReset
}) => {
    return (
        <AlertDialog open={status === "blocked"} defaultOpen={status === "blocked"}>
            <AlertDialogContent className="bg-background border-border">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-primary text-xl font-semibold">
                        Confirm Navigation
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-primary/80">
                        Are you sure you want to leave? Any unsaved changes will be lost.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2">
                    <AlertDialogCancel
                        onClick={onReset}
                        className="bg-secondary hover:bg-secondary/90"
                    >
                        No, stay here
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onProceed}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        Yes, leave page
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default LeaveConfirmation;
export { LeaveConfirmation }