<template>
  <div class="flex flex-wrap items-center gap-4">
    <div>
      <label class="mr-2 text-sm text-gray-600">Status</label>
      <select
        v-model="localStatus"
        class="rounded border border-gray-300 px-3 py-1.5 text-sm"
        @change="emitChange"
      >
        <option value="">All</option>
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>
    </div>
    <div>
      <label class="mr-2 text-sm text-gray-600">Priority</label>
      <select
        v-model="localPriority"
        class="rounded border border-gray-300 px-3 py-1.5 text-sm"
        @change="emitChange"
      >
        <option value="">All</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
    </div>
    <button
      v-if="hasActiveFilters"
      type="button"
      class="text-sm text-blue-600 hover:underline"
      @click="clearFilters"
    >
      Clear filters
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';

const props = defineProps<{
  currentFilters: { status: string; priority: string };
}>();

const emit = defineEmits<{
  (e: 'filter-change', filters: { status: string; priority: string }): void;
}>();

const localStatus = ref(props.currentFilters.status);
const localPriority = ref(props.currentFilters.priority);

watch(
  () => props.currentFilters,
  (f) => {
    localStatus.value = f.status;
    localPriority.value = f.priority;
  }
);

const hasActiveFilters = computed(
  () => localStatus.value !== '' || localPriority.value !== ''
);

function emitChange() {
  emit('filter-change', {
    status: localStatus.value,
    priority: localPriority.value,
  });
}

function clearFilters() {
  localStatus.value = '';
  localPriority.value = '';
  emit('filter-change', { status: '', priority: '' });
}
</script>
