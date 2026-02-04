<template>
  <div class="rounded-lg border bg-white p-4 shadow-sm transition hover:shadow-md">
    <h3 class="text-lg font-bold text-gray-800">{{ task.title }}</h3>
    <p v-if="task.description" class="mt-1 truncate text-sm text-gray-600">
      {{ task.description }}
    </p>
    <div class="mt-2 flex flex-wrap gap-2">
      <StatusBadge :status="task.status" />
      <PriorityBadge :priority="task.priority" />
    </div>
    <p v-if="task.dueDate" class="mt-2 text-sm" :class="isOverdue ? 'text-red-600' : 'text-gray-500'">
      Due: {{ formatDate(task.dueDate) }}{{ isOverdue ? ' (Overdue)' : '' }}
    </p>
    <div class="mt-3 flex justify-end gap-2">
      <button
        type="button"
        class="rounded px-2 py-1 text-sm text-blue-600 hover:bg-blue-50"
        aria-label="Edit task"
        @click="$emit('edit', task)"
      >
        Edit
      </button>
      <button
        type="button"
        class="rounded px-2 py-1 text-sm text-red-600 hover:bg-red-50"
        aria-label="Delete task"
        @click="$emit('delete', task)"
      >
        Delete
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Task } from '@/types/task.types';
import StatusBadge from './StatusBadge.vue';
import PriorityBadge from './PriorityBadge.vue';

const props = defineProps<{ task: Task }>();

defineEmits<{
  (e: 'edit', task: Task): void;
  (e: 'delete', task: Task): void;
}>();

const isOverdue = computed(() => {
  if (!props.task.dueDate || props.task.status === 'Completed') return false;
  return props.task.dueDate < new Date().toISOString().slice(0, 10);
});

function formatDate(d: string) {
  return new Date(d).toLocaleDateString();
}
</script>
