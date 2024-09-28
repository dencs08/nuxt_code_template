export const useEvents = () => {
  const events = ref([]);
  const loading = ref(false);
  const fetchEvents = async (options: {
    limit?: number;
    offset?: number;
    sort?: string;
    order?: string;
    force?: boolean;
  }) => {
    try {
      loading.value = true;
      const response = await $fetch("/api/v1/events", {
        params: options,
      });
      events.value = response.data;
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    } finally {
      loading.value = false;
    }
  };

  const saveEvent = async (action: string, details: any = {}) => {
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
  };

  return {
    events,
    loading,
    saveEvent,
    fetchEvents,
  };
};
