<template>
  <DataTable
    ref="dt"
    :value="items"
    v-model:selection="selected"
    v-model:editingRows="editingRows"
    :loading="loading"
    v-model:filters="filters"
    dataKey="id"
    :tableStyle="tableStyle"
    :editMode="editMode"
    @row-edit-save="onRowEditSave"
    :rows="rowsPerPage"
    :totalRecords="totalQueryRecords"
    :globalFilterFields="globalFilterFields"
    :size="size"
    removableSort
    stripedRows
    paginator
    :lazy="isLazy"
    @page="onPage"
    @sort="onSort"
    :rowsPerPageOptions="[5, 10, 20, 50]"
    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
    currentPageReportTemplate="{first} to {last} of {totalRecords}"
  >
    <template #header>
      <div class="flex justify-between items-center">
        <div
          v-auto-animate
          v-if="showToolbar"
          class="flex gap-2 w-full items-center"
        >
          <slot name="toolbar-start"></slot>
          <Button
            v-if="showAddButton"
            size="small"
            icon="pi pi-plus"
            :label="addButtonLabel"
            severity="contrast"
            @click="$emit('add')"
          />
          <Button
            v-if="showDeleteButton && selected.length > 0"
            size="small"
            label="Delete"
            severity="danger"
            @click="confirmDelete($event, selected)"
            :disabled="!selected || !selected.length"
          />
          <slot name="toolbar-middle"></slot>
          <Button
            v-if="showSaveButton && changesMade"
            size="small"
            v-tooltip.top="'Save changes'"
            @click="confirmSaveChanges"
            icon="pi pi-save"
            :disabled="!changesMade"
          />
          <slot name="toolbar-end"></slot>
        </div>
        <div
          class="flex justify-between gap-1.5"
          :class="{ 'w-full': !showToolbar }"
        >
          <IconField class="w-full font-normal">
            <InputIcon class="pi pi-search" />
            <InputText
              v-model="filters['global'].value"
              placeholder="Search"
              class="w-full"
              size="small"
            />
          </IconField>
          <div class="grid place-content-center">
            <Button
              size="small"
              icon="pi pi-external-link"
              v-tooltip.left="'Export table to CSV'"
              @click="exportCSV"
              aria-label="Export"
              severity="contrast"
              icon-class="dark:text-dark-800"
            />
          </div>
          <div class="grid place-content-center">
            <Button
              size="small"
              v-tooltip.left="'Refresh table'"
              @click="refreshTable"
              icon="pi pi-refresh"
              aria-label="Refresh"
              icon-class="dark:text-dark-800"
            />
          </div>
        </div>
      </div>
    </template>

    <Column
      v-if="selectionMode"
      :selectionMode="selectionMode"
      headerStyle="width: 3rem"
    ></Column>

    <slot></slot>

    <Column
      v-if="editMode === 'row'"
      :rowEditor="true"
      style="width: 5%; min-width: 1rem"
      bodyStyle="text-align:center"
    ></Column>
  </DataTable>

  <Dialog :visible="confirmDialogVisible" :header="confirmDialogHeader">
    <component
      :is="confirmDialogComponent"
      :changes="changes"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
  </Dialog>
</template>

<script setup lang="ts">
import { FilterMatchMode } from "@primevue/core/api";
import DisplayItemChanges from "~/dashboard/components/dashboard/display-item-changes.vue";
import { computed, ref, onMounted, watch } from "vue";
import { useDebounceFn } from "@vueuse/core";
import type { PaginationParams, Filters } from "~~/types/pagination";

const { confirmAction } = useConfirmAction();

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  totalRecords: {
    type: Number,
    required: true,
  },
  totalQueryRecords: {
    type: Number,
    required: true,
  },
  currentPage: {
    type: Number,
    required: true,
  },
  rowsPerPage: {
    type: Number,
    required: true,
  },
  setPage: {
    type: Function,
    required: true,
  },
  setRowsPerPage: {
    type: Function,
    required: true,
  },
  fetchData: {
    type: Function,
    required: true,
  },
  fetchAllData: {
    type: Function,
    required: true,
  },
  resetData: {
    type: Function,
    required: true,
  },
  globalFilterFields: {
    type: Array as PropType<string[]>,
    required: true,
  },
  tableStyle: {
    type: String,
    default: "min-width: 50rem;",
  },
  editMode: {
    type: String as PropType<"row" | "cell" | null>,
    default: "null",
  },
  rows: {
    type: Number,
    default: 10,
  },
  size: {
    type: String as PropType<"small" | "large">,
    default: "small",
  },
  showToolbar: {
    type: Boolean,
    default: true,
  },
  showAddButton: {
    type: Boolean,
    default: true,
  },
  addButtonLabel: {
    type: String,
    default: "",
  },
  showDeleteButton: {
    type: Boolean,
    default: true,
  },
  showSaveButton: {
    type: Boolean,
    default: true,
  },
  selectionMode: {
    type: String as PropType<"multiple" | "single" | null>,
    default: "multiple",
  },
  confirmDialogComponent: {
    type: Object,
    default: () => markRaw(DisplayItemChanges),
  },
  handleConfirm: {
    type: Function,
    default: null,
  },
  handleCancel: {
    type: Function,
    default: null,
  },
  lazyThreshold: {
    type: Number,
    default: 100,
  },
  displayChangeNameField: {
    type: String,
    default: "name",
  },
});

const emit = defineEmits([
  "add",
  "delete",
  "save",
  "refresh",
  "row-edit-save",
  "confirm",
  "cancel",
  "update:selection", // Add this new emit
]);

const dt = ref(null);
const editingRows = ref([]);
const selected = ref([]);
const sortField = ref(null);
const sortOrder = ref(null);
const originalItems = ref([]);
const changesMade = ref(false);

const confirmDialogVisible = ref(false);
const confirmDialogHeader = ref("");
const changes = ref([]);

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const cachedPages = ref(new Map());
const localCurrentPage = ref(1);
const localItems = ref(props.items || []);

const items = computed(() => localItems.value);

const loading = computed(() => props.loading);
const totalRecords = computed(() => props.totalRecords);
const totalQueryRecords = computed(() => props.totalQueryRecords);
const currentPage = computed(() => props.currentPage);
const rowsPerPage = computed(() => props.rowsPerPage);
const previousRowsPerPage = ref(props.rows);

const isLazy = computed(() => totalRecords.value > props.lazyThreshold);

const computeChanges = () => {
  return items.value
    .map((item, index) => {
      const originalItem = originalItems.value[index];
      if (!originalItem) return null;
      console.log(originalItem);

      const changedValues = Object.entries(item)
        .filter(
          ([key, value]) =>
            JSON.stringify(originalItem[key]) !== JSON.stringify(value)
        )
        .map(([key, value]) => ({
          key,
          oldValue: originalItem[key],
          newValue: value,
        }))
        .filter(Boolean);

      return changedValues.length > 0
        ? {
            itemIndex: index,
            itemId: item.id,
            displayName:
              originalItem[props.displayChangeNameField] || `Item ${index + 1}`,
            changes: changedValues,
          }
        : null;
    })
    .filter(Boolean);
};

const invalidateCache = () => {
  cachedPages.value.clear();
  localCurrentPage.value = 1;
  props.setPage(1);
  localItems.value = [];
};

const onRowEditSave = (event: any) => {
  let { newData, index } = event;
  changesMade.value = true;
  items.value[index] = { ...items.value[index], ...newData };
};

const debouncedFilterUpdate = useDebounceFn(() => {
  if (!isLazy.value) return;
  refreshTable();
}, 750);

const onSort = async (event: any) => {
  if (!isLazy.value) return;
  sortField.value = event.sortField;
  sortOrder.value = event.sortOrder === 1 ? "asc" : "desc";
  invalidateCache();
  await loadData();
};

const onPage = async (event: any) => {
  if (!isLazy.value) return;

  if (rowsPerPage.value !== event.rows) {
    previousRowsPerPage.value = rowsPerPage.value;
    props.setRowsPerPage(event.rows);
    props.setPage(1);
    localCurrentPage.value = 1;
    invalidateCache();
  } else {
    localCurrentPage.value = event.page + 1;
    props.setPage(event.page + 1);
  }

  await loadData();
};

const loadData = async (force = false) => {
  if (!isLazy.value) {
    await props.fetchAllData(true);
    return;
  }

  const pageKey = `${localCurrentPage.value}-${rowsPerPage.value}`;
  if (!force && cachedPages.value.has(pageKey)) {
    localItems.value = cachedPages.value.get(pageKey);
    return;
  }

  const params: PaginationParams = {
    offset: (localCurrentPage.value - 1) * rowsPerPage.value,
    limit: rowsPerPage.value,
    filters: filters.value as Filters,
    sortField: sortField.value,
    sortOrder: sortOrder.value,
    force: force,
  };
  await props.fetchData(params);
  localItems.value = props.items;
  cachedPages.value.set(pageKey, [...localItems.value]);
};

const refreshTable = async () => {
  if (isLazy.value) {
    props.resetData();
    props.setPage(1);
    invalidateCache();
  }
  await loadData(true);
};

const exportCSV = async () => {
  if (isLazy.value) {
    await props.fetchAllData();
  }
  dt.value.exportCSV({ selectionOnly: false });
};

const showConfirmDialog = (header: string, changesData: any) => {
  confirmDialogHeader.value = header;
  changes.value = changesData;
  confirmDialogVisible.value = true;
};

const handleConfirm = () => {
  if (props.handleConfirm) {
    props.handleConfirm();
  } else {
    emit("confirm", changes.value);
  }
  confirmDialogVisible.value = false;
};

const handleCancel = () => {
  if (props.handleCancel) {
    props.handleCancel();
  } else {
    emit("cancel");
  }
  confirmDialogVisible.value = false;
};

const confirmSaveChanges = () => {
  const computedChanges = computeChanges();
  confirmAction({
    message: computedChanges,
    header: "Do you want to save these changes?",
    showToastOnAccept: true,
    showToastOnReject: false,
    showMessage: false,
    component: markRaw(DisplayItemChanges),
    accept: () => {
      emit("save", computedChanges);
      changesMade.value = false;
      loadData(true);
    },
    reject: () => {},
  });
};

const confirmDelete = (event: any, selectedItems: any) => {
  if (!event || !selectedItems || selectedItems.length === 0) return;
  confirmAction({
    target: event.target,
    message: "Are you sure you want to delete?",
    icon: "pi pi-exclamation-triangle",
    acceptLabel: "Delete",
    rejectLabel: "Cancel",
    severity: "danger",
    accept: () => {
      emit("delete", selectedItems);
      // Emit an event to clear selection instead of modifying it directly
      emit("update:selection", []);
    },
    reject: () => {},
  });
};

onMounted(async () => {
  if (items.value.length === 0) {
    await loadData(true);
  }
});

watch(
  () => filters.value.global.value,
  () => {
    debouncedFilterUpdate();
  }
);

watch(rowsPerPage, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    if (!isLazy.value) return;
    refreshTable();
    invalidateCache();
  }
});

watch(
  () => props.items,
  (newItems) => {
    localItems.value = newItems;
  },
  { deep: true }
);

watch(
  () => items.value,
  (newItems) => {
    originalItems.value = JSON.parse(JSON.stringify(newItems));
  },
  { immediate: true }
);
</script>
