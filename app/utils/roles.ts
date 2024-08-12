let cachedRoles: any[] | null = null;

export const validRoles: Role[] = [
  { name: "Guest", value: "guest", access_level: 0 },
  { name: "EndUser", value: "enduser", access_level: 5 },
  { name: "Subscriber", value: "subscriber", access_level: 10 },
  { name: "Editor", value: "editor", access_level: 25 },
  { name: "Manager", value: "manager", access_level: 50 },
  { name: "Admin", value: "admin", access_level: 75 },
  { name: "SuperAdmin", value: "superadmin", access_level: 100 },
];

export function useRoles() {
  const roles = ref<Role[]>(validRoles);

  const selectedRole = ref<Role | null>(null);

  const selectRole = (role: Role) => {
    selectedRole.value = role;
  };

  const getRoleSeverity = (roleValue: string) => {
    switch (roleValue) {
      case "enduser":
        return "";
      case "guest":
        return "contrast";
      case "subscriber":
        return "info";
      case "manager":
        return "success";
      case "admin":
        return "warn";
      case "superadmin":
        return "danger";
      default:
        return null;
    }
  };

  return {
    roles: readonly(roles),
    selectedRole: readonly(selectedRole),
    selectRole,
    getRoleSeverity,
  };
}
