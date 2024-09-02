import { defineWrappedResponseHandler } from "../../../../../../server/utils/defaultHandler";
import { getBackendClient } from "../../../../../../lib/backend";

export default defineWrappedResponseHandler(async (event, userSession) => {
  const client = await getBackendClient(event);
  try {
    const response = await client.getMePermissions(userSession.id);
    return response;
  } catch (error) {
    throw error;
  }
}, 0);
