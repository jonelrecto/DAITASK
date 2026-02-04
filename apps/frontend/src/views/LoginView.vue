<template>
  <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
    <Card class="w-full max-w-md">
      <h1 class="mb-6 text-center text-2xl font-bold text-gray-800">Task Manager</h1>
      <form @submit.prevent="handleSubmit">
        <FormInput
          v-model="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          :error="errors.email"
          required
        />
        <FormInput
          v-model="password"
          type="password"
          label="Password"
          placeholder="••••••••"
          :error="errors.password"
          required
        />
        <p v-if="authStore.authError" class="mb-4 text-sm text-red-500">{{ authStore.authError }}</p>
        <Button type="submit" :loading="authStore.isLoading" full-width>Log in</Button>
      </form>
      <p class="mt-4 text-center text-sm text-gray-600">
        Don't have an account?
        <router-link to="/register" class="font-medium text-blue-600 hover:underline">Register</router-link>
      </p>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Card from '@/components/common/Card.vue';
import FormInput from '@/components/common/FormInput.vue';
import Button from '@/components/common/Button.vue';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const errors = reactive<{ email: string; password: string }>({ email: '', password: '' });

function validate(): boolean {
  errors.email = '';
  errors.password = '';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim()) errors.email = 'Email is required';
  else if (!emailRegex.test(email.value)) errors.email = 'Invalid email format';
  if (!password.value) errors.password = 'Password is required';
  return !errors.email && !errors.password;
}

async function handleSubmit() {
  if (!validate()) return;
  authStore.clearError();
  const success = await authStore.login({ email: email.value, password: password.value });
  if (success) {
    const redirect = (router.currentRoute.value.query.redirect as string) || '/dashboard';
    router.push(redirect.startsWith('/') ? redirect : '/dashboard');
  }
}
</script>
