import { Category, adminApi as api } from '@/types';

const categoryService = {
    getCategories: async (): Promise<Category[]> => {
        const { data } = await api.get('/categorys');
        return data.data.data
    },

    createCategory: async ({ category, subCategory }: { category: Category, subCategory: Array<string> }): Promise<Category> => {
        const response = await api.post('/categorys', { name: category.name, subCategory });
        return response.data;
    },

    updateCategory: async ({ id, category, subCategory }: { id: string, category: Category, subCategory: Array<string> }): Promise<Category> => {
        const response = await api.put(`/categorys/${id}`, { name: category.name, subCategory });
        return response.data;
    },

    blockCategory: async (id: string): Promise<Category> => {
        try {
            const { data } = await api.patch(`/categorys/block/${id}`, { isBlocked: true });
            return data;
        } catch (error) {
            throw console.log(error)
        }
    },

    unblockCategory: async (id: string): Promise<Category> => {
        const { data } = await api.patch(`/categorys/unblock/${id}`, { isBlocked: false })
        return data;
    },

};

export default categoryService;
