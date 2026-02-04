<template>
  <span
    class="inline-flex rounded-full px-2 py-0.5 text-xs font-medium"
    :class="statusClass"
  >
    {{ status }}
  </span>
</template>

<script setup lang="ts">
import type { TaskStatus } from '@/types/task.types';
import { computed } from 'vue';

const props = defineProps<{ status: TaskStatus }>();

const statusClass = computed(() => {
  const map: Record<TaskStatus, string> = {
    Pending: 'bg-yellow-100 text-yellow-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    Completed: 'bg-green-100 text-green-800',
  };
  return map[props.status] ?? 'bg-gray-100 text-gray-800';
});
</script>
