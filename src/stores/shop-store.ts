import { create } from 'zustand';
import { Product } from '@/types';

interface ShopState {
    products: Product[];
    setProducts: (products: Product[]) => void;
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    sortBy: string;
    setSortBy: (sortBy: string) => void;
}

export const useShopStore = create<ShopState>((set) => ({
    products: [],
    setProducts: (products) => set({ products }),
    selectedCategory: 'All Categories',
    setSelectedCategory: (category) => set({ selectedCategory: category }),
    sortBy: 'newest',
    setSortBy: (sortBy) => set({ sortBy }),
}));