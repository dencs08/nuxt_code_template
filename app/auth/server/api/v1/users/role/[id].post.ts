import { defineApiHandler } from "~~/server/utils/api-handler";

export default defineApiHandler(async (event) => {
  const body = await readBody(event);
  const client = event.context.backendClient;
  const user = event.context.user;
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

  const response = await client.assignRole(body.id, body.role_id, user);
  return response;
});
