import { defineWrappedResponseHandler } from "~~/app/core/server/utils/defaultHandler";
import { getBackendClient } from "~~/lib/backend";

export default defineWrappedResponseHandler(async (event, userSession) => {
  const body = await readBody(event);
  const client = await getBackendClient(event, true);
  const { id } = event.context.params as { id: string };

  if (!body.role_id || !body.id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required data",
    });
  }
  if (id !== body.id) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID mismatch",
    });
  }

  const response = await client.assignRole(body.id, body.role_id, userSession);
  return response;
}, 75);
