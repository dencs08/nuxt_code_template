import { getBackendClient } from "~~/lib/backend";
import { defineWrappedResponseHandler } from "../../utils/defaultHandler";

export default defineWrappedResponseHandler(async (event) => {
  const client = await getBackendClient(event, true);
  const users = await client.getAuthUsers();
  return users;
}, 75);
