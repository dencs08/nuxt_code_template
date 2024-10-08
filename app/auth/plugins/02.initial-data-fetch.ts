export default defineNuxtPlugin(async (nuxtApp) => {
  const userStore = useUserStore();
  const rolesStore = useRolesStore();

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
        throw createError({
          statusCode: 500,
          statusMessage: error.message,
        });
      } finally {
        isRefetching = false;
      }
    }
  };

  const fetchPermissions = async () => {
    if (userStore.user) {
      const { fetchPermissions } = usePermissions();
      await fetchPermissions();
    } else {
      // console.log("Skipping permission fetch: User is not present");
    }
  };

  const fetchRoles = async () => {
    try {
      await rolesStore.fetchRoles();
      console.log("Roles fetched", rolesStore.roles);
    } catch (error: any) {
      console.error("Error fetching roles:", error);
      throw createError({
        statusCode: 500,
        statusMessage: error.message,
      });
    }
  };

  await fetchInitialData();
  await fetchRoles();
  await fetchPermissions();

  nuxtApp.hooks.hook("page:start", async () => {
    if (!userStore.user && !isRefetching) {
      await fetchInitialData();
      if (userStore.user) {
        await fetchPermissions();
      }
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
