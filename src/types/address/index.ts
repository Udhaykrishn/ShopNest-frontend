export interface IAddressItemProps {
    _id: string;
    name: string;
    phone: string;
    pincode: string;
    street: string;
    city: string;
    district: string;
    state: string;
    isDefault: boolean;
    landmark: string;
    type: string;
    country: string;
}

export interface PincodeData {
    Status: string;
    Message: string;
    PostOffice: Array<{
        Name: string;
        Country: string;
        District: string;
        State: string;
    }>;
}