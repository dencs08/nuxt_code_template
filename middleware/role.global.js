export default defineNuxtRouteMiddleware(async (to, from) => {
    const { hasAccess } = useRoleCheck();
    const auth = to.meta.auth;
    const access = to.meta.access;

    if (auth === false) {
        return; // Allow all users regardless of authentication state.
    } else {
        if (access === undefined) {
            return; // Allow all users regardless of role.
        }

        // If the user doesn't have access, deny access
        if (!hasAccess(access)) {
            return false;
        }

        // If none of the above conditions are met, allow access
        return true;
    }
});