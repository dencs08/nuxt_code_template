import type { EventHandler, EventHandlerRequest, H3Event } from "h3";
import { getBackendClient } from "../../lib/backend";
import { checkUserRole } from "./auth-check";

type ExtendedEventHandler<T extends EventHandlerRequest, D> = (
  event: H3Event<T>,
  userSession: any
) => Promise<D>;
export const defineWrappedResponseHandler = <T extends EventHandlerRequest, D>(
  handler: ExtendedEventHandler<T, D>,
  minAccessLevel?: number
): EventHandler<T, D> =>
  defineEventHandler<T>(async (event) => {
    try {
      const client = await getBackendClient(event);
      const userSession = await client.getCurrentUser();
      if (minAccessLevel) {
        await checkUserRole(userSession, minAccessLevel);
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
