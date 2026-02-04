import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '@/stores/auth';

vi.mock('@/services/authService', () => ({
  login: vi.fn().mockResolvedValue({ user: { id: 1, email: 'test@test.com', createdAt: '', updatedAt: '' } }),
  register: vi.fn().mockResolvedValue({ message: 'ok' }),
  logout: vi.fn().mockResolvedValue(undefined),
  getCurrentUser: vi.fn().mockRejectedValue(new Error('unauthorized')),
}));

describe('Auth store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('starts unauthenticated', () => {
    const store = useAuthStore();
    expect(store.isAuthenticated).toBe(false);
    expect(store.user).toBeNull();
  });

  it('login sets user and isAuthenticated', async () => {
    const store = useAuthStore();
    const success = await store.login({ email: 'a@b.com', password: 'pass' });
    expect(success).toBe(true);
    expect(store.isAuthenticated).toBe(true);
    expect(store.user?.email).toBe('test@test.com');
  });
});
