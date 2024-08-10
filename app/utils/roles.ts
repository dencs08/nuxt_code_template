import { ref, readonly } from "vue";
//TODO (permissions are now managed in the database, perhaps we should change how we handle roles to be the same as the permissions (roles table and then in the user_roles assing correct id)), then role would have assigned permissions and we could check if user has permission to access the endpoint + possibility to override the role permisssion for each user.
//TODO change every piece of code which uses role name to use role value, role labels or names should only be used to display frontend
export type Role = {
  label: string;
  value: string;
  level: number;
};

export const validRoles: Role[] = [
  { label: "Guest", value: "guest", level: 0 },
  { label: "EndUser", value: "enduser", level: 5 },
  { label: "Subscriber", value: "subscriber", level: 10 },
  { label: "Editor", value: "editor", level: 25 },
  { label: "Manager", value: "manager", level: 50 },
  { label: "Admin", value: "admin", level: 75 },
  { label: "SuperAdmin", value: "superadmin", level: 100 },
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
