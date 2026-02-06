import { defineStore } from 'pinia';
import type { DashboardStats } from '@/types/analytics.types';
import * as analyticsService from '@/services/analyticsService';

export const useAnalyticsStore = defineStore('analytics', {
  state: () => ({
    stats: null as DashboardStats | null,
    loading: false,
    error: null as string | null,
  }),
  getters: {
    hasStats: (state) => !!state.stats,
    totalTasks: (state) => state.stats?.totalTasks ?? 0,
    completionRate: (state) => state.stats?.completionRate ?? 0,
  },
  actions: {
    async fetchStats() {
      this.loading = true;
      this.error = null;
      try {
        this.stats = await analyticsService.getDashboardStats();
      } catch (err: unknown) {
        const e = err as { response?: { data?: { message?: string } } };
        this.error = e.response?.data?.message ?? 'Failed to load analytics';
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});
