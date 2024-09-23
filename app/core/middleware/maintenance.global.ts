export default defineNuxtRouteMiddleware((to, from) => {
  const config = useRuntimeConfig();
  const nuxt = useNuxtApp();

  const { hasAccess } = useRoleCheck();
  const isPriviliged = hasAccess(10);
  const isDashboardLogin = to.path === nuxt.$localePath("/dashboard-login");

  if (isPriviliged || isDashboardLogin) return;

  const maintenancePage = nuxt.$localePath("/maintenance");
  const workInProgressPage = nuxt.$localePath("/work-in-progress");
  const isMaintenanceMode = config.public.APP_MAINTENANCE_MODE === "true";
  const isWorkInProgressMode =
    config.public.APP_WORK_IN_PROGRESS_MODE === "true";

  if (isMaintenanceMode && to.path !== maintenancePage) {
    return navigateTo(maintenancePage);
  }

  if (isWorkInProgressMode && to.path !== workInProgressPage) {
    return navigateTo(workInProgressPage);
  }

  return;
});
