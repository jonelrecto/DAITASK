import api from './api';
import type { User } from '@/types/user.types';
import type { LoginCredentials, RegisterCredentials } from '@/types/user.types';
import type { ApiResponse } from '@/types/api.types';

export async function register(
  credentials: RegisterCredentials
): Promise<ApiResponse<{ message: string }>> {
  const { data } = await api.post('/auth/register', credentials);
  return data;
}

export async function login(
  credentials: LoginCredentials
): Promise<ApiResponse<{ user: User }>> {
  const { data } = await api.post('/auth/login', credentials);
  return data;
}

export async function logout(): Promise<ApiResponse<{ message: string }>> {
  const { data } = await api.post('/auth/logout');
  return data;
}

export async function getCurrentUser(): Promise<ApiResponse<{ user: User }>> {
  const { data } = await api.get('/auth/me');
  return data;
}
