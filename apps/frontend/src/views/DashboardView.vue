<template>
  <div class="p-6">
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 class="text-2xl font-bold text-gray-800">My Tasks</h1>
      <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
        <p class="text-sm text-gray-500">Press <kbd class="rounded border border-gray-300 bg-gray-100 px-1.5 py-0.5 font-mono text-xs">Ctrl+K</kbd> to add a task</p>
        <Button @click="openCreateForm">
      <template #icon>
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </template>
      Create Task
    </Button>
      </div>
    </div>
    <div class="mb-4">
      <TaskFilters :current-filters="taskStore.filters" @filter-change="handleFilterChange" />
    </div>
    <TaskList
      :tasks="taskStore.tasks"
      :loading="taskStore.loading"
      @edit-task="openEditForm"
      @delete-task="openDeleteConfirm"
      @create="openCreateForm"
    />
    <TaskForm
      :is-open="showTaskForm"
      :task="taskToEdit"
      @close="closeTaskForm"
      @submit="handleTaskSubmit"
    />
    <ConfirmDialog
      :is-open="showDeleteConfirm"
      title="Delete Task"
      message="Are you sure you want to delete this task?"
      @confirm="handleDeleteConfirm"
      @cancel="showDeleteConfirm = false; taskToDelete = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useTaskStore } from '@/stores/task';
import { useToast } from '@/composables/useToast';
import type { Task, CreateTaskData } from '@/types/task.types';
import Button from '@/components/common/Button.vue';
import TaskFilters from '@/components/tasks/TaskFilters.vue';
import TaskList from '@/components/tasks/TaskList.vue';
import TaskForm from '@/components/tasks/TaskForm.vue';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';

const taskStore = useTaskStore();
const { show } = useToast();

const showTaskForm = ref(false);
const taskToEdit = ref<Task | null>(null);
const showDeleteConfirm = ref(false);
const taskToDelete = ref<Task | null>(null);

function onGlobalKeydown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    if (!showTaskForm.value) openCreateForm();
  }
}

onMounted(async () => {
  document.addEventListener('keydown', onGlobalKeydown);
  try {
    await taskStore.fetchTasks();
  } catch {
    show(taskStore.error ?? 'Failed to load tasks', 'error');
  }
});

onUnmounted(() => {
  document.removeEventListener('keydown', onGlobalKeydown);
});

function openCreateForm() {
  taskToEdit.value = null;
  showTaskForm.value = true;
}

function openEditForm(task: Task) {
  taskToEdit.value = task;
  showTaskForm.value = true;
}

function closeTaskForm() {
  showTaskForm.value = false;
  setTimeout(() => (taskToEdit.value = null), 200);
}

async function handleTaskSubmit(data: CreateTaskData) {
  try {
    if (taskToEdit.value) {
      await taskStore.updateTask(taskToEdit.value.id, data);
      show('Task updated');
    } else {
      await taskStore.createTask(data);
      show('Task created');
    }
    closeTaskForm();
  } catch {
    show('Something went wrong', 'error');
  }
}

function openDeleteConfirm(task: Task) {
  taskToDelete.value = task;
  showDeleteConfirm.value = true;
}

async function handleDeleteConfirm() {
  if (!taskToDelete.value) return;
  try {
    await taskStore.deleteTask(taskToDelete.value.id);
    show('Task deleted');
  } catch {
    show('Failed to delete task', 'error');
  }
  showDeleteConfirm.value = false;
  taskToDelete.value = null;
}

async function handleFilterChange(filters: { status: string; priority: string }) {
  try {
    await taskStore.setFilters(filters);
  } catch {
    show(taskStore.error ?? 'Failed to load tasks', 'error');
  }
}
</script>
