import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import { Loader2 } from 'lucide-react'
import { Vendor } from './approval-mangement';

interface ApprovalDialogProps {
    approveVendor: Record<string, any>;
    handleApprove: () => void;
    setActiveDialog: (value: null) => void;
    activeDialog: string | null;
    selectedVendor: Vendor | null
}

export const ApprovalDialog = ({ approveVendor, handleApprove, setActiveDialog, activeDialog, selectedVendor }: ApprovalDialogProps) => {
    return (
        <Dialog open={activeDialog === 'approve'} onOpenChange={(open) => !open && setActiveDialog(null)}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Approve Vendor</DialogTitle>
                    <DialogDescription>
                        You are about to approve vendor <span className="font-medium">{selectedVendor?.username}</span>.
                        This will grant them access to the platform.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-between mt-6">
                    <Button
                        variant="outline"
                        onClick={() => setActiveDialog(null)}
                        disabled={approveVendor.isPending}
                    >
                        No
                    </Button>
                    <Button
                        variant="default"
                        onClick={handleApprove}
                        disabled={approveVendor.isPending}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        {approveVendor.isPending ? (
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

