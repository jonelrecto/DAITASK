<template>
  <div class="rounded-lg border bg-white p-4 shadow-sm">
    <h3 class="mb-4 text-lg font-semibold">Tasks by Priority</h3>
    <div class="h-64">
      <Bar v-if="chartData" :data="chartData" :options="options" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const props = defineProps<{
  data: { Low: number; Medium: number; High: number };
}>();

const chartData = computed(() => ({
  labels: ['Low', 'Medium', 'High'],
  datasets: [
    {
      label: 'Tasks',
      data: [props.data.Low, props.data.Medium, props.data.High],
      backgroundColor: ['#86efac', '#fdba74', '#fca5a5'],
    },
  ],
}));

const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: { y: { beginAtZero: true } },
  plugins: { legend: { display: false } },
};
</script>
