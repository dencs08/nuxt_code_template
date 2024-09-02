import { getBackendClient } from "~~/lib/backend";
import { defineWrappedResponseHandler } from "../../../../../server/utils/defaultHandler";
import { type UserAuthPublicSession } from "~~/types/user";

export default defineWrappedResponseHandler(async (event, userSession) => {
  const server = await getBackendClient(event, true);
  let body = await readBody(event);

  const user = await server.createUser(body, event, userSession);
  return user;
}, 75);
