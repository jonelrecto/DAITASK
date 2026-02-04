import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useAuthStore } from './stores/auth';
import './assets/styles/main.css';

const pinia = createPinia();
const app = createApp(App);
app.use(pinia);
app.use(router);

async function init() {
  const authStore = useAuthStore();
  await authStore.checkAuth();
  app.mount('#app');
}
init();
