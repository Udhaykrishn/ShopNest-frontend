import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AddressForm } from "./address-form";
import { IAddressItemProps } from "@/types/address";

interface AddressModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    editingAddress?: IAddressItemProps | null;
    onSuccess?: () => void;
}

export function AddressModal({
    isOpen,
    onOpenChange,
    editingAddress,
}: AddressModalProps) {
    const handleCancel = () => {
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[90vw] sm:max-w-screen-md p-4 sm:p-6">
                <DialogHeader>
                    <DialogTitle className="text-lg sm:text-xl">
                        {editingAddress ? "Update Address" : "Add New Address"}
                    </DialogTitle>
                </DialogHeader>
                <div className="max-h-[70vh] overflow-y-auto">
                    <AddressForm
                        editingAddress={editingAddress}
                        onCancelEdit={handleCancel}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}