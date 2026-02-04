<template>
  <div class="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 py-12 text-center">
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
