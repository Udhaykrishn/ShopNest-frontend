import { RadioGroupItem } from '@/components/ui/radio-group';
import { IAddressItemProps } from '@/types/address';
import { Button } from '@/components/ui/button';

interface AddressCardProps {
    address: IAddressItemProps;
    onUpdate?: (address: IAddressItemProps) => void;
    onDelete?: (addressId: string) => void;
    onSetDefault?: (addressId: string) => void; 
    isSelected?: boolean; 
    onSelect?: (addressId: string) => void;
}

export function AddressCard({
    address,
    onUpdate,
    onDelete,
    onSetDefault,
    isSelected = false,
    onSelect,
}: AddressCardProps) {
    const handleRadioChange = () => {
        onSelect?.(address._id); 
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start space-x-4">
                <RadioGroupItem
                    value={address._id}
                    checked={isSelected}
                    onClick={handleRadioChange}
                    className="mt-1"
                />
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-semibold text-lg text-primary">{address.name}</h3>
                            <p className="text-gray-600 text-sm">{address.type}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            {address.isDefault && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Default
                                </span>
                            )}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onUpdate?.(address)}
                            >
                                Update
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => onDelete?.(address._id)}
                            >
                                Delete
                            </Button>
                            {isSelected && !address.isDefault && (
                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => onSetDefault?.(address._id)}
                                >
                                    Set Default
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className="mt-3 text-gray-700 text-sm leading-relaxed">
                        <p>{address.street},</p>
                        <p>{address.city}, {address.district}, {address.pincode}</p>
                        <p>{address.state}, {address.country}</p>
                        {address.landmark && (
                            <p className="text-gray-600">Landmark: {address.landmark}</p>
                        )}
                    </div>
                    <p className="mt-3 text-gray-700 text-sm">
                        Phone: <span className="font-medium">{address.phone}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}