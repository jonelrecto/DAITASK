<template>
  <Teleport to="body">
    <div class="fixed right-4 top-4 z-[100] flex flex-col gap-2">
      <TransitionGroup name="toast" tag="div" class="flex flex-col gap-2">
        <div
          v-for="t in toasts"
          :key="t.id"
          class="flex items-center gap-2 rounded-card px-4 py-3 shadow-dropdown"
          :class="
            t.type === 'success'
              ? 'bg-green-600 text-white'
              : t.type === 'error'
                ? 'bg-red-600 text-white'
                : 'bg-blue-600 text-white'
          "
        >
          <span class="shrink-0" aria-hidden="true">
            <svg v-if="t.type === 'success'" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <svg v-else-if="t.type === 'error'" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <span>{{ t.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { TransitionGroup } from 'vue';
import { useToast } from '@/composables/useToast';

const { toasts } = useToast();
</script>
