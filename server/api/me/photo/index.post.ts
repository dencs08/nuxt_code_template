import { getBackendClient } from "~~/lib/backend";
import { defineWrappedResponseHandler } from "~~/server/utils/defaultHandler";

export default defineWrappedResponseHandler(async (event) => {
  const body = await readBody(event);
  const { photoUrl } = body;

  if (!photoUrl) {
    throw createError({
      statusCode: 400,
      message: "Missing required parameters",
    });
  }

  const client = await getBackendClient(event);

  try {
    const user = await client.getMe();
    const response = await client.updateMePhoto(user.id, photoUrl);
    return response;
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: (error as Error).message,
    });
  }
}, "guest");
