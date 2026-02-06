<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      ref="overlayRef"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      tabindex="-1"
      @click.self="emit('close')"
    >
      <div
        ref="panelRef"
        class="max-h-[90vh] w-full max-w-lg overflow-auto rounded-card bg-white shadow-dropdown"
        :aria-labelledby="title ? 'modal-title' : undefined"
        @click.stop
      >
        <div class="flex items-center justify-between border-b border-gray-200 p-4">
          <h2 v-if="title" id="modal-title" class="text-lg font-semibold">{{ title }}</h2>
          <button
            ref="closeButtonRef"
            type="button"
            class="rounded-button p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
            @click="emit('close')"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
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
import { ref, watch, nextTick, onUnmounted } from 'vue';

const props = defineProps<{
  isOpen: boolean;
  title?: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const overlayRef = ref<HTMLElement | null>(null);
const panelRef = ref<HTMLElement | null>(null);
const closeButtonRef = ref<HTMLButtonElement | null>(null);

function getFirstFocusable(el: HTMLElement): HTMLElement | null {
  const sel = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const focusable = el.querySelectorAll<HTMLElement>(sel);
  for (let i = 0; i < focusable.length; i++) {
    if (focusable[i].offsetParent !== null) return focusable[i];
  }
  return null;
}

function handleEscape(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close');
}

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      nextTick(() => {
        const first = panelRef.value ? getFirstFocusable(panelRef.value) : null;
        (first || closeButtonRef.value)?.focus();
      });
      document.addEventListener('keydown', handleEscape);
    } else {
      document.removeEventListener('keydown', handleEscape);
    }
  }
);

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape);
});
</script>
