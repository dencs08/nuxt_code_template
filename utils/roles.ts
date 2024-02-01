import { ref, readonly } from "vue";

export type Role = {
    label: string;
    value: string;
    level: number;
};

export const validRoles: Role[] = [
    { label: "Subscriber", value: "subscriber", level: 0 },
    { label: "User", value: "user", level: 1 },
    { label: "Admin", value: "admin", level: 2 },
    { label: "SuperAdmin", value: "superadmin", level: 3 },
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
            case "user":
                return "info";
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
