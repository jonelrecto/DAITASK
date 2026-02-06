import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import router from '@/router';
import { useToast } from '@/composables/useToast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api',
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const { show } = useToast();
      show('Session expired. Please sign in again.', 'error');
      const authStore = useAuthStore();
      authStore.$patch({ user: null, isAuthenticated: false });
      router.push('/login');
    }
    return Promise.reject(error);
  }
);

export default api;
