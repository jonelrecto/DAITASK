<template>
  <Teleport to="body">
    <div class="fixed right-4 top-4 z-[100] flex flex-col gap-2">
      <div
        v-for="t in toasts"
        :key="t.id"
        class="rounded-lg px-4 py-2 shadow-lg"
        :class="
          t.type === 'success'
            ? 'bg-green-600 text-white'
            : t.type === 'error'
              ? 'bg-red-600 text-white'
              : 'bg-blue-600 text-white'
        "
      >
        {{ t.message }}
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast';

const { toasts } = useToast();
</script>
