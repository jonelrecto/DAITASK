import { defineStore } from 'pinia';
import type { User } from '@/types/user.types';
import type { LoginCredentials, RegisterCredentials } from '@/types/user.types';
import * as authService from '@/services/authService';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    isAuthenticated: false,
    loading: false,
    error: null as string | null,
  }),
  getters: {
    currentUser: (state) => state.user,
    isLoading: (state) => state.loading,
    authError: (state) => state.error,
  },
  actions: {
    async register(credentials: RegisterCredentials) {
      this.loading = true;
      this.error = null;
      try {
        await authService.register(credentials);
        return true;
      } catch (err: unknown) {
        const e = err as { response?: { data?: { message?: string } } };
        this.error = e.response?.data?.message ?? 'Registration failed';
        return false;
      } finally {
        this.loading = false;
      }
    },
    async login(credentials: LoginCredentials) {
      this.loading = true;
      this.error = null;
      try {
        const data = await authService.login(credentials);
        if (data?.user) {
          this.user = data.user;
          this.isAuthenticated = true;
          return true;
        }
        return false;
      } catch (err: unknown) {
        const e = err as { response?: { data?: { message?: string } } };
        this.error = e.response?.data?.message ?? 'Login failed';
        return false;
      } finally {
        this.loading = false;
      }
    },
    async logout() {
      try {
        await authService.logout();
      } finally {
        this.user = null;
        this.isAuthenticated = false;
      }
    },
    async checkAuth() {
      try {
        const data = await authService.getCurrentUser();
        if (data?.user) {
          this.user = data.user;
          this.isAuthenticated = true;
        } else {
          this.user = null;
          this.isAuthenticated = false;
        }
      } catch {
        this.user = null;
        this.isAuthenticated = false;
      }
    },
    clearError() {
      this.error = null;
    },
  },
});
