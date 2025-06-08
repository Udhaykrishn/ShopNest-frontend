import { adminApi } from '@/types';
import { UserQueryParams } from '@/types/user';

export const userApi = {
    getUsers: async ({ search, page, limit }: UserQueryParams) => {
        console.log("search is: ", search)
        const { data } = await adminApi.get(`/users`, {
            params: { search, page, limit }
        });

        return data
    },

    blockUser: async (userId: string, blocked: boolean) => {
        const { data } = await adminApi.patch(`/users/block/${userId}`, {
            blocked,
        });
        return data;
    },

    unblockUser: async (userId: string, blocked: boolean) => {
        const { data } = await adminApi.patch(`/users/unblock/${userId}`, {
            blocked,
        });
        return data;
    },

};