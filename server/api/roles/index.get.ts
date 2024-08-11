import { defineWrappedResponseHandler } from "../../utils/defaultHandler";
import { getBackendClient } from "~~/lib/backend";
import { getRoles } from "~~/server/utils/role-cache";

export default defineWrappedResponseHandler(async (event) => {
  const client = await getBackendClient(event, true);

  try {
    // const response = await client.getRoles();
    const response = await getRoles(event);

    return response;
  } catch (err: any) {
    throw createError({
      statusCode: err.code,
      statusMessage: err.message,
    });
  }
}, 25);
