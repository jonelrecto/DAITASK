<template>
  <Modal :is-open="isOpen" :title="task ? 'Edit Task' : 'New Task'" @close="$emit('close')">
    <form @submit.prevent="handleSubmit">
      <FormInput
        v-model="form.title"
        label="Title"
        placeholder="Task title"
        :error="errors.title"
        required
      />
      <div class="mb-4">
        <label class="mb-1 block text-sm font-medium text-gray-700">Description</label>
        <textarea
          v-model="form.description"
          rows="3"
          class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Optional description"
        />
      </div>
      <div class="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">Status</label>
          <select
            v-model="form.status"
            class="w-full rounded-lg border border-gray-300 px-3 py-2"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">Priority</label>
          <select
            v-model="form.priority"
            class="w-full rounded-lg border border-gray-300 px-3 py-2"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>
      <div class="mb-4">
        <label class="mb-1 block text-sm font-medium text-gray-700">Due Date</label>
        <input
          v-model="form.dueDate"
          type="date"
          class="w-full rounded-lg border border-gray-300 px-3 py-2"
        />
      </div>
      <div class="flex justify-end gap-2">
        <Button type="button" variant="secondary" @click="$emit('close')">Cancel</Button>
        <Button type="submit" :loading="submitting">Save</Button>
      </div>
    </form>
  </Modal>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import type { Task, CreateTaskData } from '@/types/task.types';
import Modal from '@/components/common/Modal.vue';
import FormInput from '@/components/common/FormInput.vue';
import Button from '@/components/common/Button.vue';

const props = defineProps<{
  isOpen: boolean;
  task: Task | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'submit', data: CreateTaskData): void;
}>();

const submitting = ref(false);
const form = reactive({
  title: '',
  description: '',
  status: 'Pending' as 'Pending' | 'In Progress' | 'Completed',
  priority: 'Medium' as 'Low' | 'Medium' | 'High',
  dueDate: '',
});
const errors = reactive<{ title: string }>({ title: '' });

watch(
  () => [props.isOpen, props.task],
  () => {
    if (props.task) {
      form.title = props.task.title;
      form.description = props.task.description ?? '';
      form.status = props.task.status;
      form.priority = props.task.priority;
      form.dueDate = props.task.dueDate ? props.task.dueDate.slice(0, 10) : '';
    } else {
      form.title = '';
      form.description = '';
      form.status = 'Pending';
      form.priority = 'Medium';
      form.dueDate = '';
    }
    errors.title = '';
  },
  { immediate: true }
);

function handleSubmit() {
  errors.title = '';
  if (!form.title.trim()) {
    errors.title = 'Title is required';
    return;
  }
  submitting.value = true;
  emit('submit', {
    title: form.title.trim(),
    description: form.description.trim() || null,
    status: form.status,
    priority: form.priority,
    dueDate: form.dueDate || null,
  });
  submitting.value = false;
}
</script>
