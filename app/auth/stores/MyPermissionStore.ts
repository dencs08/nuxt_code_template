const { CustomError } = useCustomError();
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
          return; // Exit early if no user is present
        }

        this.loading = true;
        const data = await $fetch("/api/me/permission", {
          method: "GET",
        });
        this.setPermissions(data.response as any);
        return data.response;
      } catch (error: any) {
        this.clearPermissions();
        throw new CustomError(error.message, error);
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
