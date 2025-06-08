import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    stock: number;
}

interface CartItem {
    product: Product;
    quantity: number;
}

interface CartState {
    cartList: CartItem[];
    cartLength: number;
    setCartList: (items: CartItem[]) => void;
    setCartLength: (length: number) => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set) => ({
            cartList: [],
            cartLength: 0,

            setCartList: (items) => set({ 
                cartList: items, 
                cartLength: items.length 
            }),

            setCartLength: (length) => set({ cartLength: length }),
        }),
        {
            name: "cart-storage",
        }
    )
);
