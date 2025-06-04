import { useState } from 'react';
import { useVendors, useVendorMutations } from '@/hooks/useVendors';
import { useToast } from '@/hooks/use-toast';
import { TableSkeleton } from '../table-loader';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ApprovalDialog } from './approval-dialog';
import { RejectDialog } from './reject-dialog';

export type Vendor = {
    email: string;
    _id: string;
    username: string;
    role: string;
    createdAt: string;
    approvalStatus: "active" | "inactive";
    isBlocked: boolean;
};

export type DialogType = 'approve' | 'reject' | null;

export const ApprovalManagement = () => {
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
    const [activeDialog, setActiveDialog] = useState<DialogType>(null);
    const { toast } = useToast();

    const isApproved = false;
    const isRejected = false;

    const { data, isPending, refetch } = useVendors({
        isApproved,
        isRejected,
    });

    const { approveVendor, rejectVendor } = useVendorMutations({ isApproved, isRejected });


    const vendors = data?.data?.data || [];

    const openDialog = (vendor: Vendor, type: DialogType) => {
        setSelectedVendor(vendor);
        setActiveDialog(type);
    };

    const handleApprove = async () => {
        if (!selectedVendor) return;

        await approveVendor.mutateAsync(
            selectedVendor._id,
            {
                onSuccess: () => {
                    toast({
                        title: "Vendor Approved",
                        description: `${selectedVendor.username} has been successfully approved.`,
                        variant: "default",
                    });
                    setActiveDialog(null);
                    refetch();
                },
                onError: () => {
                    toast({
                        title: "Error",
                        description: "Failed to approve vendor. Please try again.",
                        variant: "destructive",
                    });
                },
            }
        );
    };

    const handleReject = async () => {
        if (!selectedVendor) return;

        rejectVendor.mutate(
            selectedVendor._id,
            {
                onSuccess: () => {
                    toast({
                        title: "Vendor Rejected",
                        description: `${selectedVendor.username} has been successfully rejected.`,
                        variant: "default",
                    });
                    setActiveDialog(null);
                    refetch();
                },
                onError: () => {
                    toast({
                        title: "Error",
                        description: "Failed to reject vendor. Please try again.",
                        variant: "destructive",
                    });
                }
            }
        );
    };

    if (isPending) {
        return <TableSkeleton />;
    }


    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl font-bold">Vendor Approval Requests</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vendors.map((vendor) => (
                    <Card key={vendor._id} className="shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg font-semibold truncate">{vendor.username}</CardTitle>
                                <Badge variant={vendor.approvalStatus === "active" ? "outline" : "secondary"}>
                                    {vendor.approvalStatus}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0 pb-2">
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground">Email:</span>
                                    <span className="truncate">{vendor.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground">Role:</span>
                                    <span>{vendor.role}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground">Requested:</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between pt-2 gap-2">
                            <Button
                                variant="secondary"
                                size="sm"
                                className="w-full"
                                onClick={() => openDialog(vendor, 'reject')}
                            >
                                Reject
                            </Button>
                            <Button
                                variant="default"
                                size="sm"
                                className="w-full"
                                onClick={() => openDialog(vendor, 'approve')}
                            >
                                Approve
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {vendors.length === 0 && (
                <Card className="w-full shadow-md p-8 text-center">
                    <p className="text-muted-foreground">No pending approval requests found.</p>
                </Card>
            )}


            <ApprovalDialog
                activeDialog={activeDialog}
                approveVendor={approveVendor}
                handleApprove={handleApprove}
                selectedVendor={selectedVendor}
                setActiveDialog={setActiveDialog}
            />

            <RejectDialog
                activeDialog={activeDialog}
                handleReject={handleReject}
                rejectVendor={rejectVendor}
                selectedVendor={selectedVendor}
                setActiveDialog={setActiveDialog}
            />
        </div>
    );
};