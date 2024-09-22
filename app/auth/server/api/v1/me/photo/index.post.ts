import { defineApiHandler } from "~~/server/utils/api-handler";

export default defineApiHandler(async (event) => {
  const body = await readBody(event);
  const user = event.context.user;
  if (!body.photoUrl) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required parameters",
    });
  }

  try {
    const client = event.context.backendClient;
    const response = await client.updateMePhoto(user.id, body.photoUrl);
    return response;
  } catch (error: any) {
    throw createError({
      statusCode: error.code || 500,
      statusMessage: error.statusMessage,
    });
  }
});
