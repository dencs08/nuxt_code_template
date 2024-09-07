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
            label="Invite"
            severity="contrast"
            @click="inviteUser"
          />
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
          class="flex justify-between gap-1.5"
          :class="!isAdmin ? 'w-full' : ''"
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
              @click="exportCSV($event)"
              aria-label="Export"
              severity="contrast"
              icon-class="dark:text-dark-800"
            />
          </div>
          <div class="grid place-content-center">
            <Button
              size="small"
              v-tooltip.left="'Refresh users table'"
              @click="fetchUsers"
              icon="pi pi-refresh"
              aria-label="Refresh"
              icon-class="dark:text-dark-800"
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
          formatDate(data.created_at, { includeTime: true })
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
          <div v-if="isSuperAdmin">
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
import DisplayUserChanges from "@/components/dashboard/display-user-changes.vue";
import InviteUsers from "~~/app/dashboard/components/dashboard/invite-users.vue";
import { FilterMatchMode } from "@primevue/core/api";
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const { handleSubmit } = useSubmit();
const { getRoleSeverity } = useRolesStore();
const { hasAccess } = useRoleCheck();
const { confirmAction } = useConfirmAction();
const localePath = useLocalePath();
const { formatDate } = useDate();

const isAdmin = hasAccess(75);
const isSuperAdmin = hasAccess(100);
const usersStore = useUsersStore();
const rolesStore = useRolesStore();
const { roles } = storeToRefs(rolesStore);

const dt = ref();
const editingRows = ref([]);
const selected = ref();
const changesMade = ref(false);
let originalUsers = ref([]);
const { users } = storeToRefs(usersStore);

const emit = defineEmits(["showPermissions"]);

const selectPermissions = (user) => {
  emit("showPermissions", user);
};

onMounted(() => {
  fetchUsers();
  console.log(usersStore.users);
});

const onRowEditSave = async (event) => {
  let { newData, index } = event;
  usersStore.updateLocalUsers(index, newData);
  changesMade.value = true;
};

const fetchUsers = async () => {
  await handleSubmit(usersStore.fetchUsers, {}, "Users fetched");
  originalUsers.value = JSON.parse(JSON.stringify(users.value));
  changesMade.value = false;
};

const changes = computed(() => {
  return users.value
    .map((user, index) => {
      const originalUser = originalUsers.value[index];
      const changedValues = Object.entries(user)
        .filter(([key, value]) => {
          if (key === "role" || key === "role_data") {
            // Compare role and role_data separately
            return JSON.stringify(originalUser[key]) !== JSON.stringify(value);
          }
          return JSON.stringify(originalUser[key]) !== JSON.stringify(value);
        })
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

const updateUsers = async () => {
  const changedUsers = changes.value;
  for (let i = 0; i < changedUsers.length; i++) {
    const { userName, email, changes: userChanges } = changedUsers[i];
    const userIndex = users.value.findIndex(
      (user) => user.name === userName && user.email === email
    );
    if (userIndex !== -1) {
      const user = users.value[userIndex];
      let roleChanged = false;
      let otherChanged = false;
      for (let j = 0; j < userChanges.length; j++) {
        const { key, newValue } = userChanges[j];
        if (key === "role" || key === "role_data") {
          user[key] = newValue;
          roleChanged = true;
        } else {
          user[key] = newValue;
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
  originalUsers.value = JSON.parse(JSON.stringify(users.value));
};

const confirmDeleteUsers = (event) => {
  confirmAction({
    target: event.currentTarget,
    message: "Are you sure you want to delete?",
    icon: "pi pi-exclamation-triangle",
    acceptLabel: "Delete",
    rejectLabel: "Cancel",
    severity: "danger",
    accept: async () => {
      const selectedIds = selected.value.map((user) => user.id);
      await handleSubmit(usersStore.deleteUsers, selectedIds, "Users deleted");
      selected.value = [];
    },
    reject: () => {},
  });
};

const confirmSaveChanges = () => {
  confirmAction({
    message: changes,
    header: "Do you want to save these changes?",
    severity: "info",
    showToastOnAccept: true,
    showToastOnReject: false,
    showMessage: false,
    component: markRaw(DisplayUserChanges),
    accept: async () => {
      await updateUsers();
    },
  });
};

const inviteUser = () => {
  confirmAction({
    header: "Who do you want to invite?",
    icon: "pi pi-user",
    severity: "contrast",
    acceptLabel: "Save",
    rejectLabel: "Close",
    showToastOnAccept: false,
    showToastOnReject: false,
    showMessage: false,
    component: markRaw(InviteUsers),
    accept: async () => {
      await fetchUsers();
    },
  });
};

const exportCSV = () => {
  dt.value.exportCSV();
};
</script>
