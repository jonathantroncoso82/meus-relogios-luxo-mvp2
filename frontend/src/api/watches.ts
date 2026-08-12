import client from './client';
import type { ApiResponse, Watch } from '../types';

export interface WatchFilters {
  search?: string;
  brandId?: string;
  collectionId?: string;
}

export const watchesApi = {
  getAll: async (filters?: WatchFilters) => {
    const res = await client.get<ApiResponse<Watch[]>>('/watches', { params: filters });
    return res.data;
  },

  getById: async (id: string) => {
    const res = await client.get<ApiResponse<Watch>>(`/watches/${id}`);
    return res.data;
  },

  create: async (data: Partial<Watch>) => {
    const res = await client.post<ApiResponse<Watch>>('/watches', data);
    return res.data;
  },

  update: async (id: string, data: Partial<Watch>) => {
    const res = await client.put<ApiResponse<Watch>>(`/watches/${id}`, data);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await client.delete<ApiResponse<null>>(`/watches/${id}`);
    return res.data;
  },
};
