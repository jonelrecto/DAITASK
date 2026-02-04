import api from './api';
import type { DashboardStats } from '@/types/analytics.types';

export async function getDashboardStats(): Promise<DashboardStats> {
  const { data } = await api.get<DashboardStats>('/analytics/dashboard');
  return data;
}
