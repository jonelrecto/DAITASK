<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="$emit('close')"
      @keydown.escape="$emit('close')"
    >
      <div
        role="dialog"
        aria-modal="true"
        :aria-labelledby="title ? 'modal-title' : undefined"
        class="max-h-[90vh] w-full max-w-lg overflow-auto rounded-lg bg-white shadow-xl"
        @click.stop
      >
        <div class="flex items-center justify-between border-b p-4">
          <h2 v-if="title" id="modal-title" class="text-lg font-semibold">{{ title }}</h2>
          <button
            type="button"
            class="rounded p-1 hover:bg-gray-100"
            aria-label="Close"
            @click="$emit('close')"
          >
            <span class="text-xl">&times;</span>
          </button>
        </div>
        <div class="p-4">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean;
  title?: string;
}>();

defineEmits<{
  (e: 'close'): void;
}>();
</script>
