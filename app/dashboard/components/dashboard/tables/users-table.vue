<template>
  <BaseTable
    :items="usersStore?.users"
    :loading="usersStore.loading"
    :totalRecords="usersStore.totalRecords"
    :totalQueryRecords="usersStore.totalQueryRecords"
    :currentPage="usersStore.currentPage"
    :rowsPerPage="usersStore.rowsPerPage"
    :setPage="usersStore.setPage"
    :setRowsPerPage="usersStore.setRowsPerPage"
    :fetchData="usersStore.fetchUsers"
    :fetchAllData="usersStore.fetchAllUsers"
    :resetData="usersStore.resetUsers"
    :rows="10"
    :lazy-threshold="10"
    :globalFilterFields="['name', 'email', 'phone', 'role', 'nickname', 'id']"
    :editMode="'row'"
    @add="showUserCreator"
    @save="handleSaveChanges"
    @delete="handleDeleteItems"
    @refresh="usersStore.fetchUsers({ force: true })"
    @update:selection="handleSelectionUpdate"
    v-model:selection="selectedUsers"
    displayChangeNameField="email"
  >
    <!-- Remove UserCreator from toolbar-start -->
    <template #toolbar-middle>
      <Button
        size="small"
        label="Invite"
        severity="contrast"
        @click="inviteUser"
      />
    </template>

    <Column field="name" header="Name" :sortable="false" style="width: 17.5%">
      <template #editor="{ data, field }">
        <InputText size="small" v-model="data[field]" />
      </template>
    </Column>
    <Column field="email" header="Email" :sortable="false" style="width: 27.5%">
      <template #editor="{ data, field }">
        <InputText size="small" v-model="data[field]" />
      </template>
    </Column>
    <Column
      field="nickname"
      header="Nickname"
      :sortable="false"
      class="overflow-hidden text-ellipsis whitespace-nowrap"
      style="width: 5%"
    >
      <template #editor="{ data, field }">
        <InputText size="small" v-model="data[field]" />
      </template>
    </Column>
    <Column field="phone" header="Phone" :sortable="false" style="width: 15%">
      <template #editor="{ data, field }">
        <InputText size="small" v-model="data[field]" />
      </template>
    </Column>
    <Column
      field="created_at"
      header="Created at"
      :sortable="false"
      style="width: 25%"
    >
      <template #body="{ data }">
        <span class="overflow-hidden text-ellipsis whitespace-nowrap">
          {{ formatDate(data.created_at, { includeTime: true }) }}
        </span>
      </template>
    </Column>
    <Column field="role" header="Role" :sortable="false" style="width: 15%">
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
  </BaseTable>

  <UserCreator
    v-model:visible="userCreatorVisible"
    @userCreated="onUserCreated"
  />
</template>

<script setup>
import BaseTable from "./base-table.vue";
import UserCreator from "@/components/dashboard/admin/user-creator.vue";
import InviteUsers from "~~/app/dashboard/components/dashboard/invite-users.vue";

const usersStore = useUsersStore();
const rolesStore = useRolesStore();

const users = computed(() => usersStore.users);

const { submit, error } = useForm();
const { getRoleSeverity } = rolesStore;
const { hasAccess } = useRoleCheck();
const { confirmAction } = useConfirmAction();
const localePath = useLocalePath();
const { formatDate } = useDate();

const isSuperAdmin = computed(() => hasAccess(100));

const userCreatorVisible = ref(false);
const dt = ref(null);
const emit = defineEmits(["showPermissions"]);

const selectPermissions = (user) => {
  emit("showPermissions", user);
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
      await usersStore.fetchUsers({ force: true });
    },
  });
};

const handleSaveChanges = async (changes) => {
  for (const change of changes) {
    const { itemIndex, itemId, changes: itemChanges } = change;
    const user = users.value[itemIndex];

    let roleChanged = false;
    let otherChanged = false;
    for (const { key, newValue } of itemChanges) {
      if (key === "role" || key === "role_data") {
        roleChanged = true;
      } else {
        otherChanged = true;
      }
    }

    if (otherChanged) {
      await submit({
        action: async () => await usersStore.updateUser(itemIndex, user),
        successMessage: "User updated",
      });
    }
    if (roleChanged) {
      await submit({
        action: async () => await usersStore.updateRole(itemIndex, user),
        successMessage: "Role updated",
      });
    }
  }
  await usersStore.fetchUsers({ force: true });
};

const handleDeleteItems = async (selectedItems) => {
  const selectedIds = selectedItems.map((user) => user.id);
  await submit({
    action: () => usersStore.deleteUsers(selectedIds),
    successMessage: "Users deleted",
  });
  // Clear selection after deletion
  selectedUsers.value = [];
};

const showUserCreator = () => {
  userCreatorVisible.value = true;
};

const onUserCreated = async () => {
  await usersStore.fetchUsers({ force: true });
};

const selectedUsers = ref([]);

const handleSelectionUpdate = (newSelection) => {
  selectedUsers.value = newSelection;
};

onMounted(async () => {
  await usersStore.fetchUsers({ force: true });
});
</script>
