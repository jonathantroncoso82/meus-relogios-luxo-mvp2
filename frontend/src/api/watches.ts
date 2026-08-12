import apiClient from './client';
import { ApiResponse, Relogio, WatchForm } from '../types';

export const watchesApi = {
  list: async (params?: { search?: string; colecaoId?: string; marcaId?: string }) => {
    const { data } = await apiClient.get<ApiResponse<Relogio[]>>('/watches', { params });
    return data;
  },

  get: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<Relogio>>(`/watches/${id}`);
    return data;
  },

  create: async (payload: WatchForm) => {
    const { data } = await apiClient.post<ApiResponse<Relogio>>('/watches', payload);
    return data;
  },

  update: async (id: string, payload: Partial<WatchForm>) => {
    const { data } = await apiClient.put<ApiResponse<Relogio>>(`/watches/${id}`, payload);
    return data;
  },

  delete: async (id: string) => {
    const { data } = await apiClient.delete<ApiResponse<null>>(`/watches/${id}`);
    return data;
  },
};
