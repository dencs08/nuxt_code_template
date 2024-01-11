import { ref, readonly } from "vue";

export type Role = {
    label: string;
    value: string;
    level: number;
};

export const validRoles: Role[] = [
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

    return {
        roles: readonly(roles),
        selectedRole: readonly(selectedRole),
        selectRole,
    };
}
