<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <AdminLayout v-if="authStore.isAuthenticated" />
    <router-view v-else />
    <ToastNotification />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import ToastNotification from '@/components/common/ToastNotification.vue';

const authStore = useAuthStore();
</script>

<style>
@import '@/assets/styles/main.css';
</style>
