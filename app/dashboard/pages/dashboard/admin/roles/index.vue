<template>
  <div>
    <div v-if="rolesStore.error">{{ rolesStore.error }}</div>
    <div v-else>
      <DataTable
        ref="dt"
        :value="rolesStore.roles"
        :loading="showLoading"
        dataKey="id"
        tableStyle="min-width: 50rem;"
        editMode="row"
        :rows="10"
        paginator
        size="small"
        stripedRows
      >
        <!-- @row-edit-save="updateRole" -->
        <!-- v-model:editingRows="editingRows" -->
        <template #header>
          <div class="flex flex-row justify-between items-center">
            <div class="flex justify-between items-center">
              <h1 class="text-lg font-bold">Roles</h1>
            </div>
            <div class="flex flex-row gap-1">
              <Button
                size="small"
                icon="pi pi-external-link "
                v-tooltip.left="'Export table to CSV'"
                @click="exportCSV()"
                aria-label="Export"
              />
              <Button
                size="small"
                v-tooltip.left="'Refresh users table'"
                @click="fetchRoles"
                icon="pi pi-refresh"
                aria-label="Refresh"
              />
            </div>
          </div>
        </template>

        <Column
          field="name"
          header="Role name"
          :sortable="true"
          style="width: 15%"
        >
          <template #body="{ data }">
            {{ data.name }}
          </template>
          <template #editor="{ data, field }">
            <InputText size="small" v-model="data[field]" />
          </template>
        </Column>
        <Column
          field="access_level"
          header="Access Level"
          :sortable="true"
          style="width: 40%"
        >
          <template #body="{ data }">
            {{ data.access_level }}
          </template>
          <template #editor="{ data, field }">
            <InputNumber size="small" v-model="data[field]" :min="0" />
          </template>
        </Column>
        <!-- <Column
          :rowEditor="true"
          style="width: 5%; min-width: 1rem"
          bodyStyle="text-align:center"
        ></Column> -->
      </DataTable>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "dashboard",
});
const rolesStore = useRolesStore();
const { submit, error } = useForm();
const editingRows = ref([]);
const showLoading = ref(false);
const loadingTimeout = ref(null);
const dt = ref();

onMounted(async () => {
  rolesStore.fetchRoles();
});

async function updateRole(role: any) {
  try {
    await rolesStore.updateRole(role.id, role.access_level);
  } catch (error) {
    console.error("Error updating role:", error);
  }
}

const fetchRoles = async () => {
  await submit({
    action() {
      return rolesStore.fetchRoles(true);
    },
  });
};

const exportCSV = () => {
  dt.value.exportCSV();
};

watch(
  () => rolesStore.loading,
  (newLoadingState) => {
    if (newLoadingState) {
      loadingTimeout.value = setTimeout(() => {
        showLoading.value = true;
      }, 200);
    } else {
      if (loadingTimeout.value) {
        clearTimeout(loadingTimeout.value);
      }
      showLoading.value = false;
    }
  }
);
</script>
