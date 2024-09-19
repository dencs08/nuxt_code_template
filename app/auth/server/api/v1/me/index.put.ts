import { getBackendClient } from "~~/lib/backend";
import { defineWrappedResponseHandler } from "~~/server/utils/defaultHandler";

export default defineWrappedResponseHandler(async (event) => {
  const client = await getBackendClient(event);
  const user = await client.getCurrentUser();
  const body = await readBody(event);

  try {
    const response = await client.putMe(user, body);
    return { response };
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      statusMessage:
        "An error occurred during the deletion process " + err.message,
    });
  }
}, 0);
