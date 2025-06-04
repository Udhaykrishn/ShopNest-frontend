import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Vendor } from "./approval-mangement";
import { Loader2 } from "lucide-react";

type RejectDialogProps = {
    activeDialog: string | null;
    setActiveDialog: (value: null) => void;
    selectedVendor: Vendor | null;
    rejectVendor: Record<string, any>
    handleReject: () => void
}

export const RejectDialog = ({ activeDialog, selectedVendor, setActiveDialog, rejectVendor, handleReject }: RejectDialogProps) => {
    return (
        <Dialog open={activeDialog === 'reject'} onOpenChange={(open) => !open && setActiveDialog(null)}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Reject Vendor</DialogTitle>
                    <DialogDescription>
                        You are about to reject vendor <span className="font-medium">{selectedVendor?.username}</span>.
                        This will restrict their access to the platform.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-between mt-6">
                    <Button
                        variant="outline"
                        onClick={() => setActiveDialog(null)}
                        disabled={rejectVendor.isPending}
                    >
                        No
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleReject}
                        disabled={rejectVendor.isPending}
                    >
                        {rejectVendor.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing
                            </>
                        ) : (
                            "Yes"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

