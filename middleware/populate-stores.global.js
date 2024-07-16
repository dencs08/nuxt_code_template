export default defineNuxtRouteMiddleware(async (to, from) => {
    const usersStore = useUsersStore();
    const response = await useAsyncData(async () => new Promise((resolve) => resolve(usersStore.fetchUsers())));
  });