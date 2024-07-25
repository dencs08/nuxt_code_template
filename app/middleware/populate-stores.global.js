export default defineNuxtRouteMiddleware(async (to, from) => {
  const userStore = useUserStore();
  const authRequired = to.meta.auth;

  if (authRequired && authRequired.unauthenticatedOnly) {
    if (!userStore.user) {
      await userStore.fetchUser();
    }
  }

  if (authRequired === undefined || authRequired === true) {
    if (!userStore.user) {
      await userStore.fetchUser();
    }
  }
});
