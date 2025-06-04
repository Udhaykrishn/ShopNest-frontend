import { useEffect, useState } from 'react';
import { useAddressQuery } from '@/hooks/address/useAddress';
import { IAddressItemProps } from '@/types/address';
import { AddressList } from './address-list';
import { AddressForm } from './address-form';

export function AddressComponent() {
    const { data, isPending, isSuccess } = useAddressQuery();
    const [addresses, setAddresses] = useState<IAddressItemProps[]>([]);
    const [editingAddress, setEditingAddress] = useState<IAddressItemProps | null>(null);

    useEffect(() => {
        if (data?.address && isSuccess) {
            setAddresses(data.address);
        }
    }, [data, isSuccess]);

    const handleUpdateAddress = (address: IAddressItemProps) => {
        setEditingAddress(address);
    };

    const handleCancelEdit = () => {
        setEditingAddress(null);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-6 py-8">
                <div className="bg-white rounded-xl shadow-lg p-6 mb-10">
                    <h1 className="text-3xl font-bold text-primary tracking-tight mb-6">My Addresses</h1>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <AddressList
                            addresses={addresses}
                            isPending={isPending}
                            onUpdate={handleUpdateAddress}
                        />
                        <AddressForm
                            editingAddress={editingAddress}
                            onCancelEdit={handleCancelEdit}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}