import { ref, readonly } from "vue";
//TODO create a config file for roles and permissions
//TODO change every piece of code which uses role name to use role value, role labels or names should only be used to display frontend
export type Role = {
  label: string;
  value: string;
  level: number;
};

export const validRoles: Role[] = [
  { label: "Guest", value: "guest", level: 0 },
  { label: "Subscriber", value: "subscriber", level: 1 },
  { label: "User", value: "user", level: 2 },
  { label: "Admin", value: "admin", level: 3 },
  { label: "SuperAdmin", value: "superadmin", level: 4 },
  // add other roles here
];

export function useRoles() {
  const roles = ref<Role[]>(validRoles);

  const selectedRole = ref<Role | null>(null);

  const selectRole = (role: Role) => {
    selectedRole.value = role;
  };

  const getRoleSeverity = (roleValue: string) => {
    switch (roleValue) {
      case "guest":
        return "info";
      case "subscriber":
        return "info";
      case "user":
        return "success";
      case "admin":
        return "warning";
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
