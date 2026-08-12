import client from './client';
import type { ApiResponse, Brand } from '../types';

export const brandsApi = {
  getAll: async () => {
    const res = await client.get<ApiResponse<Brand[]>>('/brands');
    return res.data;
  },

  getById: async (id: string) => {
    const res = await client.get<ApiResponse<Brand>>(`/brands/${id}`);
    return res.data;
  },

  create: async (data: Partial<Brand>) => {
    const res = await client.post<ApiResponse<Brand>>('/brands', data);
    return res.data;
  },

  update: async (id: string, data: Partial<Brand>) => {
    const res = await client.put<ApiResponse<Brand>>(`/brands/${id}`, data);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await client.delete<ApiResponse<null>>(`/brands/${id}`);
    return res.data;
  },
};
