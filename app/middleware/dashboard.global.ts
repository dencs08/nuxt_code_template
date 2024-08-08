export default defineNuxtRouteMiddleware(async (to, from) => {
  const layout = to.meta.layout;
  if (layout != "dashboard") return;

  const permissionStore = useMyPermissionStore();
  if (!permissionStore.hasPermission("dashboard", "read")) return false;
});
