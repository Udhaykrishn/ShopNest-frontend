export interface Products {
    id: string;
    username: string;
    description: string;
    brand: string;
    category: string;
    subcategory: string;
    images: ProductImage[];
    isBlocked: boolean;
}

export interface ProductImage {
    id: string;
    url: string;
    file?: File;
}

// types.ts
export type AttributeOption = {
    id: string;
    value: string;
};

export type ProductAttribute = {
    attributes: {
    id: string;
    name: string;
    options:AttributeOption[]
  }[];
};

export type ProductVariant = {
    id: string;
    attributes: Record<string, string>;
    price: string;
    stock: string;
    sku: string;
};

export interface ProductImage {
    id: string;
    url: string;
    publicId?: string;
    file?: File;
    uploading?: boolean;
    uploaded?: boolean;
}

export interface FormData {
  variants: {
    price: string;
    stock: string;
    sku?: string;
    attributes: Record<string, string>;
  }[];
}


export interface ProductImage {
    id: string;
    url: string
    file?: File;
    publicId?: string;
    isUploading: boolean;
    isUploaded: boolean;
}