import { ref } from 'vue';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

const toasts = ref<Toast[]>([]);
let nextId = 0;
let timeoutId: ReturnType<typeof setTimeout> | null = null;

export function useToast() {
  function show(message: string, type: ToastType = 'success') {
    const id = nextId++;
    toasts.value = [...toasts.value, { id, message, type }];
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      remove(id);
      timeoutId = null;
    }, 3000);
  }

  function remove(id: number) {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  }

  return { toasts, show, remove };
}
