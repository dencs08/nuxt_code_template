export default defineNuxtPlugin(async (nuxtApp) => {
  const { CustomError } = useCustomError();
  const userStore = useUserStore();
  const rolesStore = useRolesStore();
  const { fetchPermissions } = usePermissions();

  let initialFetchDone = false;
  let isRefetching = false;

  const fetchInitialData = async () => {
    if (!initialFetchDone && !isRefetching) {
      isRefetching = true;
      try {
        await userStore.fetchUser();
        console.log("Initial user fetch", userStore.user);
        initialFetchDone = true;
      } catch (error: any) {
        console.error("Error fetching initial user data:", error);
        throw new CustomError(error.message, error);
      } finally {
        isRefetching = false;
      }
    }
  };

  const fetchRoles = async () => {
    try {
      await rolesStore.fetchRoles();
      console.log("Roles fetched", rolesStore.roles);
    } catch (error: any) {
      console.error("Error fetching roles:", error);
      throw new CustomError(error.message, error);
    }
  };

  await fetchInitialData();
  await fetchRoles();
  await fetchPermissions();

  nuxtApp.hooks.hook("page:start", async () => {
    if (!userStore.user && !isRefetching) {
      await fetchInitialData();
    }
  });

  const refetchAllData = async () => {
    initialFetchDone = false;
    await fetchInitialData();
    await fetchRoles();
    await fetchPermissions();
  };

  return {
    provide: {
      refetchAllData,
    },
  };
});
