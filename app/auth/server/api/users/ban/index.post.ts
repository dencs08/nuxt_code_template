import { getBackendClient } from "~~/lib/backend";
import { defineWrappedResponseHandler } from "~~/server/utils/defaultHandler";

/**
 * Determines how long a user is banned for.
 *
 * The format for the ban duration follows a strict sequence of decimal numbers with a unit suffix.
 * Valid time units are "ns", "us" (or "µs"), "ms", "s", "m", "h".
 *
 * For example, some possible durations include: '300ms', '2h45m'.
 *
 * Setting the ban duration to 'none' lifts the ban on the user.
 */
export default defineWrappedResponseHandler(async (event, userSession) => {
  const server = await getBackendClient(event, true);
  let body = await readBody(event);

  const user = await server.banUser(body.id, body.duration);
  return user;
}, 75);
