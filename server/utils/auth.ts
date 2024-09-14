import { H3Event } from "h3";
import { getAccessLevelByRole } from "./roles";
import { getBackendClient } from "~~/lib/backend";
export async function getUserSession(event: H3Event) {
  // Get the backend client from the lib backend as the context one is service role
  const client = await getBackendClient(event);
  const userSession = await client.getCurrentUser();

  if (!userSession || !userSession.id || !userSession.email) {
    throw createError({
      statusCode: 401,
      statusMessage:
        "Unauthorized: No active session found. User must be logged in.",
    });
  }

  if (!userSession.role) {
    const userData = await client.getUser(userSession.id);
    userSession.role = userData.role;
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
  const user = await getUserSession(event);
  return user.role;
}
