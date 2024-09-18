<template>
  <div>
    <div>User analytics</div>

    <!-- Stat Displays -->
    <div>
      <HorizontalScroller :breakpoint="768">
        <div class="flex gap-2 md:flex-wrap">
          <StatDisplay
            v-for="(stat, index) in statDisplays"
            :key="index"
            class="flex-none md:flex-grow w-1/2 md:w-1/3 xl:w-1/5"
            :title="stat.title"
            :value="metricsStore.metrics[stat.metricKey]"
            :change="metricsStore.metrics[stat.changeKey]"
            @period-change="updateMetric(stat.metricKey, $event)"
            :loading="metricsStore.metricsLoading"
          />
        </div>
      </HorizontalScroller>
    </div>

    <div>
      <Card class="custom-card">
        <template #content>
          <div v-if="metricsStore.chartDataLoading">
            <Skeleton
              width="100%"
              height="300px"
              borderRadius="16px"
            ></Skeleton>
          </div>
          <div v-else>
            <ChartBase
              title="Monthly Metrics"
              :datasets="metricsStore.datasets"
              :labels="metricsStore.months"
              type="bar"
            />
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useMetricsStore } from "~/dashboard/stores/MetricsStore";
import type { NumericMetricKey, StatDisplayItem } from "~~/types/metrics";

definePageMeta({
  layout: "dashboard",
});

const metricsStore = useMetricsStore();

onMounted(() => {
  if (!metricsStore.metricsLoaded) {
    metricsStore.fetchMetrics();
  }
  if (!metricsStore.chartDataLoaded) {
    metricsStore.fetchChartData();
  }
});

const statDisplays = ref<StatDisplayItem[]>([
  {
    title: "New Users",
    metricKey: "newSignups",
    changeKey: "newSignupsChange",
  },
  {
    title: "Total Users",
    metricKey: "totalUsers",
    changeKey: "totalUsersChange",
  },
  {
    title: "Total Views",
    metricKey: "pageViews",
    changeKey: "pageViewsChange",
  },
  {
    title: "Unique Visitors",
    metricKey: "uniqueVisitors",
    changeKey: "uniqueVisitorsChange",
  },
]);

const updateMetric = async (metricKey: NumericMetricKey, period: any) => {
  await metricsStore.fetchMetrics(period);
};
</script>
