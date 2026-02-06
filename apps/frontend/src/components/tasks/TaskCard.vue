<template>
  <div
    class="rounded-card border border-gray-200 bg-white p-4 shadow-card transition hover:border-gray-300 hover:shadow-card-hover"
    :class="priorityBorderClass"
  >
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
    <div class="mt-3 flex justify-end gap-1">
      <button
        type="button"
        class="rounded-button p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
        aria-label="Edit task"
        @click="$emit('edit', task)"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </button>
      <button
        type="button"
        class="rounded-button p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
        aria-label="Delete task"
        @click="$emit('delete', task)"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Task, TaskPriority } from '@/types/task.types';
import StatusBadge from './StatusBadge.vue';
import PriorityBadge from './PriorityBadge.vue';

const props = defineProps<{ task: Task }>();

const priorityBorderClass = computed(() => {
  const m: Record<TaskPriority, string> = {
    High: 'border-l-4 border-l-red-500',
    Medium: 'border-l-4 border-l-amber-500',
    Low: 'border-l-4 border-l-green-500',
  };
  return m[props.task.priority] ?? '';
});

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
