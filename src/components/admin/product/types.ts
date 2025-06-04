interface Vendor {
    id: string;
    username: string;
    email: string;
    phone: string;
}

interface VariantValue {
    value: string;
    price?: number;
    offeredPrice:number;
    stock?: number;
}

interface Variant {
    _id: string;
    type: string;
    values: VariantValue[];
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price?: number;
    offeredPrice:number;
    images: string[];
    isApproved: boolean;
    isBlocked: boolean;
    brand: string;
    category: string;
    subcategory: string;
    vendor: Vendor;
    variants: Variant[];
}