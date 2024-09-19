import { getBackendClient } from "~~/lib/backend";
import { defineWrappedResponseHandler } from "~~/server/utils/defaultHandler";

export default defineWrappedResponseHandler(async (event, userSession) => {
  const body = await readBody(event);

  if (!body.photoUrl) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required parameters",
    });
  }

  try {
    const client = await getBackendClient(event, true);
    const response = await client.updateMePhoto(userSession.id, body.photoUrl);
    return response;
  } catch (error: any) {
    throw createError({
      statusCode: error.code || 500,
      statusMessage: error.statusMessage,
    });
  }
}, 0);
