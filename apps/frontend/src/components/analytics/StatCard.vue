<template>
  <div class="rounded-lg border bg-white p-4 shadow-sm" :class="borderClass">
    <p class="text-sm font-medium text-gray-600">{{ title }}</p>
    <p class="mt-1 text-2xl font-bold text-gray-900">{{ value }}</p>
    <p v-if="subtitle" class="mt-1 text-xs text-gray-500">{{ subtitle }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    title: string;
    value: string | number;
    subtitle?: string;
    color?: 'blue' | 'green' | 'yellow' | 'red' | 'gray';
  }>(),
  { color: 'gray' }
);

const borderClass = computed(() => {
  const map = {
    blue: 'border-l-4 border-l-blue-500',
    green: 'border-l-4 border-l-green-500',
    yellow: 'border-l-4 border-l-yellow-500',
    red: 'border-l-4 border-l-red-500',
    gray: '',
  };
  return map[props.color];
});
</script>
