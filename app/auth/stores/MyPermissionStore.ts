import type { Permission, GroupedPermission } from "../../../types/permissions";

export const useMyPermissionStore = defineStore({
  id: "myPermissionStore",
  state: () => ({
    permissions: [],
    loading: false,
  }),
  getters: {
    getMyPermissions(state) {
      return state.permissions;
    },
  },
  actions: {
    async fetchMyPermissions() {
      try {
        const userStore = useUserStore();
        const user = userStore.getUser;

        if (!user) {
          return;
        }

        this.loading = true;
        const response = await $fetch("/api/v1/me/permission", {
          method: "GET",
        });
        this.setPermissions(response.data as any);
        return response.data;
      } catch (error: any) {
        this.clearPermissions();
        throw createError({
          statusCode: 500,
          statusMessage: error.message,
        });
      } finally {
        this.loading = false;
      }
    },
    setPermissions(permissions: string[]) {
      this.permissions = permissions;
    },
    clearPermissions() {
      this.permissions = [];
    },
    hasPermission(resource: string, action: string): boolean {
      return this.permissions.some((permission: Permission) => {
        return permission.resource === resource && permission.action === action;
      });
    },
  },
});
