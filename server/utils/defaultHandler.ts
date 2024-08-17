import type { EventHandler, EventHandlerRequest, H3Event } from "h3";
import { getBackendClient } from "../../lib/backend";
import { checkUserRole } from "./auth-check";

const cache: { [key: string]: { data: any; expiry: number } } = {};

const ROLES_CACHE_KEY = "all_roles";
const CACHE_TTL = 60000; //milliseconds

type ExtendedEventHandler<T extends EventHandlerRequest, D> = (
  event: H3Event<T>,
  userSession: any
) => Promise<D>;

async function getCachedRoles(client: any) {
  const now = Date.now();
  if (cache[ROLES_CACHE_KEY] && cache[ROLES_CACHE_KEY].expiry > now) {
    return cache[ROLES_CACHE_KEY].data;
  }

  const roles = await client.getRoles();
  cache[ROLES_CACHE_KEY] = {
    data: roles,
    expiry: now + CACHE_TTL,
  };
  return roles;
}

export const defineWrappedResponseHandler = <T extends EventHandlerRequest, D>(
  handler: ExtendedEventHandler<T, D>,
  minAccessLevel?: number
): EventHandler<T, D> =>
  defineEventHandler<T>(async (event) => {
    try {
      const client = await getBackendClient(event);
      const userSession = await client.getCurrentUser();
      const roles = await getCachedRoles(client);

      if (minAccessLevel) {
        await checkUserRole(userSession, minAccessLevel, roles);
      }

      const response = await handler(event, userSession);
      return { response };
    } catch (err: any) {
      throw createError({
        statusCode: err.statusCode || 500,
        statusMessage: err.statusMessage,
      });
    }
  });

// Function to manually invalidate the roles cache
export function invalidateRolesCache() {
  delete cache[ROLES_CACHE_KEY];
}
