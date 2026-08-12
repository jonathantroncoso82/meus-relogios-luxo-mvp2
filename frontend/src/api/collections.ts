import apiClient from './client';
import { ApiResponse, Colecao, CollectionForm } from '../types';

export const collectionsApi = {
  list: async (params?: { search?: string }) => {
    const { data } = await apiClient.get<ApiResponse<Colecao[]>>('/collections', { params });
    return data;
  },

  get: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<Colecao>>(`/collections/${id}`);
    return data;
  },

  create: async (payload: CollectionForm) => {
    const { data } = await apiClient.post<ApiResponse<Colecao>>('/collections', payload);
    return data;
  },

  update: async (id: string, payload: Partial<CollectionForm>) => {
    const { data } = await apiClient.put<ApiResponse<Colecao>>(`/collections/${id}`, payload);
    return data;
  },

  delete: async (id: string) => {
    const { data } = await apiClient.delete<ApiResponse<null>>(`/collections/${id}`);
    return data;
  },
};
