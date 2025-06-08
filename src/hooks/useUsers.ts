import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/api/users';
import { ApiResponse, User, UserQueryParams } from '@/types/user';


export const useUsers = ({ search, page, limit }: UserQueryParams) => {
    return useQuery({
        queryKey: ['users', { search, page, limit }],
        queryFn: () => userApi.getUsers({ search, page, limit }),
        placeholderData: (prev) => prev,
    });
};

export const useBlockUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId }: { userId: string }) => userApi.blockUser(userId, true),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};

export const useUnBlockUser = () => {
    const queryClient = useQueryClient();

    return useMutation<ApiResponse<User>, Error, { userId: string }>({
        mutationFn: ({ userId }) => userApi.unblockUser(userId, false),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};