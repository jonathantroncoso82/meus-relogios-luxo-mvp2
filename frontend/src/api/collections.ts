import client from './client';
import type { ApiResponse, Collection } from '../types';

export const collectionsApi = {
  getAll: async () => {
    const res = await client.get<ApiResponse<Collection[]>>('/collections');
    return res.data;
  },

  getById: async (id: string) => {
    const res = await client.get<ApiResponse<Collection>>(`/collections/${id}`);
    return res.data;
  },

  create: async (data: Partial<Collection>) => {
    const res = await client.post<ApiResponse<Collection>>('/collections', data);
    return res.data;
  },

  update: async (id: string, data: Partial<Collection>) => {
    const res = await client.put<ApiResponse<Collection>>(`/collections/${id}`, data);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await client.delete<ApiResponse<null>>(`/collections/${id}`);
    return res.data;
  },
};
