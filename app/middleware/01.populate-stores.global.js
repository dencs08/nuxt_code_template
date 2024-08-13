export default defineNuxtRouteMiddleware(async (to, from) => {
  const authRequired = to.meta.auth;
  const layout = to.meta.layout;
  const userStore = useUserStore();
  const rolesStore = useRolesStore();
  const permissionStore = useMyPermissionStore();

  if (!userStore.user && authRequired != false) {
    await userStore.fetchUser();
  }

  if (!rolesStore.roles.value && authRequired != false) {
    await rolesStore.fetchRoles();
  }

  if (layout === "dashboard") {
    await permissionStore.fetchMyPermissions();
  }
});
