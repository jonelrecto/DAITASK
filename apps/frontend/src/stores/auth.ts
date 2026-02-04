import { defineStore } from 'pinia';
import type { User } from '@/types/user.types';
import type { LoginCredentials, RegisterCredentials } from '@/types/user.types';
import * as authService from '@/services/authService';

type AuthUserResponse = { user?: User };

const AUTH_STORAGE_KEY = 'task_manager_auth';

function loadPersistedAuth(): { user: User | null; isAuthenticated: boolean } {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as { user: User; isAuthenticated: boolean };
      if (parsed.user && parsed.isAuthenticated) {
        return { user: parsed.user, isAuthenticated: true };
      }
    }
  } catch {
    // ignore invalid or missing data
  }
  return { user: null, isAuthenticated: false };
}

function persistAuth(user: User) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user, isAuthenticated: true }));
}

function clearPersistedAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export const useAuthStore = defineStore('auth', {
  state: () => {
    const { user, isAuthenticated } = loadPersistedAuth();
    return {
      user,
      isAuthenticated,
      loading: false,
      error: null as string | null,
    };
  },
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
        const data = (await authService.login(credentials)) as AuthUserResponse | undefined;
        if (data?.user) {
          this.user = data.user;
          this.isAuthenticated = true;
          persistAuth(data.user);
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
        clearPersistedAuth();
      }
    },
    async checkAuth() {
      try {
        const data = (await authService.getCurrentUser()) as AuthUserResponse | undefined;
        if (data?.user) {
          this.user = data.user;
          this.isAuthenticated = true;
          persistAuth(data.user);
        } else {
          this.user = null;
          this.isAuthenticated = false;
          clearPersistedAuth();
        }
      } catch {
        this.user = null;
        this.isAuthenticated = false;
        clearPersistedAuth();
      }
    },
    clearError() {
      this.error = null;
    },
  },
});
