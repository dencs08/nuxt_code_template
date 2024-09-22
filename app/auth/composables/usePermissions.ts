import type { Permission } from "../../../types/permissions";
export const usePermissions = () => {
  const permissions = useState<Permission[]>("permissions", () => []);
  const loading = useState<boolean>("permissionsLoading", () => false);

  const fetchPermissions = async () => {
    if (import.meta.server) return; // Skip on server-side

    try {
      loading.value = true;
      const { data } = await useFetch("/api/v1/me/permission");
      permissions.value = data.value?.data || [];
    } catch (error) {
      console.error("Error fetching permissions:", error);
      permissions.value = [];
    } finally {
      loading.value = false;
    }
  };

  const hasPermission = (resource: string, action: string): boolean => {
    return permissions.value.some((permission: Permission) => {
      return permission.resource === resource && permission.action === action;
    });
  };

  return {
    permissions,
    loading,
    fetchPermissions,
    hasPermission,
  };
};
