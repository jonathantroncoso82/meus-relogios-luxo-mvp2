import client from './client';
import type { ApiResponse, AuthResponse, User } from '../types';

export const authApi = {
  register: async (data: { name: string; email: string; password: string }) => {
    const res = await client.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return res.data;
  },

  login: async (data: { email: string; password: string }) => {
    const res = await client.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return res.data;
  },

  me: async () => {
    const res = await client.get<ApiResponse<User>>('/auth/me');
    return res.data;
  },
};
