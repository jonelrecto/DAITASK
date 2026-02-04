import { defineStore } from 'pinia';
import type { Task, TaskFilters, CreateTaskData, UpdateTaskData } from '@/types/task.types';
import * as taskService from '@/services/taskService';

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: [] as Task[],
    loading: false,
    error: null as string | null,
    filters: { status: '', priority: '' } as { status: string; priority: string },
  }),
  getters: {
    taskCount: (state) => state.tasks.length,
    pendingTasks: (state) => state.tasks.filter((t) => t.status === 'Pending'),
    inProgressTasks: (state) => state.tasks.filter((t) => t.status === 'In Progress'),
    completedTasks: (state) => state.tasks.filter((t) => t.status === 'Completed'),
  },
  actions: {
    async fetchTasks() {
      this.loading = true;
      this.error = null;
      try {
        const f: TaskFilters = {};
        if (this.filters.status) f.status = this.filters.status as TaskFilters['status'];
        if (this.filters.priority) f.priority = this.filters.priority as TaskFilters['priority'];
        this.tasks = await taskService.getTasks(f);
      } catch (err: unknown) {
        const e = err as { response?: { data?: { message?: string } } };
        this.error = e.response?.data?.message ?? 'Failed to load tasks';
      } finally {
        this.loading = false;
      }
    },
    async createTask(taskData: CreateTaskData) {
      this.error = null;
      try {
        const task = await taskService.createTask(taskData);
        this.tasks.unshift(task);
        return task;
      } catch (err: unknown) {
        const e = err as { response?: { data?: { message?: string } } };
        this.error = e.response?.data?.message ?? 'Failed to create task';
        throw err;
      }
    },
    async updateTask(id: number, taskData: UpdateTaskData) {
      this.error = null;
      try {
        const task = await taskService.updateTask(id, taskData);
        const i = this.tasks.findIndex((t) => t.id === id);
        if (i !== -1) this.tasks[i] = task;
        return task;
      } catch (err: unknown) {
        const e = err as { response?: { data?: { message?: string } } };
        this.error = e.response?.data?.message ?? 'Failed to update task';
        throw err;
      }
    },
    async deleteTask(id: number) {
      this.error = null;
      try {
        await taskService.deleteTask(id);
        this.tasks = this.tasks.filter((t) => t.id !== id);
      } catch (err: unknown) {
        const e = err as { response?: { data?: { message?: string } } };
        this.error = e.response?.data?.message ?? 'Failed to delete task';
        throw err;
      }
    },
    setFilters(filters: { status?: string; priority?: string }) {
      if (filters.status !== undefined) this.filters.status = filters.status;
      if (filters.priority !== undefined) this.filters.priority = filters.priority;
      return this.fetchTasks();
    },
  },
});
