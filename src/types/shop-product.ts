export interface VariantValue {
  value: string;
  price: number;
  offeredPrice: number;
  stock: number;
  sku?: string;
}

export interface Variant {
  _id:string;
  type: string;
  values: VariantValue[];
}

export interface CategoryObject {
  _id: string;
  subCategory?: any[];
  isBlocked?: boolean;
  name?: string;
}

export interface Product {
  _id: string;
  name: string;
  brand: string;
  description: string;
  images: string[];
  category: string | CategoryObject;
  subcategory?: string;
  subCategory?: string;
  variants: Variant[];
  isBlocked?: boolean;
  isApproved?: boolean;
  createdAt?: string;
  vendorId?: any;
  status: "pending" | "rejected" | "approved" 
}