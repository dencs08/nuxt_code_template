<template>
  <DataTable
    ref="dt"
    :value="items"
    v-model:selection="selected"
    v-model:editingRows="editingRows"
    v-model:filters="filters"
    dataKey="id"
    tableStyle="min-width: 50rem;"
    editMode="row"
    @row-edit-save="onRowEditSave"
    :rows="rows"
    :globalFilterFields="globalFilterFields"
    size="small"
  >
    <template #header>
      <div class="flex justify-between items-center">
        <div
          v-auto-animate
          v-if="hasAccess"
          class="flex gap-2 w-full items-center"
        >
          <UserCreator />
          <Button
            size="small"
            label="Delete"
            severity="danger"
            @click=""
            :disabled="!selected || !selected.length"
            v-if="selected"
          />
          <Button
            size="small"
            v-tooltip.top="'Save changes'"
            @click=""
            icon="pi pi-save"
            class="!p-2"
            :disabled="!changesMade"
            v-if="changesMade"
          />
        </div>
        <div
          class="flex justify-between gap-3"
          :class="!hasAccess ? 'w-full' : ''"
        >
          <span class="relative">
            <i
              class="pi pi-search absolute top-2/4 -mt-2 left-3 text-surface-400 dark:text-surface-600"
            />
            <InputText
              v-model="filters['global'].value"
              placeholder="Keyword Search"
              class="pl-10 font-normal"
            />
          </span>
          <div class="grid place-content-center">
            <Button
              size="small"
              class="pi pi-external-link text-surface-700 dark:text-surface-100"
              v-tooltip.left="'Export table to CSV'"
              @click="exportCSV()"
            />
          </div>
          <div class="grid place-content-center">
            <Button
              size="small"
              v-tooltip.left="'Refresh table'"
              @click=""
              class="pi pi-refresh text-surface-700 dark:text-surface-100"
            />
          </div>
        </div>
      </div>
    </template>

    <Column
      v-if="selectable"
      :selectionMode="selectable"
      headerStyle="width: 3rem"
    ></Column>

    <Column
      v-for="column in columns"
      :key="column.field"
      :header="column.header"
      v-bind="column.props"
      :sortable="column.sortable"
    >
      <!-- Body Slot -->
      <template v-if="$slots['body-' + column.field]" #body="slotProps">
        <slot :name="'body-' + column.field" v-bind="slotProps"></slot>
      </template>
      <template v-else #body="{ data }">
        <span>{{ data[column.field] }}</span>
      </template>

      <!-- Editor Slot -->
      <template v-if="$slots['editor-' + column.field]" #editor="slotProps">
        <slot :name="'editor-' + column.field" v-bind="slotProps"></slot>
      </template>
      <template v-else-if="column.editor" #editor="{ data }">
        <InputText v-model="data[column.field]" />
      </template>
    </Column>

    <Column
      v-if="editable"
      :rowEditor="true"
      style="width: 10%; min-width: 6rem"
      bodyStyle="text-align:center"
    >
    </Column>
  </DataTable>
</template>

<script setup lang="ts">
import { FilterMatchMode } from "@primevue/core/api";

const { hasAccess } = useRoleCheck(75);

interface TableColumn {
  field: string;
  header: string;
  props?: Record<string, any>;
  editor?: boolean;
  body?: boolean;
  sortable?: boolean;
}

const props = defineProps({
  items: Array as PropType<any[]>,
  columns: Array as PropType<TableColumn[]>,
  loading: Boolean,
  editable: Boolean,
  selectable: String as PropType<"single" | "multiple">,
  dataKey: {
    type: String,
    default: "id",
  },
  rows: {
    type: Number,
    default: 10,
  },
  globalFilterFields: Array as PropType<string[]>,
});

const emit = defineEmits(["row-edit-save", "save-changes"]);

const changesMade = ref(false);
const selected = ref([]);
const editingRows = ref([]);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const originalItems = ref([] as any[]);
const dt = ref();

watch(
  props.items,
  (newValue) => {
    originalItems.value = JSON.parse(JSON.stringify(newValue));
  },
  { deep: true }
);

const changes = computed(() => {
  return props.items
    .map((item, index) => {
      const originalItem = originalItems.value[index];
      const changedValues = Object.entries(item)
        .filter(([key, value]) => originalItem[key] !== value)
        .map(([key, value]) => ({
          key,
          oldValue: originalItem[key],
          newValue: value,
        }))
        .filter((change) => change !== undefined);
      return { ...item, changes: changedValues };
    })
    .filter((item) => item.changes.length > 0);
});

const onRowEditSave = (event: any) => {
  changesMade.value = true;
  emit("row-edit-save", event);
};

// const { confirmAction } = useConfirmation();
// const confirmDeleteUsers = (event) => {
//     confirmAction(async () => {
//         const selectedIds = selected.value.map(user => user.id);
//         await handleSubmit(userStore.deleteUsers, selectedIds, 'Users deleted');
//         selected.value = [];
//     },
//         { message: 'Delete this record(s)?', target: event.currentTarget, severity: 'danger', showToastOnAccept: false, showToastOnReject: false });
// };

// const confirmSaveChanges = () => {
//   confirmAction(
//     async () => {
//       emit("save-changes", { changes: changes.value });
//     },
//     {
//       message: JSON.stringify(changes.value),
//       header: "Do you want to save these changes?",
//       severity: "info",
//       showToastOnAccept: true,
//       showToastOnReject: false,
//     },
//     ConfirmationGroup.Changes
//   );
// };

const exportCSV = () => {
  dt.value.exportCSV();
};
</script>
