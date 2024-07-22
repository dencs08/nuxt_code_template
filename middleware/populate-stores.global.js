export default defineNuxtRouteMiddleware(async (to, from) => {
  const usersStore = useUsersStore();
  const authRequired = to.meta.auth;

  if (authRequired && authRequired.unauthenticatedOnly) {
    if (!usersStore.user) {
      await usersStore.fetchUser();
    }
  }

  if (authRequired === undefined || authRequired === true) {
    if (!usersStore.user) {
      await usersStore.fetchUser();
    }
  }
});
