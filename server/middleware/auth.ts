import { defineEventHandler, createError } from "h3";
import { getUser, getUserSession } from "../utils/auth";
import { getAccessLevelByRole } from "../utils/roles";
import { getRouteConfig } from "../config/routeConfig";

export default defineEventHandler(async (event) => {
  const url = event.node.req.url!;
  const method = event.node.req.method!;
  const routeConfig = getRouteConfig(url, method);
  if (routeConfig.auth) {
    try {
      const userSession = await getUserSession(event);
      event.context.userSession = userSession.session;
      event.context.user = userSession.session.user;

      if (routeConfig.accessLevel !== undefined) {
        const client = event.context.backendClient;
        if (!client) {
          throw createError({
            statusCode: 500,
            statusMessage: "Backend client not initialized",
          });
        }
        const roles = await client.getRoles();
        const userAccessLevel = getAccessLevelByRole(
          event.context.user.role,
          roles
        );
        if (userAccessLevel < routeConfig.accessLevel) {
          throw createError({
            statusCode: 403,
            statusMessage: "Insufficient access level",
          });
        }
      }
    } catch (error: any) {
      throw createError({
        statusCode: error.statusCode || 401,
        statusMessage: error.statusMessage || "Unauthorized",
      });
    }
  }
});
