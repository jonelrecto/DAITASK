<template>
  <header class="sticky top-0 z-40 border-b bg-white shadow-sm">
    <div class="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
      <div class="flex items-center gap-6">
        <router-link to="/dashboard" class="text-xl font-bold text-gray-800">Task Manager</router-link>
        <nav class="flex gap-4">
          <router-link
            to="/dashboard"
            class="text-gray-600 hover:text-gray-900"
            active-class="font-medium text-blue-600"
          >
            Dashboard
          </router-link>
          <router-link
            to="/analytics"
            class="text-gray-600 hover:text-gray-900"
            active-class="font-medium text-blue-600"
          >
            Analytics
          </router-link>
        </nav>
      </div>
      <div class="flex items-center gap-4">
        <span class="text-sm text-gray-600">{{ authStore.currentUser?.email }}</span>
        <button
          type="button"
          class="rounded px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
          @click="handleLogout"
        >
          Logout
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useToast } from '@/composables/useToast';

const router = useRouter();
const authStore = useAuthStore();
const { show } = useToast();

async function handleLogout() {
  await authStore.logout();
  show('Logged out');
  router.push('/login');
}
</script>
