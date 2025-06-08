import { api, Product } from "@/types";

export const fetchProducts = async (
  search?: string, category?: string, sortBy?: string): Promise<{
    data: any; products: Product[]
  }> => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (category && category !== 'All') params.append('category', category);
  if (sortBy && sortBy !== 'default') params.append('sortBy', sortBy);

  const response = await api.get(`/vendor/products`, { params });
  console.log(response.data)
  return response.data;
};