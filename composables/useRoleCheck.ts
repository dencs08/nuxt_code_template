export function useRoleCheck(requiredRoleName: string) {
    const { roles } = useRoles();
    const userStore = useUsersStore();
    const user = userStore.userRole;

    const requiredRole = roles.value.find((role) => role.value === requiredRoleName);

    const userRole = computed(() => {
        return roles.value.find((role) => role.value === user);
    });

    const hasAccess = computed(() => {
        return userRole.value && requiredRole && userRole.value.level >= requiredRole.level;
    });

    return {
        hasAccess,
    };
}
