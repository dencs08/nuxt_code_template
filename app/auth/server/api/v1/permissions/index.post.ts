import { defineApiHandler } from "~~/server/utils/api-handler";

export default defineApiHandler(async (event) => {
  const body = await readBody(event);

  if (!body.userId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required data",
    });
  }

  const client = event.context.backendClient;
  try {
    const response = await client.getPermissions(body.userId);
    return response;
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: (error as Error).message,
    });
  }
});
