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
            :value="metrics[stat.metricKey]"
            :change="metrics[stat.changeKey]"
            @period-change="updateMetric(stat.metricKey, $event)"
          />
        </div>
      </HorizontalScroller>
    </div>
    <div class="flex flex-col md:flex-row gap-2">
      <div class="w-full md:w-2/3 lg:w-3/4 md:overflow-y-auto space-y-2">
        <div>
          <div v-if="metricsLoading">Loading...</div>
          <div v-else>
            <Card class="custom-card">
              <template #content>
                <ChartCountries
                  title="Users"
                  :data="chartJsData"
                  type="bar"
                  xKey="country"
                  yKey="count"
                />
              </template>
            </Card>
          </div>
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
                  class="no-content p-5 custom-card"
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
                            class="h-6 w-auto transition-colors"
                            :class="action.color"
                          />
                          <p class="text-sm md:text-base">{{ action.title }}</p>
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
import { useRouter } from "vue-router";

definePageMeta({
  layout: "dashboard",
});

const userStore = useUserStore();
const user = userStore.getUser;
const localePath = useLocalePath();
const { hasAccess } = useRoleCheck();
const { addToast } = useToastService();
const isAdmin = hasAccess(75);
const router = useRouter();
const { isDarkMode, toggleDarkMode } = useDarkMode();

type NumericMetricKey =
  | "newSignups"
  | "newSignupsChange"
  | "totalUsers"
  | "totalUsersChange"
  | "pageViews"
  | "pageViewsChange"
  | "uniqueVisitors"
  | "uniqueVisitorsChange";

interface MetricsData {
  newSignups: number;
  newSignupsChange: number;
  totalUsers: number;
  totalUsersChange: number;
  pageViews: number;
  pageViewsChange: number;
  uniqueVisitors: number;
  uniqueVisitorsChange: number;
  chartData: any; // Replace 'any' with the appropriate type if possible
}

// Define the metrics object
const metrics = ref<
  Record<NumericMetricKey, number> & {
    chartData: { [key: string]: number };
  }
>({
  newSignups: 0,
  newSignupsChange: 0,
  totalUsers: 0,
  totalUsersChange: 0,
  pageViews: 0,
  pageViewsChange: 0,
  uniqueVisitors: 0,
  uniqueVisitorsChange: 0,
  chartData: {},
});

const metricsLoading = ref(true);

interface StatDisplayItem {
  title: string;
  metricKey: NumericMetricKey;
  changeKey: NumericMetricKey;
}

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
  metricsLoading.value = true;
  await fetchMetrics(period);
  metricsLoading.value = false;
};

const chartJsData = computed(() => {
  return Object.entries(metrics.value.chartData).map(([country, count]) => ({
    country,
    count,
  }));
});

const fetchMetrics = async (period = "1d") => {
  metricsLoading.value = true;
  try {
    // Use $fetch to call the API endpoint
    const metricsData = await $fetch<MetricsData>("/api/v1/analytics", {
      method: "GET",
      params: { period },
    });

    // Update metrics
    metrics.value = {
      newSignups: metricsData.newSignups,
      newSignupsChange: metricsData.newSignupsChange,
      totalUsers: metricsData.totalUsers,
      totalUsersChange: metricsData.totalUsersChange,
      pageViews: metricsData.pageViews,
      pageViewsChange: metricsData.pageViewsChange,
      uniqueVisitors: metricsData.uniqueVisitors,
      uniqueVisitorsChange: metricsData.uniqueVisitorsChange,
      chartData: metricsData.chartData,
    };
  } catch (error) {
    console.error("Error fetching metrics:", error);
  } finally {
    metricsLoading.value = false;
  }
};

onMounted(() => {
  fetchMetrics();
});

const cacheClear = async () => {
  try {
    const response = await $fetch("/api/v1/invalidate-cache", {
      method: "POST",
    });
    addToast("success", "Success", "Cache has been cleared successfully");
  } catch {
    addToast("error", "Error", "An error occurred while clearing cache");
  }
};

const quickActions = ref([
  {
    title: "View users",
    icon: "ic:round-person",
    color: "text-primary-500 hover:text-primary-700",
    action: () => router.push(localePath("/dashboard/admin/users")),
    loading: false,
  },
  {
    title: "Send emails",
    icon: "ic:round-mail",
    color: "text-secondary-500 hover:text-secondary-700",
    action: () => router.push(localePath("/dashboard/mail/templates")),
    loading: false,
  },
  {
    title: "Check analytics",
    icon: "ic:sharp-data-exploration",
    color: "text-primary-500 hover:text-primary-700",
    action: () => {
      console.log("Checking analytics...");
    },
    loading: false,
  },
  {
    title: "Change color mode",
    icon: `ic:outline-${isDarkMode ? "light" : "dark"}-mode`,
    color: "text-secondary-500 hover:text-secondary-700",
    action: () => {
      toggleDarkMode();
    },
    loading: false,
  },
  {
    title: "Clear cache",
    icon: "ic:round-delete",
    color: "text-red-500 hover:text-red-700",
    action: cacheClear,
    loading: false,
  },
]);

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
