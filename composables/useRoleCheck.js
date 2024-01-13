export function useRoleCheck(requiredRoleName) {
    const { roles } = useRoles();
    const userStore = useUsersStore();
    const user = userStore.getUserSession;

    const requiredRole = roles.value.find(role => role.value === requiredRoleName);

    const userRole = computed(() => {
        return roles.value.find(role => role.value === user.role);
    });

    const hasAccess = computed(() => {
        return userRole.value && requiredRole && userRole.value.level >= requiredRole.level;
    });

    return {
        hasAccess,
    };
}