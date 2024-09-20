import type { H3Event } from "h3";
import { DatabaseError, BaseError } from "~~/server/utils/errors";

async function getUsersUncached(event: H3Event) {
  const client = event.context.backendClient;

  const authData = await client.getAuthUsers();

  const authUsers: any[] = authData.users.map((user: any) => ({
    id: user.id,
    email: user.email,
  }));

  const profileData = await client.getUsers();

  const combinedData: any[] = profileData.map((profile: any) => {
    const authUser = authUsers.find((user) => user.id === profile.id);
    return {
      ...profile,
      email: authUser ? authUser.email : null,
    };
  });

  return combinedData;
}

export const getUsers = defineCachedFunction(
  async (event: H3Event) => await getUsersUncached(event),
  {
    maxAge: 60 * 1, // 1 minute
    swr: true,
    staleMaxAge: 60 * 60 * 1, // 1 hour
    name: "getUsers",
    getKey: (event) => {
      return "default";
    },
    shouldBypassCache: async (e) => getQuery(e).force === "true",
  }
);
