import { getBackendClient } from "~~/lib/backend";
import { defineWrappedResponseHandler } from "~~/server/utils/defaultHandler";

export default defineWrappedResponseHandler(async (event) => {
  const body = await readBody(event);
  const client = await getBackendClient(event, true);

  if (!body.roleId || !body.access_level) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required data",
    });
  }
  try {
    const response = await client.updateRole(body.roleId, body.access_level);
    return response;
  } catch (err: any) {
    throw createError({
      statusCode: err.code,
      statusMessage: err.message,
    });
  }
}, 100);
