import { defineApiHandler } from "~~/server/utils/api-handler";

export default defineApiHandler(async (event) => {
  const body = await readBody(event);
  const client = event.context.backendClient;

  if (!body.id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required data",
    });
  }

  try {
    await client.updateUser(body);
    return body;
  } catch (err: any) {
    throw createError({
      statusCode: err.code,
      statusMessage: err.message,
    });
  }
});
