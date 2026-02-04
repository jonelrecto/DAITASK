<template>
  <div class="rounded-lg bg-white p-6 shadow-md" :class="cardClass">
    <div v-if="title || $slots.header" class="mb-4 border-b border-gray-200 pb-2">
      <slot name="header">
        <h2 v-if="title" class="text-lg font-semibold">{{ title }}</h2>
      </slot>
    </div>
    <div class="mb-4">
      <slot />
    </div>
    <div v-if="$slots.footer" class="border-t border-gray-200 pt-2">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string;
  cardClass?: string;
}>();
</script>
