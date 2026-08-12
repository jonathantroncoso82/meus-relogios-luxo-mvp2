import apiClient from './client';
import { ApiResponse, Usuario } from '../types';

export interface LoginPayload {
  email: string;
  senha: string;
}

export interface RegisterPayload {
  nome: string;
  email: string;
  senha: string;
}

export interface AuthData {
  usuario: Usuario;
  token: string;
}

export const authApi = {
  login: async (payload: LoginPayload) => {
    const { data } = await apiClient.post<ApiResponse<AuthData>>('/auth/login', payload);
    return data;
  },

  register: async (payload: RegisterPayload) => {
    const { data } = await apiClient.post<ApiResponse<AuthData>>('/auth/register', payload);
    return data;
  },

  me: async () => {
    const { data } = await apiClient.get<ApiResponse<Usuario>>('/auth/me');
    return data;
  },
};
