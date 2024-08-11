import { getBackendClient } from "../../../lib/backend";
import { defineWrappedResponseHandler } from "../../utils/defaultHandler";

export default defineWrappedResponseHandler(async (event) => {
  const client = await getBackendClient(event);
  const userSession = await client.getCurrentUser();

  try {
    const response = await client.deleteMe(userSession);
    return { response };
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      statusMessage:
        "An error occurred during the deletion process " + err.message,
    });
  }
}, 0);
