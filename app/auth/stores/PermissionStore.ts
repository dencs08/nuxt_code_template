const { CustomError } = useCustomError();
import type { Permission, GroupedPermission } from "~~/types/permissions";

export const usePermissionStore = defineStore({
  id: "permissionStore",
  state: () => ({
    userPermissions: {} as Record<string, Permission[]>,
    userPermissionsStatus: {} as Record<string, GroupedPermission[]>,
    availablePermissions: [] as Permission[],
    loading: false,
  }),
  getters: {
    getUserPermissions: (state) => (userId: string) => {
      return state.userPermissions[userId];
    },
  },
  actions: {
    async fetchUserPermissions(userId: string) {
      try {
        this.loading = true;
        const data = await $fetch("/api/permissions", {
          method: "POST",
          body: { userId },
        });

        this.userPermissions[userId] = data.response;
        return data.response;
      } catch (error: any) {
        throw new CustomError(error.message, error);
      } finally {
        this.loading = false;
      }
    },
    async fetchAvailablePermissions() {
      try {
        this.loading = true;
        const data = await $fetch("/api/permissions", {
          method: "GET",
        });

        this.availablePermissions = data.response;
        return data.response;
      } catch (error: any) {
        throw new CustomError(error.message, error);
      } finally {
        this.loading = false;
      }
    },
    async fetchUserPermissionsWithStatus(userId: string) {
      try {
        this.loading = true;
        const userPermissionsData = await this.fetchUserPermissions(userId);
        const availablePermissionsData = await this.fetchAvailablePermissions();

        const userPermissions: Permission[] = userPermissionsData || [];
        const availablePermissions: Permission[] =
          availablePermissionsData || [];

        const groupedPermissions: Record<string, GroupedPermission> = {};

        // Initialize grouped permissions with all available resources
        availablePermissions.forEach((permission: Permission) => {
          if (!groupedPermissions[permission.resource]) {
            groupedPermissions[permission.resource] = {
              name: permission.resource,
              actions: { read: false, write: false, delete: false },
            };
          }
        });

        // Update permissions based on user's actual permissions
        userPermissions.forEach((permission: Permission) => {
          if (groupedPermissions[permission.resource]) {
            groupedPermissions[permission.resource].actions[
              permission.action as keyof GroupedPermission["actions"]
            ] = true;
          }
        });

        const combinedPermissions = Object.values(groupedPermissions);
        this.userPermissionsStatus[userId] = combinedPermissions;
      } finally {
        this.loading = false;
      }
    },
    async saveUserPermissions(userId: string) {
      try {
        this.loading = true;
        const groupedPermissions = this.userPermissionsStatus[userId];

        if (!groupedPermissions) {
          throw new Error("No permissions found for this user");
        }

        const permissions = groupedPermissions.map(
          (group: GroupedPermission) => ({
            resource: group.name,
            action: group.actions,
          })
        );

        const response = await $fetch("/api/permissions", {
          method: "PUT",
          body: { userId, permissions },
        });

        await this.fetchUserPermissionsWithStatus(userId);

        return response;
      } catch (error: any) {
        throw new CustomError(error.message, error);
      } finally {
        this.loading = false;
      }
    },
    async setPermissionStatus() {},
    clearUserPermissions(userId: string) {
      delete this.userPermissions[userId];
      delete this.userPermissionsStatus[userId];
    },
  },
});
