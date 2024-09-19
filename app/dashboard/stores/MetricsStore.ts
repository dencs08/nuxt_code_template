import { defineStore } from "pinia";
import { generatedColors } from "~~/app/core/assets/primevue/generated-colors";
import type { NumericMetricKey, MetricsData } from "~~/types/metrics";
export const useMetricsStore = defineStore("useMetricsStore", () => {
  const metricsLoaded = ref(false);
  const chartDataLoaded = ref(false);
  const metricsLoading = ref(true);
  const chartDataLoading = ref(true);

  const months = ref<string[]>([]);
  const datasets = ref<any[]>([]);

  const metrics = ref<Record<NumericMetricKey, number>>({
    newSignups: 0,
    newSignupsChange: 0,
    totalUsers: 0,
    totalUsersChange: 0,
    pageViews: 0,
    pageViewsChange: 0,
    uniqueVisitors: 0,
    uniqueVisitorsChange: 0,
  });

  async function fetchMetrics(period = "1d") {
    metricsLoading.value = true;
    metricsLoaded.value = false;
    try {
      // Specify the expected type for the API response
      const metricsData = await $fetch<
        | MetricsData
        | { statusCode: number; statusMessage: string; message: any }
      >("/api/v1/analytics", {
        method: "GET",
        params: { period },
      });

      // Check if the response matches the expected structure
      if (
        "newSignups" in metricsData &&
        "totalUsers" in metricsData &&
        "pageViews" in metricsData &&
        "uniqueVisitors" in metricsData
      ) {
        // Assign only if the response is of the correct type
        metrics.value = {
          newSignups: metricsData.newSignups,
          newSignupsChange: metricsData.newSignupsChange,
          totalUsers: metricsData.totalUsers,
          totalUsersChange: metricsData.totalUsersChange,
          pageViews: metricsData.pageViews,
          pageViewsChange: metricsData.pageViewsChange,
          uniqueVisitors: metricsData.uniqueVisitors,
          uniqueVisitorsChange: metricsData.uniqueVisitorsChange,
        };
        metricsLoaded.value = true;
      } else {
        console.error("Unexpected response structure:", metricsData);
      }
    } catch (error) {
      console.error("Error fetching metrics:", error);
      metricsLoaded.value = false;
    } finally {
      metricsLoading.value = false;
    }
  }

  async function fetchChartData(period = "1d") {
    chartDataLoading.value = true;
    chartDataLoaded.value = false;
    try {
      const response = await $fetch<{
        months: string[];
        signupsPerMonth: number[];
        pageViewsPerMonth: number[];
        uniqueVisitorsPerMonth: number[];
      }>("/api/v1/analytics/chart", {
        method: "GET",
        params: { period },
      });

      // Use type assertion or runtime checks to ensure the response has the expected shape
      if (response && "months" in response) {
        months.value = response.months || [];
        datasets.value = [
          {
            label: "User Signups",
            data: response.signupsPerMonth || [],
            backgroundColor: generatedColors["my.surface"]["250"],
          },
          {
            label: "Unique Visitors",
            data: response.uniqueVisitorsPerMonth || [],
            backgroundColor: generatedColors["my.surface"]["350"],
          },
          {
            label: "Page Views",
            data: response.pageViewsPerMonth || [],
            backgroundColor: generatedColors["my.surface"]["450"],
          },
        ];
        chartDataLoaded.value = true;
      } else {
        console.error("Unexpected response structure:", response);
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);
      chartDataLoaded.value = false;
    } finally {
      chartDataLoading.value = false;
    }
  }

  return {
    months,
    datasets,
    metrics,
    metricsLoading,
    chartDataLoading,
    metricsLoaded,
    chartDataLoaded,
    fetchMetrics,
    fetchChartData,
  };
});
