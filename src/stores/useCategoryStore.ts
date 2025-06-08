import { Category } from '@/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface CategoryState {
    categories: Category[];
    isLoading: boolean;
    error: string | null;
    setCategories: (categories: Category[]) => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    fetchCategories: () => Promise<void>;
}

export const useCategoryStore = create<CategoryState>()(
    devtools(
        (set) => ({
            categories: [],
            isLoading: false,
            error: null,
            setCategories: (categories) => set({ categories }),
            setLoading: (isLoading) => set({ isLoading }),
            setError: (error) => set({ error }),
            fetchCategories: async () => {
                try {
                    set({ isLoading: true, error: null });
                    const response = await fetch('/api/categories'); // Replace with your API endpoint
                    const data = await response.json();
                    set({ categories: data.data, isLoading: false });
                } catch (error) {
                    set({ error: 'Failed to fetch categories', isLoading: false });
                }
            },
        }),
        {
            name: 'category-store',
        }
    )
);