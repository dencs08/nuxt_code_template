import { type Role, validRoles } from "@/utils/roles";
export function useRoleCheck(defaultRoleCheck = "user" as string) {
    const { roles } = useRoles();
    const userStore = useUsersStore();
    const user = userStore.userRole;
    const userRole = computed(() => roles.value.find((role) => role.value === user));

    const checkAccess = (requiredRoleValue: Role["value"]): boolean => {
        const userRoleLevel = userRole.value.level;
        const requiredRole = validRoles.find((role) => role.value === requiredRoleValue);
        return requiredRole && userRoleLevel >= requiredRole.level;
    };

    const hasAccess = (roleValue: Role["value"] = "user"): boolean => {
        return checkAccess(roleValue);
    };

    const accessByRole = (
        minimalAccessRoleValue: Role["value"]
    ): Record<Role["value"], boolean> => {
        const accessMap: Record<Role["value"], boolean> = {} as Record<Role["value"], boolean>;
        validRoles.forEach((role) => {
            accessMap[role.value] =
                role.level >= validRoles.find((r) => r.value === minimalAccessRoleValue).level;
        });
        return accessMap;
    };

    return {
        hasAccess,
        checkAccess,
        accessByRole,
    };
}
