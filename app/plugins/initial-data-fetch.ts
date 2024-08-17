export default defineNuxtPlugin(async (nuxtApp) => {
  const { CustomError } = useCustomError();
  const userStore = useUserStore();
  const rolesStore = useRolesStore();
  const { fetchPermissions } = usePermissions();

  let initialFetchDone = false;

  const fetchInitialData = async () => {
    if (!initialFetchDone) {
      try {
        await userStore.fetchUser();
        console.log("Initial user fetch", userStore.user);
        initialFetchDone = true;
      } catch (error: any) {
        console.error("Error fetching initial user data:", error);
        throw new CustomError(error.message, error);
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

  watch(
    () => userStore.user,
    async (newUser, oldUser) => {
      if (newUser !== oldUser) {
        console.log("User changed, refetching data");
        initialFetchDone = false;
        await fetchInitialData();
        await fetchRoles();
        await fetchPermissions();
      }
    },
    { deep: true }
  );

  // Add a method to manually trigger data fetch (useful for logout scenarios)
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
