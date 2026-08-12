import client from './client';
import type { ApiResponse, ServiceRecord } from '../types';

export const serviceRecordsApi = {
  getAll: async (watchId?: string) => {
    const res = await client.get<ApiResponse<ServiceRecord[]>>('/service-records', {
      params: watchId ? { watchId } : undefined,
    });
    return res.data;
  },

  getById: async (id: string) => {
    const res = await client.get<ApiResponse<ServiceRecord>>(`/service-records/${id}`);
    return res.data;
  },

  create: async (data: Partial<ServiceRecord>) => {
    const res = await client.post<ApiResponse<ServiceRecord>>('/service-records', data);
    return res.data;
  },

  update: async (id: string, data: Partial<ServiceRecord>) => {
    const res = await client.put<ApiResponse<ServiceRecord>>(`/service-records/${id}`, data);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await client.delete<ApiResponse<null>>(`/service-records/${id}`);
    return res.data;
  },
};
