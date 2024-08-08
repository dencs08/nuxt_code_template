export default defineNuxtRouteMiddleware(async (to, from) => {
  const authRequired = to.meta.auth;
  const layout = to.meta.layout;
  const userStore = useUserStore();
  const permissionStore = useMyPermissionStore();

  if (!userStore.user && authRequired != false) {
    await userStore.fetchUser();
  }
  if (layout === "dashboard") {
    await permissionStore.fetchMyPermissions();
  }
});
