import client from './client';
import type { ApiResponse, Valuation } from '../types';

export const valuationsApi = {
  getAll: async (watchId?: string) => {
    const res = await client.get<ApiResponse<Valuation[]>>('/valuations', {
      params: watchId ? { watchId } : undefined,
    });
    return res.data;
  },

  getById: async (id: string) => {
    const res = await client.get<ApiResponse<Valuation>>(`/valuations/${id}`);
    return res.data;
  },

  create: async (data: Partial<Valuation>) => {
    const res = await client.post<ApiResponse<Valuation>>('/valuations', data);
    return res.data;
  },
};
