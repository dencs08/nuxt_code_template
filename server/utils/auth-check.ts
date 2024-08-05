import { validRoles } from "@/utils/roles";
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

  return userSession;
}

// Usage
// checkUserRole(event, 'admin');
export async function checkUserRole(event: any, role: string) {
  const user = await getUserSession(event);

  const userRoleLevel = validRoles.find(
    (validRole) => validRole.value === user.role
  )?.level;
  const requiredRoleLevel = validRoles.find(
    (validRole) => validRole.value === role
  )?.level;

  if (
    !Number.isInteger(userRoleLevel) ||
    !Number.isInteger(requiredRoleLevel) ||
    userRoleLevel! < requiredRoleLevel!
  ) {
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
