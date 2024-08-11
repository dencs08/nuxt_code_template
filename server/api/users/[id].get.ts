import { getBackendClient } from "~~/lib/backend";
import { defineWrappedResponseHandler } from "../../utils/defaultHandler";

export default defineWrappedResponseHandler(async (event) => {
  const client = await getBackendClient(event, true);
  let user = {};
  const { id } = event.context.params as { id: string };

  try {
    user = await client.getUser(id);
    return user;
  } catch (err: any) {
    throw createError({
      statusCode: err.code,
      statusMessage: err.message,
    });
  }
}, 75);
