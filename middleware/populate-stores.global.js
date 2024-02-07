export default defineNuxtRouteMiddleware(async (to, from) => {
    const usersStore = useUsersStore();
    await usersStore.fetchUserSession();
});