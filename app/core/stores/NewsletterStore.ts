import type { PaginationParams, PaginatedResponse } from "~~/types/pagination";

export const useNewsletterStore = defineStore("newsletterStore", () => {
  const items = ref([]);
  const totalRecords = ref(0);
  const totalQueryRecords = ref(0);
  const loading = ref(false);
  const currentPage = ref(1);
  const rowsPerPage = ref(20);

  async function fetchNewsletters(params: PaginationParams = {}) {
    loading.value = true;
    try {
      const queryParams = {
        ...params,
        offset: ((currentPage.value - 1) * rowsPerPage.value).toString(),
        limit: rowsPerPage.value.toString(),
        force: params.force ? "true" : "false",
        filters: JSON.stringify(params.filters || {}),
        sortField: params.sortField,
        sortOrder: params.sortOrder,
      };

      const response = await $fetch<ApiResponse<PaginatedResponse>>(
        "/api/v1/newsletter",
        {
          method: "GET",
          query: queryParams,
        }
      );

      items.value = response.data?.data || [];
      totalRecords.value = response.data?.totalRecords || 0;
      totalQueryRecords.value = response.data?.totalQueryRecords || 0;
    } catch (error) {
      console.error("Error fetching newsletters:", error);
    } finally {
      loading.value = false;
    }
  }

  async function fetchAllNewsletters(params = {}) {
    loading.value = true;
    try {
      const response = await $fetch<ApiResponse<PaginatedResponse>>(
        "/api/v1/newsletter",
        {
          method: "GET",
          query: params,
        }
      );

      items.value = response.data?.data || [];
      totalRecords.value = response.data?.totalRecords || 0;
      totalQueryRecords.value = response.data?.totalQueryRecords || 0;
    } catch (error) {
      console.error("Error fetching all newsletters:", error);
    } finally {
      loading.value = false;
    }
  }

  function setPage(page: number) {
    currentPage.value = page;
  }

  function setRowsPerPage(rows: number) {
    rowsPerPage.value = rows;
  }

  return {
    items,
    totalRecords,
    totalQueryRecords,
    loading,
    currentPage,
    rowsPerPage,
    fetchNewsletters,
    fetchAllNewsletters,
    setPage,
    setRowsPerPage,
  };
});
