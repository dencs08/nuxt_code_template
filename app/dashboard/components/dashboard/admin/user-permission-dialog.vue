<template>
  <Dialog
    :visible="localDialogVisible"
    @update:visible="handleDialogVisibility"
    :user="selectedUser"
    header="Flex Scroll"
    :style="{ width: '75vw' }"
    maximizable
    modal
    :contentStyle="{ height: '300px' }"
  >
    <template #header>
      <div class="flex items-center gap-2">
        <Avatar :image="selectedUser?.photo" shape="circle" />
        <div>
          <div class="font-bold">
            <span>{{ selectedUser?.name }}</span>
          </div>
          <Tag :severity="getRoleSeverity(selectedUser?.role)" rounded>
            <span class="text-sm font-black">{{ selectedUser?.role }}</span>
          </Tag>
        </div>
      </div>
    </template>
    <DataTable :value="userPermissions" :loading="permissionStore.loading">
      <template #header>
        <div class="w-full flex flex-row justify-between items-center">
          <div>
            <span class="text-xl font-bold">Permissions</span>
          </div>
          <div class="flex flex-row gap-1">
            <div class="grid place-content-center">
              <Button
                size="small"
                v-tooltip.left="'Refresh permissions table'"
                @click="refreshPermissions"
                icon="pi pi-refresh"
                aria-label="Refresh"
              />
            </div>
            <div class="grid place-content-center" v-if="isAdmin">
              <Button
                size="small"
                v-tooltip.left="'Edit permissions'"
                @click="isCheckboxDisabled = !isCheckboxDisabled"
                icon="pi pi-pencil"
                aria-label="Edit"
              />
            </div>
          </div>
        </div>
      </template>
      <Column field="name" header="Name"></Column>
      <Column header="Read">
        <template #body="slotProps">
          <Checkbox
            v-model="slotProps.data.actions.read"
            :binary="true"
            :disabled="isCheckboxDisabled"
          />
        </template>
      </Column>
      <Column header="Write">
        <template #body="slotProps">
          <Checkbox
            v-model="slotProps.data.actions.write"
            :binary="true"
            :disabled="isCheckboxDisabled"
          />
        </template>
      </Column>
      <Column header="Delete">
        <template #body="slotProps">
          <Checkbox
            v-model="slotProps.data.actions.delete"
            :binary="true"
            :disabled="isCheckboxDisabled"
          />
        </template>
      </Column>
    </DataTable>
    <template #footer>
      <div class="flex items-center gap-2">
        <Button
          label="Save"
          severity="success"
          class="flex-auto"
          outlined
          @click="savePermissions"
        />
        <Button
          label="Cancel"
          severity="secondary"
          class="flex-auto"
          @click="closeDialog"
        />
      </div>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
const props = defineProps({
  isDialogVisible: Boolean,
  selectedUser: Object,
});

const emit = defineEmits(["update:isDialogVisible", "savePermissions"]);

const { hasAccess } = useRoleCheck();
const { getRoleSeverity } = useRolesStore();
const { showToast } = useToastService();
const { submit, error } = useForm();

const localDialogVisible = ref(props.isDialogVisible);
const isCheckboxDisabled = ref(true);
const isAdmin = hasAccess(75);

const permissionStore = usePermissionStore();

const userPermissions = computed(() => {
  return props.selectedUser
    ? permissionStore.userPermissionsStatus[props.selectedUser.id] || []
    : [];
});

const refreshPermissions = async () => {
  if (props.selectedUser) {
    submit({
      async action() {
        permissionStore.fetchUserPermissionsWithStatus(props.selectedUser.id);
      },
      successMessage: "Permissions refreshed successfully",
      errorTitle: "Error refreshing permissions",
    });
  }
};

const savePermissions = async () => {
  try {
    await submit({
      async action() {
        await permissionStore.saveUserPermissions(props.selectedUser.id);
      },
      showErrorToast: false,
      errorTitle: "Error saving permissions",
    });
    emit("savePermissions");
  } catch (error) {
    console.error("Error saving permissions:", error);
  }
};

const closeDialog = () => {
  localDialogVisible.value = false;
  emit("update:isDialogVisible", false);
};

const handleDialogVisibility = (visible: boolean) => {
  localDialogVisible.value = visible;
  if (!visible) {
    emit("update:isDialogVisible", false);
  }
};

watch(
  () => props.isDialogVisible,
  async (newVal) => {
    localDialogVisible.value = newVal;
    if (
      newVal &&
      props.selectedUser &&
      !permissionStore.userPermissionsStatus[props.selectedUser.id]
    ) {
      try {
        permissionStore.fetchUserPermissionsWithStatus(props.selectedUser.id);
      } catch (error) {
        showToast({
          severity: "error",
          summary: "Error",
          detail: "Error fetching user permissions",
        });
      }
    }
  }
);
</script>

<style scoped>
/* Add any scoped styles here */
</style>
