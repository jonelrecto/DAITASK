<template>
  <div v-if="loading" class="flex justify-center py-8">
    <span class="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
  </div>
  <div v-else-if="tasks.length === 0" class="py-4">
    <EmptyState
      message="No tasks yet. Create one to get started."
      action-text="Create Task"
      @action="$emit('create')"
    />
  </div>
  <div
    v-else
    class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
  >
    <TaskCard
      v-for="task in tasks"
      :key="task.id"
      :task="task"
      @edit="$emit('edit-task', $event)"
      @delete="$emit('delete-task', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import type { Task } from '@/types/task.types';
import TaskCard from './TaskCard.vue';
import EmptyState from '@/components/common/EmptyState.vue';

defineProps<{
  tasks: Task[];
  loading: boolean;
}>();

defineEmits<{
  (e: 'edit-task', task: Task): void;
  (e: 'delete-task', task: Task): void;
  (e: 'create'): void;
}>();
</script>
