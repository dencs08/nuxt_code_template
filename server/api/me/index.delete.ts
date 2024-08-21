import { getBackendClient } from "../../../lib/backend";
import { defineWrappedResponseHandler } from "../../utils/defaultHandler";

export default defineWrappedResponseHandler(async (event, userSession) => {
  const client = await getBackendClient(event, true);

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
