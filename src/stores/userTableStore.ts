import { create } from 'zustand';

export const useUserTableStore = create((set) => ({
  search: '',
  page: 1,
  limit: 5,
  setSearch: (search) => set({ search, page: 1 }),
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit, page: 1 }),
}));