<template>
  <div v-if="loading" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <div
      v-for="i in 6"
      :key="i"
      class="rounded-card border border-gray-200 bg-white p-4 shadow-card"
    >
      <div class="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
      <div class="mt-2 h-4 w-full animate-pulse rounded bg-gray-100" />
      <div class="mt-2 flex gap-2">
        <div class="h-6 w-16 animate-pulse rounded-full bg-gray-100" />
        <div class="h-6 w-20 animate-pulse rounded-full bg-gray-100" />
      </div>
      <div class="mt-3 flex justify-end gap-1">
        <div class="h-8 w-8 animate-pulse rounded bg-gray-100" />
        <div class="h-8 w-8 animate-pulse rounded bg-gray-100" />
      </div>
    </div>
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
