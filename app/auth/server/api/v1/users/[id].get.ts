import { defineApiHandler } from "~~/server/utils/api-handler";

export default defineApiHandler(async (event) => {
  const client = event.context.backendClient;
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
});
