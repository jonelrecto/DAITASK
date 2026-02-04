<template>
  <div class="p-6">
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 class="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
      <Button :loading="analyticsStore.loading" @click="refreshStats">Refresh</Button>
    </div>
    <p v-if="lastRefreshed" class="mb-4 text-sm text-gray-500">Last updated: {{ lastRefreshed }}</p>
    <div v-if="analyticsStore.loading && !analyticsStore.stats" class="flex justify-center py-12">
      <span class="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
    </div>
    <template v-else-if="analyticsStore.stats">
      <div class="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Tasks" :value="analyticsStore.stats.totalTasks" color="blue" />
        <StatCard title="Pending" :value="analyticsStore.stats.byStatus.Pending" color="yellow" />
        <StatCard title="In Progress" :value="analyticsStore.stats.byStatus['In Progress']" color="blue" />
        <StatCard title="Completed" :value="analyticsStore.stats.byStatus.Completed" color="green" />
        <StatCard title="Overdue" :value="analyticsStore.stats.overdueTasks" color="red" />
        <StatCard title="Completed This Week" :value="analyticsStore.stats.completedThisWeek" color="green" />
        <StatCard
          title="Completion Rate"
          :value="analyticsStore.stats.completionRate + '%'"
          color="gray"
        />
      </div>
      <div class="grid gap-6 lg:grid-cols-2">
        <StatusChart :data="analyticsStore.stats.byStatus" />
        <PriorityChart :data="analyticsStore.stats.byPriority" />
      </div>
    </template>
    <p v-else class="text-gray-600">No data yet. Create tasks to see analytics.</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAnalyticsStore } from '@/stores/analytics';
import { useToast } from '@/composables/useToast';
import Button from '@/components/common/Button.vue';
import StatCard from '@/components/analytics/StatCard.vue';
import StatusChart from '@/components/analytics/StatusChart.vue';
import PriorityChart from '@/components/analytics/PriorityChart.vue';

const analyticsStore = useAnalyticsStore();
const { show } = useToast();
const lastRefreshed = ref<string | null>(null);

onMounted(() => {
  analyticsStore.fetchStats();
  lastRefreshed.value = new Date().toLocaleString();
});

async function refreshStats() {
  await analyticsStore.fetchStats();
  lastRefreshed.value = new Date().toLocaleString();
  show('Analytics updated');
}
</script>
