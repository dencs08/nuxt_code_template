import { defineStore } from "pinia";
import { ref } from "vue";
import type { PaginationParams, PaginatedResponse } from "~~/types/pagination";

export const useEventsStore = defineStore("events", () => {
  const events = ref<any[]>([]);
  const loading = ref(false);
  const totalRecords = ref(0);
  const totalQueryRecords = ref(0);

  async function fetchEvents(options: PaginationParams) {
    try {
      loading.value = true;
      const response = await $fetch<PaginatedResponse>("/api/v1/events", {
        params: options,
      });
      // Initialize the events array with the total number of records
      if (events.value.length === 0 || options.force) {
        totalRecords.value = response.data.totalRecords;
        events.value = Array.from({ length: totalRecords.value });
      }

      const start = options.offset || 0;
      // Populate the events array at the correct indices
      for (let i = 0; i < response.data.data.length; i++) {
        events.value[start + i] = response.data.data[i];
      }

      totalQueryRecords.value = response.data.totalQueryRecords;
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    } finally {
      loading.value = false;
    }
  }

  function resetEvents() {
    events.value = [];
    totalRecords.value = 0;
    totalQueryRecords.value = 0;
  }

  async function saveEvent(action: string, details: any = {}) {
    try {
      loading.value = true;
      const response = await $fetch("/api/v1/events", {
        method: "POST",
        body: { action, details },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to log action:", error);
    } finally {
      loading.value = false;
    }
  }

  return {
    events,
    loading,
    totalRecords,
    totalQueryRecords,
    fetchEvents,
    resetEvents,
    saveEvent,
  };
});
