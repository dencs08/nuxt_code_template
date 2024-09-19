import type { H3Event } from "h3";

const getUsersUncached = defineCachedFunction(async (event: any) => {
  const client = event.context.backendClient;
  // const timestamp = new Date().toISOString();

  try {
    const authData = (await client.getAuthUsers()) as any;

    const authUsers: any[] = (authData.users as any[]).map((user) => ({
      id: user.id,
      email: user.email,
    }));

    const profileData = await client.getUsers();

    const combinedData: any[] = (profileData as any[]).map((profile) => {
      const authUser = authUsers.find((user) => user.id === profile.id);
      return {
        ...profile,
        email: authUser ? authUser.email : null,
      };
    });

    return combinedData;
  } catch (err) {
    throw createError({
      statusCode: 500,
      statusMessage: "An error occurred while fetching the users",
    });
  }
});

export const getUsers = defineCachedFunction(
  async (event: H3Event) => await getUsersUncached(event),
  {
    maxAge: 60 * 60, // 1 hour
    // swr: false,
    // staleMaxAge: 60 * 60 * 24, // 24 hours
    name: "getUsers",
    // getKey: (event) => "default",
    shouldBypassCache: async (e) => {
      if (getQuery(e).force) {
        const storage = useStorage("cache");
        const handlerKeys = await storage.getKeys("nitro:handlers");
        const functionKeys = await storage.getKeys("nitro:functions:getRoles");
        const cacheKeys = [...handlerKeys, ...functionKeys];
        await Promise.all(
          cacheKeys.map((element) => storage.removeItem(element))
        );
        console.log(`cacheKeys: ${cacheKeys}`);
        return true;
      } else {
        return false;
      }
    },
  }
);
