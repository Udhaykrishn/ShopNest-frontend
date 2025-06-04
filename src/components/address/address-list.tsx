import { useState } from 'react';
import { RadioGroup } from '@/components/ui/radio-group';
import { AddressCard } from './address-card';
import { IAddressItemProps } from '@/types/address';
import { useAddressMutation } from '@/hooks/address/useAddress';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface AddressListProps {
    addresses: IAddressItemProps[];
    isPending: boolean;
    onUpdate?: (address: IAddressItemProps) => void;
}

export function AddressList({ addresses, isPending, onUpdate }: AddressListProps) {
    const { deleteAddress, setDefaultAddress } = useAddressMutation();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

    if (isPending) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (addresses.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No addresses found</p>
                <p className="text-sm mt-2">Add an address using the form on the right</p>
            </div>
        );
    }

    const handleDeleteAddress = (addressId: string) => {
        setAddressToDelete(addressId);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (addressToDelete) {
            try {
                await deleteAddress.mutateAsync(addressToDelete);
                setIsDeleteDialogOpen(false);
                setAddressToDelete(null);
            } catch (error) {
                console.error('Failed to delete address:', error);
            }
        }
    };

    const handleSelectAddress = (addressId: string) => {
        setSelectedAddressId(addressId);
    };

    const handleSetDefault = async (addressId: string) => {
        try {
            await setDefaultAddress.mutateAsync(addressId);
            setSelectedAddressId(null);
        } catch (error) {
            console.error('Failed to set default address:', error);
        }
    };

    return (
        <div className="space-y-6">
            <RadioGroup value={selectedAddressId || ''}>
                {addresses.map((address) => (
                    <AddressCard
                        key={address._id}
                        address={address}
                        onUpdate={() => onUpdate?.(address)}
                        onDelete={handleDeleteAddress}
                        onSetDefault={handleSetDefault}
                        isSelected={selectedAddressId === address._id}
                        onSelect={handleSelectAddress}
                    />
                ))}
            </RadioGroup>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Delete Address</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this address? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsDeleteDialogOpen(false);
                                setAddressToDelete(null);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                            disabled={deleteAddress.isPending}
                        >
                            {deleteAddress.isPending ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}