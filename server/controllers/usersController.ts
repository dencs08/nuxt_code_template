import type { H3Event } from "h3";
import { defineApiHandler } from "~~/server/utils/api-handler";
import type { PaginationParams } from "~~/types/pagination";
import { DatabaseError, BaseError } from "~~/server/utils/errors";
async function getUsersUncached(event: H3Event) {
  const params = getQuery(event) as PaginationParams;
  const client = event.context.backendClient;

  try {
    const authData = await client.getAuthUsers(params);

    if (!Array.isArray(authData.users)) {
      throw new Error("Auth users data is not an array");
    }

    const authUsers: any[] = authData.users.map((user: any) => ({
      id: user.id,
      email: user.email,
    }));

    const profileData = await client.getUsers(params);

    if (!profileData || !Array.isArray(profileData.data)) {
      throw new Error("Profile data is not in the expected format");
    }

    const combinedData = profileData.data.map((profile: any) => {
      const authUser = authUsers.find((user) => user.id === profile.id);
      return {
        ...profile,
        email: authUser ? authUser.email : null,
      };
    });

    return {
      data: combinedData,
      totalRecords: profileData.totalRecords,
      totalQueryRecords: profileData.totalQueryRecords,
    };
  } catch (error: any) {
    console.error("Error in getUsersUncached:", error);
    throw createError({
      statusCode: error.code,
      statusMessage: error.message,
    });
  }
}

export const getUsers = defineCachedFunction(
  defineApiHandler(async (event: H3Event) => await getUsersUncached(event)),
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

export async function getUsersByIds(event: H3Event) {
  const query = getQuery(event);
  const userIds = Array.isArray(query.userIds)
    ? query.userIds
    : typeof query.userIds === "string"
      ? query.userIds.split(",")
      : [];
  const client = event.context.backendClient;

  try {
    if (userIds.length === 0) {
      return { data: [] };
    }

    // Filter out non-UUID values
    const validUuids = userIds.filter(isValidUuid);

    if (validUuids.length === 0) {
      return { data: [] };
    }

    const users = await client.getUsersByIds(validUuids);

    return { data: users };
  } catch (error: any) {
    console.error("Error in getUsersByIds:", error);
    throw createError({
      statusCode: error.code,
      statusMessage: error.message,
    });
  }
}

// Helper function to check if a string is a valid UUID
function isValidUuid(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}
