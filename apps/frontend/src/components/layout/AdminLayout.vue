<template>
  <div class="min-h-screen bg-gray-100">
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-40 bg-black/50 lg:hidden"
      aria-hidden="true"
      @click="sidebarOpen = false"
    />
    <Sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />
    <div class="lg:pl-64">
      <Header @toggle-sidebar="sidebarOpen = !sidebarOpen" />
      <main class="min-h-[calc(100vh-3.5rem)] p-4 lg:p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Sidebar from './Sidebar.vue';
import Header from './Header.vue';

const sidebarOpen = ref(false);
</script>
