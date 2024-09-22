import { defineApiHandler } from "~~/server/utils/api-handler";
export default defineApiHandler(async (event) => {
  const client = event.context.backendClient;
  const user = event.context.user;
  const body = await readBody(event);

  try {
    const response = await client.updateMe(user, body);
    return response;
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      statusMessage:
        "An error occurred during the deletion process " + err.message,
    });
  }
});
