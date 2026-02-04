<template>
  <Modal :is-open="isOpen" :title="title" @close="$emit('cancel')">
    <p class="mb-4">{{ message }}</p>
    <div class="flex justify-end gap-2">
      <Button variant="secondary" @click="$emit('cancel')">Cancel</Button>
      <Button variant="danger" @click="$emit('confirm')">Confirm</Button>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from './Modal.vue';
import Button from './Button.vue';

defineProps<{
  isOpen: boolean;
  title: string;
  message: string;
}>();

defineEmits<{
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();
</script>
