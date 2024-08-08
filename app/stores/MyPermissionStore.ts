const { CustomError } = useCustomError();
import type { Permission, GroupedPermission } from "../utils/types/permissions";

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
        this.loading = true;
        const data = await $fetch("/api/me/permission", {
          method: "GET",
        });
        this.setPermissions(data.response as any);
      } catch (error: any) {
        this.clearPermissions();
        throw new CustomError(error.message, error);
      } finally {
        this.loading = false;
      }
    },
    setPermissions(permissions: string[]) {
      this.permissions = permissions;
      console.log("Permissions set", permissions);
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
