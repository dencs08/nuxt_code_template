//TODO get the all of the users settings + darkmode

export default defineNuxtRouteMiddleware(async (to, from) => {
    if (to.meta.auth != false) {
        const usersStore = useUsersStore();
        if (!usersStore.userSession) {
            await usersStore.fetchUserSession();
        }
    }
});