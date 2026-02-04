<template>
  <div class="rounded-lg border bg-white p-4 shadow-sm">
    <h3 class="mb-4 text-lg font-semibold">Tasks by Status</h3>
    <div class="mx-auto h-64 w-64">
      <Doughnut v-if="chartData" :data="chartData" :options="options" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps<{
  data: { Pending: number; 'In Progress': number; Completed: number };
}>();

const chartData = computed(() => {
  const d = props.data;
  return {
    labels: ['Pending', 'In Progress', 'Completed'],
    datasets: [
      {
        data: [d.Pending, d['In Progress'], d.Completed],
        backgroundColor: ['#fef08a', '#93c5fd', '#86efac'],
        borderWidth: 0,
      },
    ],
  };
});

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom' } },
};
</script>
