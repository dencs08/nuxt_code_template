import { getBackendClient } from "../../lib/backend";

export async function getUserSession(event: any) {
  const client = await getBackendClient(event);
  const userSession = await client.getCurrentUser();

  if (!userSession) {
    throw createError({
      statusCode: 401,
      statusMessage:
        "Unauthorized: No active session found. User must be logged in.",
    });
  }
  if (!userSession.id || !userSession.email) {
    throw createError({
      statusCode: 401,
      statusMessage:
        "Unauthorized: No active session found. User must be logged in.",
    });
  }

  // Fetch the user's role if it's not already included
  if (!userSession.role) {
    const userData = await client.getUser(userSession.id);
    userSession.role = userData.role;
  }

  return userSession;
}

// Usage
// checkUserRole(event, 10);
export async function checkUserRole(
  user: any,
  requiredAccessLevel: number,
  roles: any
) {
  const userAccessLevel = getAccessLevelByRole(user.role, roles);

  if (userAccessLevel < requiredAccessLevel) {
    throw createError({
      statusCode: 403,
      statusMessage: `Unauthorized access`,
    });
  }
}

// Usage
// await getUserRole(event);
export async function getUserRole(event: any) {
  const user = await getUserSession(event);
  return user.role;
}

export function getAccessLevelByRole(roleValue: string, roles: any): number {
  const role = roles.find((r: any) => r.name === roleValue);
  return role ? role.access_level : 0;
}
