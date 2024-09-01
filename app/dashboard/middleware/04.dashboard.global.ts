export default defineNuxtRouteMiddleware(async (to, from) => {
  const layout = to.meta.layout;
  if (layout !== "dashboard") return;

  const { hasPermission } = usePermissions();

  if (!hasPermission("dashboard", "read")) {
    return abortNavigation();
  }
});
