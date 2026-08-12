import apiClient from './client';
import { ApiResponse, Marca, BrandForm } from '../types';

export const brandsApi = {
  list: async (params?: { search?: string }) => {
    const { data } = await apiClient.get<ApiResponse<Marca[]>>('/brands', { params });
    return data;
  },

  get: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<Marca>>(`/brands/${id}`);
    return data;
  },

  create: async (payload: BrandForm) => {
    const { data } = await apiClient.post<ApiResponse<Marca>>('/brands', payload);
    return data;
  },

  update: async (id: string, payload: Partial<BrandForm>) => {
    const { data } = await apiClient.put<ApiResponse<Marca>>(`/brands/${id}`, payload);
    return data;
  },

  delete: async (id: string) => {
    const { data } = await apiClient.delete<ApiResponse<null>>(`/brands/${id}`);
    return data;
  },
};
