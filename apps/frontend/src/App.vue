<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <AppHeader v-if="authStore.isAuthenticated" />
    <main>
      <router-view />
    </main>
    <ToastNotification />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import AppHeader from '@/components/AppHeader.vue';
import ToastNotification from '@/components/common/ToastNotification.vue';

const authStore = useAuthStore();
</script>

<style>
@import '@/assets/styles/main.css';
</style>
