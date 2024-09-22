<template>
  <div>
    <div class="mb-3">
      <div class="flex flex-row items-center justify-between">
        <h3 class="text-lg font-bold">Newsletter subscribers</h3>
        <div class="flex flex-row gap-2">
          <Button
            size="small"
            icon="pi pi-external-link"
            v-tooltip.left="'Export table to CSV'"
            aria-label="Export"
            severity="contrast"
            icon-class="dark:text-dark-800"
          />
          <Button
            size="small"
            v-tooltip.left="'Refresh table'"
            @click="getNewsletter"
            icon="pi pi-refresh"
            aria-label="Refresh"
            icon-class="dark:text-dark-800"
          />
        </div>
      </div>
    </div>
    <DataTable
      :value="records"
      tableStyle="min-width: 50rem"
      :loading="loading"
      ref="dt"
      :rows="10"
      stripedRows
      paginator
    >
      <Column field="email" :sortable="true" header="Email"></Column>
      <Column
        field="created_at"
        header="Date Subscribed"
        :sortable="true"
        style="width: 25%"
      >
        <template #body="{ data }">
          <span class="overflow-hidden text-ellipsis whitespace-nowrap">{{
            formatDate(data.created_at, { includeTime: true })
          }}</span>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
});

const dt = ref(null);
const records = ref([]);
const loading = ref(false);

onMounted(() => {
  getNewsletter();
});
const { formatDate } = useDate();
const getNewsletter = async (force: boolean = false) => {
  loading.value = true;
  try {
    const query = force ? "?force=true" : "";
    const response = await $fetch(`/api/v1/newsletter${query}`, {
      method: "GET",
    });
    records.value = response.data;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

const exportCSV = () => {
  dt.value.exportCSV();
};
</script>
