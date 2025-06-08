import { api, Category } from '@/types';

export const categoryService = {
    getCategories: async (): Promise<{data:Category[]}> => {
        const { data } = await api.get('/categorys', { params: { isBlocked: false } })
        return data.data
    },
};


