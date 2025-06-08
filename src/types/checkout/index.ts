
export interface Address {
  _id: string;
  city: string;
  country: string;
  isDefault: boolean;
  landmark: string;
  name: string;
  pincode: string;
  state: string;
  street: string;
  type: string;
  phone: string;
}

export interface CartItem {
  image: string;
  productId: string;
  quantity: number;
  sku: string;
  subTotal: number;
  _id: string;
}

export interface Coupon {
  _id: string;
  name: string;
  offerPrice: number;
  min_price: number;
  expireOn: string;
}


