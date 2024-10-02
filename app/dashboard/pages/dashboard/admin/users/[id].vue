<template>
  <div>
    <div
      class="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none"
    >
      <div>
        <div
          v-if="usersStore.loading"
          class="space-y-4 leading-6 text-blue-500"
        >
          <Skeleton width="100%" height="4rem"></Skeleton>
          <Skeleton width="100%" height="4rem"></Skeleton>
          <Skeleton width="100%" height="4rem"></Skeleton>
        </div>
        <div v-else-if="!userExists" class="leading-6 text-red-500">
          This user doesn't exist.
        </div>
        <div v-else>
          <div class="flex flex-row justify-between items-center">
            <div class="flex flex-row gap-3 items-center">
              <Avatar
                :image="user.photo || '/img/avatar.svg'"
                class="mr-2"
                size="large"
                shape="circle"
              />
              <div class="space-y-1">
                <div class="flex flex-row gap-1">
                  <p class="text-sm font-medium">{{ user.email }}</p>
                  <span class="text-xs">({{ user.name }})</span>
                </div>
                <Tag
                  class="px-1.5 py-0.5"
                  :value="user?.role"
                  :severity="rolesStore.getRoleSeverity(user?.role)"
                />
              </div>
            </div>
            <div class="flex items-center gap-1">
              <span v-if="isBanActive" class="mr-4 text-red-500">
                Banned until:
                {{
                  formatDate(user.banned_until, {
                    includeTime: true,
                    padZeroes: false,
                  })
                }}
              </span>
              <div v-if="access75" class="space-x-1">
                <Button
                  severity="danger"
                  label="Ban user"
                  @click="banUser"
                  size="small"
                ></Button>
                <Button
                  icon="pi pi-refresh"
                  size="small"
                  @click="refetchUser"
                ></Button>
              </div>
              <div v-if="access50">
                <Button
                  icon="pi pi-ellipsis-v"
                  text
                  severity="contrast"
                  size="small"
                  @click="() => (sidebarOpen = true)"
                >
                </Button>
              </div>
            </div>
          </div>
          <div>
            <dl
              class="mt-6 space-y-6 divide-y divide-surface-100 dark:divide-surface-700 border-t border-surface-200 dark:border-surface-700 text-sm leading-6"
            >
              <div v-for="(value, key) in user" :key="key" class="pt-6 sm:flex">
                <dt
                  class="font-medium text-surface-900 dark:text-surface-50 sm:w-64 sm:flex-none sm:pr-6"
                >
                  {{ key }}
                </dt>
                <dd
                  class="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto"
                >
                  <div class="text-surface-900 dark:text-surface-50">
                    {{ value }}
                  </div>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
    <Drawer v-model:visible="sidebarOpen" position="right">
      <template #container="{ closeCallback }">
        <div class="flex flex-col h-full">
          <div class="flex items-center justify-between px-4 pt-4 shrink-0">
            <span class="inline-flex items-center gap-2"> Actions </span>
            <span>
              <Button
                type="button"
                @click="closeCallback"
                icon="pi pi-times"
                rounded
                text
              ></Button>
            </span>
          </div>
          <div class="px-4 space-y-1">
            <div v-for="(section, index) in actionSections" :key="index">
              <div :class="section.class">
                <FormWrapper
                  v-for="action in section.actions"
                  :key="action.label"
                  :icon="action.icon"
                  :submitLabel="action.label"
                  :loading="action.loading"
                  :submitAttrs="{
                    inputClass: `${action.submitClass}`,
                  }"
                  :handle-submit="action.onClick"
                ></FormWrapper>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import PasswordFormInput from "@/core/components/utils/forms/password-form-input.vue";
import BanUser from "@/dashboard/components/dashboard/admin/ban-user.vue";

definePageMeta({
  layout: "dashboard",
});

interface RouteParams {
  id: string;
}

interface Action {
  label: string;
  icon: string;
  onClick: () => void;
  props?: {
    severity?: string;
    text?: boolean;
  };
  submitClass?: string;
  loading?: Ref<boolean>;
}

interface ActionSection {
  class: string;
  actions: Action[];
}

const route = useRoute();
const params = route.params as RouteParams;
const usersStore = useUsersStore();
const { confirmAction } = useConfirmAction();
const { showToast } = useToastService();
const { submit, error } = useForm();
const { formatDate } = useDate();
const { hasAccess } = useRoleCheck();
const localePath = useLocalePath();
const rolesStore = useRolesStore();
const sidebarOpen = ref(false);

const access75 = hasAccess(75);
const access50 = hasAccess(50);
const user = ref<any>(null);

onMounted(async () => {
  refetchUser();
});

const refetchUser = async () => {
  user.value = await usersStore.fetchUser(params.id);
};

const userExists = computed(() => {
  return user.value && Object.keys(user.value).length > 0;
});

const isBanActive = computed(() => {
  if (!user.value || !user.value.banned_until) return false;
  const banUntil = new Date(user.value.banned_until);
  const now = new Date();
  return banUntil > now;
});

const sendResetPasswordLoading = ref(false);
const changePasswordLoading = ref(false);
const deleteUserLoading = ref(false);

const actionSections = computed<ActionSection[]>(() => [
  {
    class: "space-y-1",
    actions: [
      {
        label: "Send Reset Password Link",
        icon: "pi pi-key",
        submitClass: "btn btn-primary w-full",
        onClick: sendResetPassword,
        loading: sendResetPasswordLoading,
      },
    ],
  },
  {
    class: "space-y-1",
    actions: [
      {
        label: "Change Password",
        icon: "pi pi-key",
        submitClass: "btn btn-contrast w-full",
        onClick: confirmChangePassword,
        loading: changePasswordLoading,
      },
    ],
  },
  {
    class: "",
    actions: [
      {
        label: "Delete User",
        icon: "pi pi-trash",
        submitClass: "btn btn-danger w-full",
        onClick: (event: any) => {
          confirmDeleteUsers(event);
        },
        loading: deleteUserLoading,
      },
    ],
  },
]);

const sendResetPassword = async () => {
  sendResetPasswordLoading.value = true;
  await submit({
    async action() {
      await usersStore.sendPasswordResetEmail(user.value.email);
    },
    successMessage: "Password reset email has been sent",
    errorMessage: (error) => `Failed to send reset email: ${error.message}`,
  }).finally(() => {
    sendResetPasswordLoading.value = false;
  });
};

// const changeUserPassword = async () => {
//   changePasswordLoading.value = true;
//   await submit({
//     async action() {
//       await confirmChangePassword();
//     },
//     successMessage: "Password has been changed",
//     errorMessage: (error) => `Failed to change password: ${error.message}`,
//   }).finally(() => {
//     changePasswordLoading.value = false;
//   });
// };

const confirmDeleteUsers = (event: any) => {
  confirmAction({
    target: event.currentTarget,
    message: "Are you sure you want to delete?",
    icon: "pi pi-exclamation-triangle",
    acceptLabel: "Delete",
    rejectLabel: "Cancel",
    severity: "danger",
    accept: async () => {
      deleteUserLoading.value = true;
      await deleteUser();
      deleteUserLoading.value = false;
      navigateTo(localePath("/dashboard/admin/users"));
    },
    reject: () => {},
  });
};

const deleteUser = async () => {
  await submit({
    async action() {
      await usersStore.deleteUser(params.id);
    },
    successMessage: "User has been deleted",
    errorMessage: (error) => `Failed to delete user: ${error.message}`,
  });
};

const banUser = () => {
  confirmAction({
    message:
      "Set the ban duration accepted using minutes(m) or hours(h) for example: 30m or 24h or 6h30m.",
    header: "Are you sure you want to ban this user?",
    icon: "pi pi-ban",
    severity: "contrast",
    acceptLabel: "Ban",
    component: markRaw(BanUser),
    accept: async (data: any) => {
      await usersStore.banUser(params.id, data);
      showToast({
        severity: "success",
        summary: "Success",
        detail: `User ${user.value.email} has been banned for: ${data}.`,
      });
      refetchUser(); // Refresh user data after banning
    },
    reject: () => {},
    onError(errorMessage) {
      showToast({
        severity: "warn",
        summary: "Error",
        detail: errorMessage,
      });
    },
  });
};

const confirmChangePassword = () => {
  changePasswordLoading.value = true;
  confirmAction({
    message: "Enter new password for the user",
    icon: "pi pi-key",
    acceptLabel: "Change",
    rejectLabel: "Cancel",
    severity: "contrast",
    component: toRaw(PasswordFormInput),
    accept: async (data) => {
      await submit({
        async action() {
          await usersStore.changeUserPassword(params.id, data);
          changePasswordLoading.value = false;
        },
        successMessage: "Password has been changed",
      });
    },
    reject: () => {},
  });
};
</script>
