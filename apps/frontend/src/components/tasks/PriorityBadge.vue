<template>
  <span class="inline-flex rounded-full px-2 py-0.5 text-xs font-medium" :class="priorityClass">
    {{ priority }}
  </span>
</template>

<script setup lang="ts">
import type { TaskPriority } from '@/types/task.types';
import { computed } from 'vue';

const props = defineProps<{ priority: TaskPriority }>();

const priorityClass = computed(() => {
  if (props.priority === 'Low') return 'bg-green-100 text-green-800';
  if (props.priority === 'Medium') return 'bg-orange-100 text-orange-800';
  if (props.priority === 'High') return 'bg-red-100 text-red-800';
  return 'bg-gray-100 text-gray-800';
});
</script>
