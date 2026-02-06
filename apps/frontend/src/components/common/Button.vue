<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-button px-4 py-2 font-medium transition-colors focus:outline-none disabled:opacity-50"
    :class="[
      fullWidth ? 'w-full' : '',
      variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
      variant === 'secondary' && 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2',
      variant === 'danger' && 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2',
    ]"
  >
    <span v-if="loading" class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
    <template v-else>
      <slot name="icon" />
      <span class="inline-flex items-center"><slot /></span>
    </template>
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'button' | 'submit';
    variant?: 'primary' | 'secondary' | 'danger';
    loading?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
  }>(),
  {
    type: 'button',
    variant: 'primary',
    loading: false,
    disabled: false,
    fullWidth: false,
  }
);
</script>
