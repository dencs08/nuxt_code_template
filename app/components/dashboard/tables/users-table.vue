<template>
  <DataTable
    ref="dt"
    :value="usersStore?.users"
    v-model:selection="selected"
    v-model:editingRows="editingRows"
    :loading="usersStore?.loading"
    v-model:filters="filters"
    dataKey="id"
    tableStyle="min-width: 50rem;"
    editMode="row"
    @row-edit-save="onRowEditSave"
    :rows="10"
    :globalFilterFields="['name', 'email', 'phone', 'role']"
    size="small"
    removableSort
    stripedRows
    paginator
  >
    <template #header>
      <div class="flex justify-between items-center">
        <div
          v-auto-animate
          v-if="isAdmin"
          class="flex gap-2 w-full items-center"
        >
          <UserCreator />
          <Button
            size="small"
            label="Delete"
            severity="danger"
            @click="confirmDeleteUsers"
            :disabled="!selected || !selected.length"
            v-if="selected"
          />
          <Button
            size="small"
            v-tooltip.top="'Save changes'"
            @click="confirmSaveChanges"
            icon="pi pi-save"
            class="!p-2"
            :disabled="!changesMade"
            v-if="changesMade"
          />
        </div>
        <div
          class="flex justify-between gap-3"
          :class="!isAdmin ? 'w-full' : ''"
        >
          <IconField class="w-full font-normal">
            <InputIcon class="pi pi-search" />
            <InputText
              v-model="filters['global'].value"
              placeholder="Search"
              class="w-full"
            />
          </IconField>
          <div class="grid place-content-center">
            <Button
              size="small"
              icon="pi pi-external-link "
              v-tooltip.left="'Export table to CSV'"
              @click="exportCSV($event)"
              aria-label="Export"
            />
          </div>
          <div class="grid place-content-center">
            <Button
              size="small"
              v-tooltip.left="'Refresh users table'"
              @click="fetchUsers"
              icon="pi pi-refresh"
              aria-label="Refresh"
            />
          </div>
        </div>
      </div>
    </template>

    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
    <Column field="name" header="Name" :sortable="true" style="width: 17.5%">
      <template #editor="{ data, field }">
        <InputText size="small" v-model="data[field]" />
      </template>
    </Column>
    <Column field="email" header="Email" :sortable="true" style="width: 27.5%">
      <template #editor="{ data, field }">
        <InputText size="small" v-model="data[field]" />
      </template>
    </Column>
    <Column field="phone" header="Phone" :sortable="true" style="width: 15%">
      <template #editor="{ data, field }">
        <InputText size="small" v-model="data[field]" />
      </template>
    </Column>
    <Column
      field="created_at"
      header="Created at"
      :sortable="true"
      style="width: 25%"
    >
      <template #body="{ data }">
        <span class="overflow-hidden text-ellipsis whitespace-nowrap">{{
          formatDate(data.created_at)
        }}</span>
      </template>
    </Column>
    <Column field="role" header="Role" :sortable="true" style="width: 15%">
      <template #body="{ data }">
        <Tag
          v-if="data?.role"
          :value="data?.role"
          :severity="getRoleSeverity(data?.role)"
        />
      </template>
      <template #editor="{ data, field }">
        <RoleDropdown v-model="data[field]" />
      </template>
    </Column>
    <Column
      :rowEditor="true"
      style="width: 5%; min-width: 1rem"
      bodyStyle="text-align:center"
    ></Column>
    <Column style="width: 5%; min-width: 1rem" bodyStyle="text-align:center;">
      <template #body="slotProps">
        <div class="flex flex-row gap-1">
          <div>
            <Button
              icon="pi pi-cog"
              rounded
              text
              aria-label="Permissions"
              @click="selectPermissions(slotProps.data)"
            />
          </div>
          <div>
            <NuxtLink
              :to="localePath(`/dashboard/admin/users/${slotProps.data.id}`)"
              class="font-medium text-primary-500 hover:text-primary-600"
            >
              <Button icon="pi pi-arrow-right" rounded text aria-label="Open" />
            </NuxtLink>
          </div>
        </div>
      </template>
    </Column>
  </DataTable>
</template>

<script setup>
import { FilterMatchMode } from "@primevue/core/api";
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const { handleSubmit } = useSubmit();
const { getRoleSeverity } = useRoles();
const { hasAccess } = useRoleCheck();
const localePath = useLocalePath();

const isAdmin = hasAccess("admin");
const usersStore = useUsersStore();

const dt = ref();
const editingRows = ref([]);
const selected = ref();
const changesMade = ref(false);
let originalUsers = ref([]);

const emit = defineEmits(["showPermissions"]);

const selectPermissions = (user) => {
  emit("showPermissions", user);
};

onMounted(() => {
  fetchUsers();
});

const onRowEditSave = async (event) => {
  let { newData, index } = event;
  usersStore.updateLocalUsers(index, newData);
  changesMade.value = true;
};

const fetchUsers = async () => {
  await handleSubmit(usersStore.fetchUsers, {}, "Users fetched");
  originalUsers.value = JSON.parse(JSON.stringify(usersStore.users));
  changesMade.value = false;
};

const updateUsers = async () => {
  const changedUsers = changes.value;
  for (let i = 0; i < changedUsers.length; i++) {
    const { userName, email, changes: userChanges } = changedUsers[i];
    const userIndex = usersStore.users.findIndex(
      (user) => user.name === userName && user.email === email
    );
    if (userIndex !== -1) {
      const user = usersStore.users[userIndex];
      let roleChanged = false;
      let otherChanged = false;
      for (let j = 0; j < userChanges.length; j++) {
        const { key, newValue } = userChanges[j];
        user[key] = newValue;
        if (key === "role") {
          roleChanged = true;
        } else {
          otherChanged = true;
        }
      }
      if (otherChanged) {
        await usersStore.updateUser(userIndex, user);
      }
      if (roleChanged) {
        await usersStore.updateRole(userIndex, user);
      }
    }
  }
  changesMade.value = false;
  originalUsers.value = JSON.parse(JSON.stringify(usersStore.users));
};

const changes = computed(() => {
  return usersStore.users
    .map((user, index) => {
      const originalUser = originalUsers.value[index];
      const changedValues = Object.entries(user)
        .filter(([key, value]) => originalUser[key] !== value)
        .map(([key, value]) => ({
          key,
          oldValue: originalUser[key],
          newValue: value,
        }))
        .filter(Boolean);
      return { userName: user.name, email: user.email, changes: changedValues };
    })
    .filter((user) => user.changes.length > 0);
});

const { confirmAction } = useConfirmation();
const confirmDeleteUsers = (event) => {
  confirmAction(
    async () => {
      const selectedIds = selected.value.map((user) => user.id);
      await handleSubmit(usersStore.deleteUsers, selectedIds, "Users deleted");
      selected.value = [];
    },
    {
      message: "Delete this record(s)?",
      target: event.currentTarget,
      severity: "danger",
      showToastOnAccept: false,
      showToastOnReject: false,
    }
  );
};

const confirmSaveChanges = () => {
  confirmAction(
    async () => {
      await updateUsers();
    },
    {
      message: changes,
      header: "Do you want to save these changes?",
      severity: "info",
      showToastOnAccept: true,
      showToastOnReject: false,
    },
    "changes"
  );
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

const exportCSV = () => {
  dt.value.exportCSV();
};
</script>
