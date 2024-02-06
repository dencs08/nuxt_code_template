import { fetchPublicUserSession } from '../services/userSession';

export default defineNuxtRouteMiddleware(async (to, from) => {
    const auth = to.meta.auth;
    const access = to.meta.access;

    if (auth === false) {
        return; // Allow all users regardless of authentication state.
    } else {
        const usersStore = useUsersStore();
        if (access === undefined) {
            return; // Allow all users regardless of role.
        }
        const userSession = await usersStore.fetchUserSession();
        const userRole = usersStore.userRole;

        // Find the user's role and the minimum access role in the validRoles array
        const userRoleObj = validRoles.find(role => role.value === userRole);
        const accessRoleObj = validRoles.find(role => role.value === access);

        // If the user's role or the minimum access role is not found, deny access
        if (!userRoleObj || !accessRoleObj) {
            return false;
        }

        // If the user's role level is less than the minimum access role level, deny access
        if (userRoleObj.level < accessRoleObj.level) {
            return false;
        }

        // If none of the above conditions are met, allow access
        return true;

    }
});