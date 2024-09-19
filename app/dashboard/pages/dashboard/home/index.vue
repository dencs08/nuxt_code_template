<template>
  <div>
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
    <div class="flex flex-col md:flex-row gap-2">
      <div class="w-full md:w-2/3 lg:w-3/4 md:overflow-y-auto space-y-2">
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

        <div>
          <HorizontalScroller :breakpoint="768">
            <div class="flex gap-2 md:flex-wrap">
              <div
                v-for="(action, index) in quickActions"
                :key="index"
                class="flex-none md:flex-grow md:w-1/3 xl:w-1/4 cursor-pointer"
              >
                <Card
                  class="no-content p-5 custom-card group hover:!shadow-md transition-shadow duration-300"
                  @click="handleAction(action, index)"
                >
                  <template #header>
                    <div v-auto-animate>
                      <template v-if="action.loading">
                        <div class="flex gap-2">
                          <Icon
                            name="ic:round-autorenew"
                            class="h-6 w-auto animate-spin text-gray-500"
                          />
                          <p class="text-sm md:text-base">Loading...</p>
                        </div>
                      </template>
                      <template v-else>
                        <div class="flex gap-2">
                          <Icon
                            :name="action.icon"
                            class="h-6 w-auto transition group-hover:scale-110"
                            :class="action.color"
                          />
                          <p
                            class="text-sm md:text-base group-hover:scale-105 group-hover:translate-x-1 transition"
                          >
                            {{ action.title }}
                          </p>
                        </div>
                      </template>
                    </div>
                  </template>
                </Card>
              </div>
            </div>
          </HorizontalScroller>
        </div>
      </div>

      <div class="w-full md:w-1/3 lg:w-1/4">
        <Card class="custom-card">
          <template #title>
            <h2 class="text-db-h2">Feed</h2>
          </template>
          <template #content>
            <ScrollPanel class="h-full">
              <Timeline :value="events">
                <template #opposite="slotProps">
                  <small class="text-surface-500 dark:text-surface-400">
                    {{ slotProps.item.date }}
                  </small>
                </template>
                <template #content="slotProps">
                  {{ slotProps.item.status }}
                </template>
              </Timeline>
            </ScrollPanel>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMetricsStore } from "~/dashboard/stores/MetricsStore";
import type { NumericMetricKey, StatDisplayItem } from "~~/types/metrics";

definePageMeta({
  layout: "dashboard",
});

const metricsStore = useMetricsStore();
const userStore = useUserStore();
const user = userStore.getUser;
const localePath = useLocalePath();
const { hasAccess } = useRoleCheck();
const { submit, error } = useForm();
const { isDarkMode, toggleDarkMode } = useDarkMode();
const isAdmin = hasAccess(75);
const router = useRouter();

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

const quickActions = ref([
  {
    title: "View users",
    icon: "ic:round-person",
    color: "text-primary-500 group-hover:text-primary-600",
    action: () => navigateTo(localePath("/dashboard/admin/users")),
    loading: false,
  },
  {
    title: "Send emails",
    icon: "ic:round-mail",
    color: "text-secondary-500 group-hover:text-secondary-600",
    action: () => navigateTo(localePath("/dashboard/mail/templates")),
    loading: false,
  },
  {
    title: "Check analytics",
    icon: "ic:sharp-data-exploration",
    color: "text-primary-500 group-hover:text-primary-600",
    action: () => {
      navigateTo(localePath("/dashboard/admin/analytics/users"));
    },
    loading: false,
  },
  {
    title: "Change color mode",
    icon: `ic:outline-${isDarkMode ? "light" : "dark"}-mode`,
    color: "text-secondary-500 group-hover:text-secondary-600",
    action: () => {
      toggleDarkMode();
    },
    loading: false,
  },
  {
    title: "Clear cache",
    icon: "ic:round-delete",
    color: "text-red-500 group-hover:text-red-600",
    action: async () => {
      await submit({
        async action() {
          await $fetch("/api/v1/invalidate-cache", {
            method: "POST",
          });
        },
        successMessage: "Cache has been cleared successfully",
      });
    },
    loading: false,
  },
]);

const updateMetric = async (metricKey: NumericMetricKey, period: any) => {
  await metricsStore.fetchMetrics(period);
};

const handleAction = async (action: any, index: number) => {
  if (typeof action.action === "function") {
    quickActions.value[index].loading = true;
    try {
      await action.action();
    } finally {
      quickActions.value[index].loading = false;
    }
  }
};

const events = ref([
  {
    status: "Ordered",
    date: "15/10/2020 10:30",
    icon: "pi pi-shopping-cart",
    color: "#9C27B0",
  },
  {
    status: "Processing",
    date: "15/10/2020 14:00",
    icon: "pi pi-cog",
    color: "#673AB7",
  },
  {
    status: "Shipped",
    date: "15/10/2020 16:15",
    icon: "pi pi-shopping-cart",
    color: "#FF9800",
  },
  {
    status: "Delivered",
    date: "16/10/2020 10:00",
    icon: "pi pi-check",
    color: "#607D8B",
  },
]);
</script>
