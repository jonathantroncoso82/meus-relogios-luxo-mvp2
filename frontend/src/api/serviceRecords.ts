import apiClient from './client';
import { ApiResponse, Manutencao, ServiceRecordForm } from '../types';

export const serviceRecordsApi = {
  list: async (params?: { relogioId?: string }) => {
    const { data } = await apiClient.get<ApiResponse<Manutencao[]>>('/service-records', { params });
    return data;
  },

  get: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<Manutencao>>(`/service-records/${id}`);
    return data;
  },

  create: async (payload: ServiceRecordForm) => {
    const { data } = await apiClient.post<ApiResponse<Manutencao>>('/service-records', payload);
    return data;
  },

  update: async (id: string, payload: Partial<ServiceRecordForm>) => {
    const { data } = await apiClient.put<ApiResponse<Manutencao>>(`/service-records/${id}`, payload);
    return data;
  },

  delete: async (id: string) => {
    const { data } = await apiClient.delete<ApiResponse<null>>(`/service-records/${id}`);
    return data;
  },
};
