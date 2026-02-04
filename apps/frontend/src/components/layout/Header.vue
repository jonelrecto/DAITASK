<template>
  <header class="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm lg:px-6">
    <div class="flex items-center gap-4">
      <button
        type="button"
        class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
        aria-label="Toggle sidebar"
        @click="$emit('toggle-sidebar')"
      >
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <h1 class="text-lg font-semibold text-gray-800">{{ pageTitle }}</h1>
    </div>
    <div class="relative">
      <button
        type="button"
        class="flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-gray-100"
        aria-haspopup="true"
        :aria-expanded="showDropdown"
        @click="showDropdown = !showDropdown"
      >
        <span class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-sm font-medium text-white">
          {{ userInitial }}
        </span>
        <span class="max-w-[140px] truncate text-gray-600 sm:max-w-none">{{ authStore.currentUser?.email }}</span>
        <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        v-if="showDropdown"
        class="absolute right-0 mt-1 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
        role="menu"
      >
        <div class="border-b border-gray-100 px-3 py-2 text-xs text-gray-500">
          {{ authStore.currentUser?.email }}
        </div>
        <button
          type="button"
          class="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
          role="menuitem"
          @click="handleLogout"
        >
          Sign out
        </button>
      </div>
    </div>
  </header>
  <div
    v-if="showDropdown"
    class="fixed inset-0 z-30"
    aria-hidden="true"
    @click="showDropdown = false"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useToast } from '@/composables/useToast';

defineEmits<{
  (e: 'toggle-sidebar'): void;
}>();

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const { show } = useToast();
const showDropdown = ref(false);

const pageTitle = computed(() => {
  const name = route.name as string;
  if (name === 'dashboard') return 'Dashboard';
  if (name === 'analytics') return 'Analytics';
  return 'Task Manager';
});

const userInitial = computed(() => {
  const email = authStore.currentUser?.email ?? '';
  return email.charAt(0).toUpperCase() || '?';
});

async function handleLogout() {
  showDropdown.value = false;
  await authStore.logout();
  show('Logged out');
  router.push('/login');
}
</script>
