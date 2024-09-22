import { H3Event } from "h3";
import { getAccessLevelByRole } from "./roles";
import { getBackendClient } from "~~/lib/backend";
export async function getUser(event: H3Event) {
  // Get the backend client from the lib backend as the context one is service role
  const client = await getBackendClient(event);
  const user = await client.getCurrentUser();

  if (!user || !user.id || !user.email) {
    throw createError({
      statusCode: 401,
      statusMessage:
        "Unauthorized: No active session found. User must be logged in.",
    });
  }

  if (!user.role) {
    const userData = await client.getUser(user.id);
    user.role = userData.role;
  }

  return user;
}

export async function getUserSession(event: H3Event) {
  // Get the backend client from the lib backend as the context one is service role
  const client = await getBackendClient(event);
  const userSession = await client.getSession();

  if (!userSession) {
    throw createError({
      statusCode: 401,
      statusMessage:
        "Unauthorized: No active session found. User must be logged in.",
    });
  }

  return userSession;
}

export async function checkUserRole(
  user: any,
  requiredAccessLevel: number,
  roles: any
) {
  const userAccessLevel = getAccessLevelByRole(user.role, roles);

  if (userAccessLevel < requiredAccessLevel) {
    throw createError({
      statusCode: 403,
      statusMessage: "Unauthorized access",
    });
  }
}

export async function getUserRole(event: H3Event) {
  const user = await getUser(event);
  return user.role;
}
