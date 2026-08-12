import apiClient from './client';
import { ApiResponse, Avaliacao, ValuationForm } from '../types';

export const valuationsApi = {
  list: async (params?: { relogioId?: string }) => {
    const { data } = await apiClient.get<ApiResponse<Avaliacao[]>>('/valuations', { params });
    return data;
  },

  get: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<Avaliacao>>(`/valuations/${id}`);
    return data;
  },

  create: async (payload: ValuationForm) => {
    const { data } = await apiClient.post<ApiResponse<Avaliacao>>('/valuations', payload);
    return data;
  },

  update: async (id: string, payload: Partial<ValuationForm>) => {
    const { data } = await apiClient.put<ApiResponse<Avaliacao>>(`/valuations/${id}`, payload);
    return data;
  },

  delete: async (id: string) => {
    const { data } = await apiClient.delete<ApiResponse<null>>(`/valuations/${id}`);
    return data;
  },
};
