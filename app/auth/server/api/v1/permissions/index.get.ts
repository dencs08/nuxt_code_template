import { getBackendClient } from "~~/lib/backend";
import { defineWrappedResponseHandler } from "~~/server/utils/defaultHandler";

export default defineWrappedResponseHandler(async (event) => {
  const client = await getBackendClient(event, true);
  try {
    const response = await client.getAvailablePermissions();
    return response;
  } catch (error: any) {
    throw createError({
      statusCode: error.code,
      message: (error as Error).message,
    });
  }
}, 25);
