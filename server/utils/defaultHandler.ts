import type { EventHandler, EventHandlerRequest, H3Event } from "h3";
import { getBackendClient } from "../../lib/backend";

type ExtendedEventHandler<T extends EventHandlerRequest, D> = (
  event: H3Event<T>,
  userSession: any
) => Promise<D>;
//TODO add a way of controling the what user role is needed in global config for each endpoint api
export const defineWrappedResponseHandler = <T extends EventHandlerRequest, D>(
  handler: ExtendedEventHandler<T, D>,
  minRole?: string
): EventHandler<T, D> =>
  defineEventHandler<T>(async (event) => {
    try {
      const client = await getBackendClient(event);
      const userSession = await client.getCurrentUser();
      if (minRole) {
        await checkUserRole(event, minRole);
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
