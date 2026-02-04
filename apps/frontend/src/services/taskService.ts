import api from './api';
import type { Task, TaskFilters, CreateTaskData, UpdateTaskData } from '@/types/task.types';

export async function getTasks(filters: TaskFilters = {}): Promise<Task[]> {
  const params = new URLSearchParams();
  if (filters.status) params.set('status', filters.status);
  if (filters.priority) params.set('priority', filters.priority);
  const query = params.toString();
  const url = query ? `/tasks?${query}` : '/tasks';
  const { data } = await api.get<Task[]>(url);
  return Array.isArray(data) ? data : [];
}

export async function getTaskById(id: number): Promise<Task> {
  const { data } = await api.get<Task>('/tasks/' + id);
  return data;
}

export async function createTask(taskData: CreateTaskData): Promise<Task> {
  const { data } = await api.post<Task>('/tasks', taskData);
  return data;
}

export async function updateTask(id: number, taskData: UpdateTaskData): Promise<Task> {
  const { data } = await api.put<Task>('/tasks/' + id, taskData);
  return data;
}

export async function deleteTask(id: number): Promise<void> {
  await api.delete('/tasks/' + id);
}
