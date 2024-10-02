<template>
  <div>
    <div class="mb-3"></div>
    <BaseTable
      :items="newsletterStore.items"
      :loading="newsletterStore.loading"
      :totalRecords="newsletterStore.totalRecords"
      :totalQueryRecords="newsletterStore.totalQueryRecords"
      :currentPage="newsletterStore.currentPage"
      :rowsPerPage="newsletterStore.rowsPerPage"
      :setPage="newsletterStore.setPage"
      :setRowsPerPage="newsletterStore.setRowsPerPage"
      :fetchData="newsletterStore.fetchNewsletters"
      :fetchAllData="newsletterStore.fetchAllNewsletters"
      :globalFilterFields="['email', 'created_at']"
      :resetData="newsletterStore.resetNewsletters"
      :rows="20"
      :showAddButton="false"
      :showDeleteButton="false"
      :selectionMode="null"
      :lazy-threshold="50"
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
    </BaseTable>
  </div>
</template>

<script lang="ts" setup>
import { useNewsletterStore } from "@/core/stores/NewsletterStore";

const { formatDate } = useDate();
const newsletterStore = useNewsletterStore();
</script>
