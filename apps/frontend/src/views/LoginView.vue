<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-100 p-4">
    <div class="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
      <h1 class="mb-2 text-center text-2xl font-bold text-gray-800">Sign In</h1>
      <p class="mb-6 text-center text-sm text-gray-500">Task Manager</p>
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
        <Button type="submit" :loading="authStore.isLoading" full-width>Sign In</Button>
      </form>
      <p class="mt-6 text-center text-sm text-gray-600">
        Don't have an account?
        <router-link to="/register" class="font-medium text-slate-700 hover:text-slate-900 hover:underline">Sign Up</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
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
