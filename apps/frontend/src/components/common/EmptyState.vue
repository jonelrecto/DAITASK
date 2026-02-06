<template>
  <div class="flex flex-col items-center justify-center rounded-card border-2 border-dashed border-gray-200 bg-gray-50 py-12 text-center">
    <span class="mb-4 text-gray-400" aria-hidden="true">
      <svg class="mx-auto h-14 w-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    </span>
    <p class="text-gray-600">{{ message }}</p>
    <Button
      v-if="actionText"
      variant="primary"
      class="mt-4"
      @click="$emit('action')"
    >
      {{ actionText }}
    </Button>
  </div>
</template>

<script setup lang="ts">
import Button from './Button.vue';

defineProps<{
  message: string;
  actionText?: string;
}>();

defineEmits<{
  (e: 'action'): void;
}>();
</script>
