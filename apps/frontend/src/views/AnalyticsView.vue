<template>
  <div class="p-6">
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 class="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
      <Button :loading="analyticsStore.loading" @click="refreshStats">Refresh</Button>
    </div>
    <p v-if="lastRefreshed && !analyticsStore.loading" class="mb-4 text-sm text-gray-500">Last updated: {{ lastRefreshed }}</p>
    <p v-if="analyticsStore.loading && !analyticsStore.stats" class="mb-4 text-sm text-gray-500">Loading...</p>
    <div v-if="analyticsStore.loading && !analyticsStore.stats" class="space-y-8">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="i in 7" :key="i" class="h-24 animate-pulse rounded-card border border-gray-200 bg-gray-50" />
      </div>
      <div class="grid gap-6 lg:grid-cols-2">
        <div class="h-64 animate-pulse rounded-card border border-gray-200 bg-gray-50" />
        <div class="h-64 animate-pulse rounded-card border border-gray-200 bg-gray-50" />
      </div>
    </div>
    <p v-else-if="analyticsStore.error && !analyticsStore.loading" class="mb-4 text-sm text-red-600">{{ analyticsStore.error }}</p>
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
    <p v-else-if="!analyticsStore.stats && !analyticsStore.error" class="text-gray-600">No data yet. Create tasks to see analytics.</p>
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

onMounted(async () => {
  try {
    await analyticsStore.fetchStats();
    lastRefreshed.value = new Date().toLocaleString();
  } catch {
    show(analyticsStore.error ?? 'Failed to load analytics', 'error');
  }
});

async function refreshStats() {
  try {
    await analyticsStore.fetchStats();
    lastRefreshed.value = new Date().toLocaleString();
    show('Analytics updated');
  } catch {
    show(analyticsStore.error ?? 'Failed to load analytics', 'error');
  }
}
</script>
